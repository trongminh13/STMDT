import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { AttributeType } from "@mercurjs/types"
import {
  createProductAttributesWorkflow,
  addProductAttributesToProductWorkflow,
} from "@mercurjs/core/workflows"

const AI_ATTRIBUTE_DEFS = [
  {
    name: "Nền tảng & Runtime",
    handle: "platform",
    values: [
      "n8n",
      "Dify",
      "Make.com",
      "Next.js 15",
      "Python / FastAPI",
      "Docker",
      "Chrome Extension",
    ],
  },
  {
    name: "Mô hình AI hỗ trợ",
    handle: "ai_model",
    values: [
      "DeepSeek-V3 / R1",
      "OpenAI (GPT-4o)",
      "Anthropic (Claude 3.5)",
      "Gemini 2.0",
      "Ollama / Local LLM",
      "Không dùng AI",
    ],
  },
  {
    name: "Hình thức bàn giao",
    handle: "delivery_format",
    values: [
      "JSON Workflow File",
      "Full Source Code ZIP",
      "Dify DSL File",
      "Chrome Extension ZIP",
      "Prompt & Dataset",
      "Dịch vụ Cài đặt 1-1",
    ],
  },
  {
    name: "Mức độ phức tạp",
    handle: "skill_level",
    values: [
      "Mì ăn liền (< 5 phút)",
      "Cơ bản (Cần API Key)",
      "Nâng cao (Cần Dev/Docker)",
    ],
  },
]

type SeededAttribute = {
  id: string
  handle: string
  values: { id: string; name: string }[]
}

export default async function seedAiAttributes({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== BẮT ĐẦU SEED THUỘC TÍNH SẢN PHẨM HÀNG SỐ & AI CHO ĐẠI VIỆT AI ===")

  const loadAttributes = async () => {
    const { data } = await query.graph({
      entity: "product_attribute",
      fields: ["id", "handle", "values.id", "values.name"],
      filters: {
        handle: AI_ATTRIBUTE_DEFS.map((a) => a.handle),
        product_id: null,
      },
    })
    return new Map((data as SeededAttribute[]).map((a) => [a.handle, a]))
  }

  let attrByHandle = await loadAttributes()
  const missingAttrs = AI_ATTRIBUTE_DEFS.filter((a) => !attrByHandle.has(a.handle))

  if (missingAttrs.length > 0) {
    logger.info(`Đang tạo ${missingAttrs.length} thuộc tính AI mới...`)
    await createProductAttributesWorkflow(container).run({
      input: {
        attributes: missingAttrs.map((attr, index) => ({
          name: attr.name,
          handle: attr.handle,
          type: AttributeType.MULTI_SELECT,
          is_variant_axis: true,
          is_filterable: true,
          rank: index,
          values: attr.values.map((name, rank) => ({ name, rank })),
        })),
      },
    })
    attrByHandle = await loadAttributes()
  }

  const platformAttr = attrByHandle.get("platform")
  const aiModelAttr = attrByHandle.get("ai_model")
  const deliveryFormatAttr = attrByHandle.get("delivery_format")
  const skillLevelAttr = attrByHandle.get("skill_level")

  const getValueId = (attr: SeededAttribute | undefined, name: string): string | undefined =>
    attr?.values?.find((v) => v.name.toLowerCase() === name.toLowerCase())?.id

  // Đọc danh sách tất cả sản phẩm
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "metadata"],
  })

  logger.info(`Đã tìm thấy ${products.length} sản phẩm trong catalog. Đang phân bổ thuộc tính AI...`)

  for (const product of products) {
    const title = (product.title || "").toLowerCase()
    const meta = (product.metadata || {}) as Record<string, any>

    let platformVal = "n8n"
    if (title.includes("dify")) platformVal = "Dify"
    else if (title.includes("make")) platformVal = "Make.com"
    else if (title.includes("next.js") || title.includes("saas")) platformVal = "Next.js 15"
    else if (title.includes("fastapi") || title.includes("python")) platformVal = "Python / FastAPI"
    else if (title.includes("chrome")) platformVal = "Chrome Extension"
    else if (title.includes("docker") || title.includes("vps") || title.includes("cài đặt")) platformVal = "Docker"

    let aiModelVal = "DeepSeek-V3 / R1"
    if (title.includes("openai") || title.includes("gpt")) aiModelVal = "OpenAI (GPT-4o)"
    else if (title.includes("gemini")) aiModelVal = "Gemini 2.0"
    else if (title.includes("claude")) aiModelVal = "Anthropic (Claude 3.5)"
    else if (title.includes("không") || title.includes("sao lưu") || title.includes("cloudflare")) aiModelVal = "Không dùng AI"
    else if (title.includes("ollama") || title.includes("local")) aiModelVal = "Ollama / Local LLM"

    let deliveryVal = "JSON Workflow File"
    if (title.includes("boilerplate") || title.includes("starter kit") || title.includes("source code")) deliveryVal = "Full Source Code ZIP"
    else if (title.includes("dify") || title.includes("dsl")) deliveryVal = "Dify DSL File"
    else if (title.includes("chrome") || title.includes("extension")) deliveryVal = "Chrome Extension ZIP"
    else if (title.includes("prompt") || title.includes("dataset")) deliveryVal = "Prompt & Dataset"
    else if (title.includes("cài đặt") || title.includes("dịch vụ") || meta.is_concierge_service) deliveryVal = "Dịch vụ Cài đặt 1-1"

    let skillVal = "Mì ăn liền (< 5 phút)"
    if (deliveryVal === "Full Source Code ZIP" || platformVal === "Python / FastAPI") {
      skillVal = "Nâng cao (Cần Dev/Docker)"
    } else if (title.includes("api key") || title.includes("webhook") || deliveryVal === "Chrome Extension ZIP") {
      skillVal = "Cơ bản (Cần API Key)"
    }

    const addList: { id: string; value_ids: string[] }[] = []

    const pId = getValueId(platformAttr, platformVal)
    if (platformAttr && pId) addList.push({ id: platformAttr.id, value_ids: [pId] })

    const mId = getValueId(aiModelAttr, aiModelVal)
    if (aiModelAttr && mId) addList.push({ id: aiModelAttr.id, value_ids: [mId] })

    const dId = getValueId(deliveryFormatAttr, deliveryVal)
    if (deliveryFormatAttr && dId) addList.push({ id: deliveryFormatAttr.id, value_ids: [dId] })

    const sId = getValueId(skillLevelAttr, skillVal)
    if (skillLevelAttr && sId) addList.push({ id: skillLevelAttr.id, value_ids: [sId] })

    if (addList.length > 0) {
      try {
        await addProductAttributesToProductWorkflow(container).run({
          input: {
            product_id: product.id,
            add: addList,
          },
        })
      } catch (err: any) {
        logger.warn(`Gán thuộc tính cho sản phẩm "${product.title}" (${product.id}): ${err.message}`)
      }
    }
  }

  logger.info("=== HOÀN TẤT SEED VÀ GÁN THUỘC TÍNH SẢN PHẨM AI THÀNH CÔNG ===")
}
