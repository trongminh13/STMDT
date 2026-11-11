import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Danh sách handle của các sản phẩm test cũ cần dọn dẹp (soft-delete).
 * Đây là các sản phẩm được tạo trong giai đoạn thử nghiệm đầu tiên (30/10/2026),
 * không có seller offer, không có giá niêm yết chuẩn, và bị trùng lặp với sản phẩm chính thức.
 */
const TARGET_TEST_PRODUCT_HANDLES = new Set([
  "tro-ly-cskh-zalo-oa-1793346591",
  "trợ-lý-cskh-chốt-đơn-zalo-oa-tự-động-aut-biz-01",
])

export default async function cleanupLegacyTestProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = container.resolve(Modules.PRODUCT)

  logger.info("=== BẮT ĐẦU DỌN DẸP SẢN PHẨM THỬ NGHIỆM CŨ (30/10) TRONG DATABASE ===")

  try {
    // 1. Quét tìm tất cả sản phẩm trong database
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "created_at"],
    })

    const testProductsToDelete: { id: string; title: string; handle: string }[] = []

    for (const prod of products) {
      const handle = (prod.handle || "").trim()
      const title = (prod.title || "").trim()

      const isTargetHandle = TARGET_TEST_PRODUCT_HANDLES.has(handle)
      // Kiểm tra thêm các sản phẩm test có timestamp ngẫu nhiên hoặc không thuộc catalog chuẩn
      const isRandomTestHandle =
        handle.includes("1793346591") ||
        (handle.startsWith("tro-ly-cskh-zalo-oa-") && !handle.includes("-std"))

      if (isTargetHandle || isRandomTestHandle) {
        testProductsToDelete.push({ id: prod.id, title, handle })
      }
    }

    if (testProductsToDelete.length === 0) {
      logger.info("Database sạch sẽ! Không tìm thấy sản phẩm thử nghiệm cũ nào cần dọn dẹp.")
      return
    }

    logger.info(
      `Phát hiện ${testProductsToDelete.length} sản phẩm test cũ cần soft-delete:\n` +
        testProductsToDelete
          .map((p) => ` - [${p.id}] ${p.title} (handle: ${p.handle})`)
          .join("\n")
    )

    // 2. Chạy workflow soft-delete an toàn của Medusa
    await deleteProductsWorkflow(container).run({
      input: { ids: testProductsToDelete.map((p) => p.id) },
    })

    logger.info(`Đã soft-delete thành công ${testProductsToDelete.length} sản phẩm test cũ.`)
  } catch (err: any) {
    logger.error(`Lỗi trong quá trình dọn dẹp sản phẩm test cũ: ${err.message}`)
    throw err
  }

  logger.info("=== HOÀN TẤT DỌN DẸP SẢN PHẨM THỬ NGHIỆM TRONG DATABASE ===")
}
