export interface AiSpecificationItem {
  key: string
  label: string
  value: string
  badgeColor?: string
  isCode?: boolean
}

/**
 * Hợp nhất và chuẩn hóa các thông số kỹ thuật AI & Hàng số từ cả 2 nguồn:
 * 1. ProductAttribute quan hệ (platform, ai_model, delivery_format, skill_level)
 * 2. Product metadata (runtime_env, token_estimate, license, version, sha256...)
 * 
 * Loại bỏ 100% trùng lặp, ưu tiên thuộc tính quan hệ chuẩn và định dạng sang tiếng Việt.
 */
export function extractProductAiSpecifications(product: any): AiSpecificationItem[] {
  if (!product) return []

  const specs: AiSpecificationItem[] = []
  const attrMap: Record<string, string> = {}

  // 1. Thu thập từ product.attribute_values (nếu có)
  if (Array.isArray(product.attribute_values)) {
    for (const attr of product.attribute_values) {
      if (!attr) continue
      const handle =
        attr.attribute?.handle ||
        attr.attribute_id ||
        attr.attribute?.name?.toLowerCase().replace(/\s+/g, "_")
      const val =
        attr.value ||
        attr.attribute_value?.name ||
        attr.attribute_value?.handle
      if (handle && val) {
        attrMap[handle.toLowerCase()] = String(val)
      }
    }
  }

  // 2. Thu thập từ metadata
  const meta = product.metadata || {}

  // Nền tảng & Môi trường Runtime
  const platform =
    attrMap["platform"] ||
    meta.platform ||
    attrMap["nền_tảng_&_runtime"] ||
    meta.runtime_env ||
    meta.prerequisites
  if (platform) {
    specs.push({
      key: "platform",
      label: "Nền tảng & Môi trường",
      value: String(platform),
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    })
  }

  // Mô hình AI tương thích
  const aiModel =
    attrMap["ai_model"] ||
    meta.ai_model ||
    attrMap["mô_hình_ai_hỗ_trợ"] ||
    meta.ai_model_supported
  if (aiModel) {
    specs.push({
      key: "ai_model",
      label: "Mô hình AI tương thích",
      value: String(aiModel),
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    })
  }

  // Hình thức / Định dạng bàn giao
  const format =
    attrMap["delivery_format"] ||
    meta.delivery_format ||
    attrMap["hình_thức_bàn_giao"]
  if (format) {
    specs.push({
      key: "delivery_format",
      label: "Định dạng bàn giao",
      value: String(format),
    })
  }

  // Mức độ phức tạp / Kỹ năng
  const skill =
    attrMap["skill_level"] ||
    meta.skill_level ||
    attrMap["mức_độ_phức_tạp"]
  if (skill) {
    specs.push({
      key: "skill_level",
      label: "Độ phức tạp triển khai",
      value: String(skill),
    })
  }

  // Phiên bản phát hành
  const version = meta.version || meta.release_version || "v1.0.0"
  if (version) {
    specs.push({
      key: "version",
      label: "Phiên bản phát hành",
      value: String(version).startsWith("v") ? String(version) : `v${version}`,
    })
  }

  // Giấy phép bản quyền (License)
  const license = meta.license_type || meta.license || "Commercial Single-Use"
  if (license) {
    specs.push({
      key: "license_type",
      label: "Giấy phép bản quyền",
      value: String(license),
    })
  }

  // Ước tính chi phí Token / tháng
  if (meta.monthly_token_estimate) {
    specs.push({
      key: "token_estimate",
      label: "Ước tính Token hàng tháng",
      value: String(meta.monthly_token_estimate),
    })
  }

  // Cam kết chính sách hỗ trợ kỹ thuật
  if (meta.support_type) {
    specs.push({
      key: "support_type",
      label: "Hình thức hỗ trợ kỹ thuật",
      value: String(meta.support_type),
    })
  }

  // Chính sách bảo hành
  if (meta.refund_policy) {
    specs.push({
      key: "refund_policy",
      label: "Chính sách bảo hành sàn",
      value: String(meta.refund_policy),
    })
  }

  // Mã băm SHA-256 xác thực tệp tin
  if (meta.file_hash_sha256) {
    specs.push({
      key: "sha256",
      label: "Mã băm kiểm tra (SHA-256)",
      value: String(meta.file_hash_sha256),
      isCode: true,
    })
  }

  // Bổ sung các attribute tùy biến khác chưa xuất hiện ở trên
  if (Array.isArray(product.attribute_values)) {
    for (const attr of product.attribute_values) {
      if (!attr) continue
      const name = attr.attribute?.name || attr.name
      const val = attr.value || attr.attribute_value?.name
      const handle = (attr.attribute?.handle || "").toLowerCase()
      // Nếu đã nằm trong các key chuẩn thì bỏ qua
      if (
        ["platform", "ai_model", "delivery_format", "skill_level"].includes(handle) ||
        !name ||
        !val
      ) {
        continue
      }
      specs.push({
        key: handle || name.toLowerCase().replace(/\s+/g, "_"),
        label: name,
        value: String(val),
      })
    }
  }

  return specs
}
