import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

const LEGACY_IDENTIFIERS = new Set([
  // Parent categories
  "sandals",
  "sneakers",
  "boots",
  "sport",
  "accessories",
  // Child categories
  "slides",
  "flip-flops",
  "flip flops",
  "clogs",
  "low-top",
  "low top",
  "high-top",
  "high top",
  "retro",
  "chelsea-boots",
  "chelsea boots",
  "winter-boots",
  "winter boots",
  "work-boots",
  "work boots",
  "football",
  "running",
  "basketball",
  "bags",
  "headwear",
  "wallets",
])

export default async function cleanupLegacyCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const productModule = container.resolve(Modules.PRODUCT)

  logger.info("=== BẮT ĐẦU DỌN DẸP DANH MỤC & SẢN PHẨM GIÀY DÉP/THỜI TRANG TÀN DƯ ===")

  // 1. Quét tìm tất cả danh mục hiện có trong Database
  const allCategories = await productModule.listProductCategories(
    {},
    { relations: ["parent_category", "category_children"] }
  )

  const legacyCategories = allCategories.filter((cat) => {
    const handle = (cat.handle || "").toLowerCase()
    const name = (cat.name || "").toLowerCase()
    return LEGACY_IDENTIFIERS.has(handle) || LEGACY_IDENTIFIERS.has(name)
  })

  logger.info(`Đã phát hiện ${legacyCategories.length} danh mục thời trang/giày dép cần dọn dẹp.`)

  if (legacyCategories.length === 0) {
    logger.info("Database sạch sẽ, không phát hiện danh mục thời trang tàn dư nào.")
    return
  }

  const legacyCatIds = new Set(legacyCategories.map((c) => c.id))

  // 2. Kiểm tra và dọn dẹp các sản phẩm demo cũ thuộc danh mục này
  try {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "handle", "categories.id"],
    })

    const demoProductsToDelete: string[] = []

    for (const prod of products) {
      const prodCategories = (prod.categories || []) as { id: string }[]
      const isLinkedToLegacy = prodCategories.some((c) => legacyCatIds.has(c.id))
      const isAiProduct =
        (prod.handle || "").startsWith("aut-") ||
        (prod.handle || "").startsWith("cod-") ||
        (prod.handle || "").startsWith("sft-") ||
        (prod.handle || "").startsWith("aic-") ||
        (prod.handle || "").startsWith("pro-") ||
        (prod.handle || "").startsWith("dev-") ||
        (prod.handle || "").startsWith("tool-")

      // Nếu sản phẩm liên kết với category giày dép và không phải sản phẩm AI Đại Việt
      if (isLinkedToLegacy && !isAiProduct) {
        demoProductsToDelete.push(prod.id)
      }
    }

    if (demoProductsToDelete.length > 0) {
      logger.info(`Đang xóa ${demoProductsToDelete.length} sản phẩm demo giày dép mồ côi...`)
      await deleteProductsWorkflow(container).run({
        input: { ids: demoProductsToDelete },
      })
      logger.info(`Đã xóa thành công ${demoProductsToDelete.length} sản phẩm demo cũ.`)
    }
  } catch (err: any) {
    logger.warn(`Lưu ý kiểm tra sản phẩm demo: ${err.message}`)
  }

  // 3. Xóa các danh mục con (depth = 1) trước để đảm bảo tính toàn vẹn cây danh mục
  const childCategories = legacyCategories.filter((c) => c.parent_category_id !== null)
  if (childCategories.length > 0) {
    logger.info(`Đang xóa ${childCategories.length} danh mục con giày dép (depth 1)...`)
    try {
      await deleteProductCategoriesWorkflow(container).run({
        input: childCategories.map((c) => c.id),
      })
      logger.info(`Đã xóa thành công ${childCategories.length} danh mục con.`)
    } catch (err: any) {
      logger.error(`Lỗi khi xóa danh mục con: ${err.message}`)
      throw err
    }
  }

  // 4. Xóa các danh mục cha (depth = 0)
  const parentCategories = legacyCategories.filter((c) => c.parent_category_id === null)
  if (parentCategories.length > 0) {
    logger.info(`Đang xóa ${parentCategories.length} danh mục cha giày dép (depth 0)...`)
    try {
      await deleteProductCategoriesWorkflow(container).run({
        input: parentCategories.map((c) => c.id),
      })
      logger.info(`Đã xóa thành công ${parentCategories.length} danh mục cha.`)
    } catch (err: any) {
      logger.error(`Lỗi khi xóa danh mục cha: ${err.message}`)
      throw err
    }
  }

  logger.info("=== HOÀN TẤT DỌN DẸP SẠCH BÓNG DANH MỤC THỜI TRANG TRONG DATABASE ===")
}
