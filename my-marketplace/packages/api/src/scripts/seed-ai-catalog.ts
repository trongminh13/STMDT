import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  ProductStatus,
  type CreateOfferDTO,
  type CreateProductDTO,
} from "@mercurjs/types"
import {
  approveSellerWorkflow,
  createOffersWorkflow,
  createSellerAccountWorkflow,
  createSellerShippingOptionsWorkflow,
  createSellerStockLocationsWorkflow,
  createProductsWorkflow,
} from "@mercurjs/core/workflows"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createLocationFulfillmentSetWorkflow,
  createProductCategoriesWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createServiceZonesWorkflow,
  createShippingProfilesWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { DIGITAL_ASSET_MODULE } from "../modules/digital-asset"

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies-ai",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[]
    store_id: string
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map((currency) => ({
            currency_code: currency.currency_code,
            is_default: currency.is_default ?? false,
          })),
        },
      }
    })

    const stores = updateStoresStep(normalizedInput)
    return new WorkflowResponse(stores)
  }
)

interface AIProductDefinition {
  sku: string
  title: string
  categoryHandle: string
  priceVnd: number
  description: string
  thumbnail: string
  deliveryFormat: string
  runtimeEnv: string
  aiModel: string
  tokenEstimate: string
  version: string
  fileName: string
  isConciergeService?: boolean
  conciergeInstructions?: string
}

const AI_CATALOG: AIProductDefinition[] = [
  // 1. AUT-BIZ-01
  {
    sku: "AUT-BIZ-01",
    title: "Workflow n8n Tự Động Chăm Sóc Khách Hàng Zalo OA",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 299000,
    description: "Kịch bản tự động hóa n8n hoàn chỉnh kết nối Zalo Official Account qua Webhook & Zalo OpenAPI. Tự động phản hồi tin nhắn khách hàng 24/7, gắn tag phân loại khách hàng theo intent, đồng bộ dữ liệu khách hàng tiềm năng vào Google Sheets/CRM và cảnh báo cho tư vấn viên khi phát hiện khách hàng VIP.",
    thumbnail: "/images/brands/zalo-oa.svg",
    deliveryFormat: "JSON Workflow File",
    runtimeEnv: "n8n >= 1.40.0 (Self-hosted hoặc n8n Cloud)",
    aiModel: "OpenAI GPT-4o-mini / DeepSeek-V3",
    tokenEstimate: "~50.000 tokens/tháng (~5.000đ)",
    version: "v1.2.0",
    fileName: "Workflow_n8n_Zalo_OA_Care_v1.2.json",
  },
  // 2. AUT-FIN-01
  {
    sku: "AUT-FIN-01",
    title: "Workflow n8n Bóc Tách Hóa Đơn Tự Động Với DeepSeek-V3",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 199000,
    description: "Giải pháp trích xuất dữ liệu hóa đơn điện tử (PDF, ảnh scan JPG/PNG) sử dụng mô hình DeepSeek-V3 Vision & Structured Output. Tự động bóc tách mã số thuế, tên đơn vị mua/bán, tổng tiền trước thuế, VAT và danh mục mặt hàng với độ chính xác trên 98%. Tự động kết xuất ra Google Sheets và lưu trữ tệp trên Cloudflare R2.",
    thumbnail: "/images/brands/deepseek.svg",
    deliveryFormat: "JSON Workflow File",
    runtimeEnv: "n8n >= 1.35.0",
    aiModel: "DeepSeek-V3 / DeepSeek-Chat",
    tokenEstimate: "~100.000 tokens/tháng (~8.000đ)",
    version: "v2.0.1",
    fileName: "Workflow_n8n_Invoice_Extractor_DeepSeek_v2.0.json",
  },
  // 3. AUT-OPS-01
  {
    sku: "AUT-OPS-01",
    title: "Workflow n8n Đồng Bộ Sao Lưu Dữ Liệu Lên Cloudflare R2",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 149000,
    description: "Kịch bản vận hành DevOps n8n tự động dump cơ sở dữ liệu PostgreSQL/MySQL theo định kỳ cronjob, nén mã hóa AES-256 và upload trực tiếp lên Cloudflare R2 (tương thích S3 zero egress fee). Gửi thông báo báo cáo trạng thái sao lưu và cảnh báo dung lượng qua Telegram Bot.",
    thumbnail: "/images/brands/cloudflare.svg",
    deliveryFormat: "JSON Workflow File",
    runtimeEnv: "n8n Docker / VPS Linux",
    aiModel: "Không yêu cầu AI (Thuần logic Cloudflare S3 API)",
    tokenEstimate: "0 tokens",
    version: "v1.1.0",
    fileName: "Workflow_n8n_Backup_Cloudflare_R2_v1.1.json",
  },
  // 4. AUT-DIF-01
  {
    sku: "AUT-DIF-01",
    title: "Agent Dify Tư Vấn Bán Hàng & Chốt Đơn Đa Kênh Tích Hợp OpenAI",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 199000,
    description: "Gói ứng dụng Dify DSL hoàn chỉnh thiết kế luồng Agentic Workflow với Memory, Knowledge Retrieval (RAG) và Tools Calling. Hỗ trợ tư vấn thông tin sản phẩm, báo giá thông minh, thu thập số điện thoại/địa chỉ giao hàng và gửi webhook tạo đơn hàng vào hệ thống ERP nội bộ.",
    thumbnail: "/images/brands/dify.svg",
    deliveryFormat: "Dify DSL File (.yml)",
    runtimeEnv: "Dify >= 0.6.10 (Self-hosted hoặc Dify Cloud)",
    aiModel: "OpenAI GPT-4o / GPT-4o-mini",
    tokenEstimate: "~150.000 tokens/tháng (~18.000đ)",
    version: "v1.4.0",
    fileName: "Dify_Agent_Sales_Consultant_v1.4.yml",
  },
  // 5. AUT-MAK-01
  {
    sku: "AUT-MAK-01",
    title: "Kịch Bản Make.com Đồng Bộ Đơn Hàng Tự Động Vào Google Sheets & Zalo",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 149000,
    description: "Blueprints Make.com (Integromat) chuyên dụng bắt Webhook khi có đơn hàng mới từ Landing Page, WooCommerce, TikTok Shop hoặc Medusa. Tự động chuẩn hóa dữ liệu, ghi sổ kế toán Google Sheets theo thời gian thực và bắn tin nhắn thông báo kèm mã VietQR cho khách hàng qua Zalo ZNS/OA.",
    thumbnail: "/images/brands/make.svg",
    deliveryFormat: "Make.com Blueprint JSON",
    runtimeEnv: "Make.com (Gói Free hoặc Core)",
    aiModel: "Không bắt buộc (Hỗ trợ mở rộng module AI)",
    tokenEstimate: "Tùy chọn mở rộng",
    version: "v1.0.3",
    fileName: "Make_Blueprint_Order_Sync_Sheets_Zalo_v1.0.json",
  },
  // 6. COD-BOL-01
  {
    sku: "COD-BOL-01",
    title: "Next.js 15 SaaS Starter Kit Tích Hợp VietQR & PayOS Chuẩn Production",
    categoryHandle: "ma-nguon-boilerplates",
    priceVnd: 490000,
    description: "Boilerplate Full-stack Next.js 15 (App Router, React 19, Tailwind CSS, shadcn/ui) tích hợp sẵn cổng thanh toán quét mã VietQR tự động qua payOS với Webhook xác thực chữ ký HMAC SHA256 an toàn. Đi kèm hệ thống xác thực Auth, quản lý subscription, Dashboard phân tích doanh thu và Docker compose chuẩn hóa sẵn sàng deploy Vercel/VPS.",
    thumbnail: "/images/brands/nextjs.svg",
    deliveryFormat: "Git Repository ZIP & Hướng Dẫn Cài Đặt",
    runtimeEnv: "Node.js >= 20 hoặc Bun >= 1.1",
    aiModel: "Tích hợp sẵn Gemini 2.0 Flash / OpenAI SDK",
    tokenEstimate: "Theo nhu cầu sử dụng thực tế của dự án",
    version: "v2.1.0",
    fileName: "Nextjs15_SaaS_VietQR_payOS_Boilerplate_v2.1.zip",
  },
  // 7. COD-RAG-01
  {
    sku: "COD-RAG-01",
    title: "FastAPI RAG Pipeline Starter Kit Với Qdrant & DeepSeek",
    categoryHandle: "ma-nguon-boilerplates",
    priceVnd: 390000,
    description: "Khung mã nguồn Backend Python FastAPI hiệu năng cao triển khai kiến trúc RAG hiện đại: Phân đoạn văn bản thông minh (Recursive Character & Semantic Chunking), Embeddings đa ngôn ngữ, Vector Database Qdrant và mô hình suy luận DeepSeek LLM. Hỗ trợ cơ chế Hybrid Search (Dense + Sparse BM25) và Reranker FlashRank.",
    thumbnail: "/images/brands/deepseek.svg",
    deliveryFormat: "Full Source Code ZIP + Dockerfile",
    runtimeEnv: "Python >= 3.10 / Docker Compose",
    aiModel: "DeepSeek-Chat, BAAI/bge-m3, Qdrant Vector DB",
    tokenEstimate: "Tùy lượng tài liệu index",
    version: "v1.3.0",
    fileName: "FastAPI_RAG_Pipeline_Qdrant_DeepSeek_v1.3.zip",
  },
  // 8. SFT-EXT-02
  {
    sku: "SFT-EXT-02",
    title: "Chrome Extension Tóm Tắt Video YouTube & Xuất Mindmap Tự Động",
    categoryHandle: "phan-mem-tien-ich-so",
    priceVnd: 69000,
    description: "Tiện ích mở rộng Google Chrome (Manifest V3) cho phép người dùng bóc tách phụ đề video YouTube và tạo bản tóm tắt ý chính theo timestamp chỉ với 1 cú click. Tính năng độc quyền: tự động chuyển đổi nội dung tóm tắt thành sơ đồ tư duy tương tác (Interactive Mindmap) và xuất ra file SVG, PNG, Markdown.",
    thumbnail: "/images/categories/extensions-tools.svg",
    deliveryFormat: "Chrome Extension ZIP & Hướng dẫn load unpacked",
    runtimeEnv: "Google Chrome / Microsoft Edge / Brave",
    aiModel: "Gemini 1.5 Flash / DeepSeek API (BYOK - Điền key cá nhân)",
    tokenEstimate: "~30.000 tokens/tháng",
    version: "v1.0.8",
    fileName: "ChromeExt_YouTube_Mindmap_Summarizer_v1.0.8.zip",
  },
  // 9. PRO-SET-01A (Concierge Service)
  {
    sku: "PRO-SET-01A",
    title: "Dịch Vụ Cài Đặt n8n Self-Hosted Trọn Gói Qua UltraViewer/AnyDesk",
    categoryHandle: "dich-vu-cai-dat-chuyen-mon",
    priceVnd: 200000,
    description: "Dịch vụ kỹ thuật chuyên nghiệp hỗ trợ cài đặt hoàn chỉnh n8n bản quyền Self-Hosted trên máy chủ Cloud/VPS của khách hàng (hoặc máy trạm công ty). Bao gồm: cấu hình Docker compose, PostgreSQL bảo mật, chứng chỉ SSL Let's Encrypt HTTPS, cấu hình SMTP gửi email và kết nối Zalo OA / Telegram Bot. Bàn giao trong 2 giờ làm việc qua UltraViewer.",
    thumbnail: "/images/categories/setup-service.svg",
    deliveryFormat: "Dịch Vụ Kỹ Thuật Remote 1-1 + Tài Liệu Bàn Giao",
    runtimeEnv: "Ubuntu 22.04 / 24.04 VPS (1GB RAM trở lên)",
    aiModel: "Không áp dụng",
    tokenEstimate: "0 tokens",
    version: "Standard SLA",
    fileName: "Huong_Dan_Chuan_Bi_Va_Lien_He_Cai_Dat_n8n.pdf",
    isConciergeService: true,
    conciergeInstructions: "Đơn hàng đã được ghi nhận. Kỹ thuật viên Đại Việt AI sẽ liên hệ hỗ trợ remote 1-1 qua Zalo OA hoặc Telegram trong vòng 30 phút.",
  },
  // 10. PRO-TRN-01 (Concierge Service)
  {
    sku: "PRO-TRN-01",
    title: "Gói Đào Tạo 1-1 Xây Dựng AI Agent Tự Động Hóa Thực Chiến",
    categoryHandle: "dich-vu-cai-dat-chuyen-mon",
    priceVnd: 490000,
    description: "Phiên coaching chuyên sâu 1 kèm 1 trong 90 phút qua Google Meet cùng Chuyên gia AI Đại Việt. Nội dung: Chẩn đoán quy trình doanh nghiệp hiện tại, lên kiến trúc giải pháp tự động hóa bằng n8n/Dify, hướng dẫn viết prompt chuyên sâu tối ưu chi phí token, trực tiếp xây dựng 01 quy trình tự động hóa hoàn chỉnh và bàn giao toàn bộ mã nguồn.",
    thumbnail: "/images/categories/setup-service.svg",
    deliveryFormat: "Phiên Đào Tạo Trực Tuyến 90 Phút + Recording + Source Code",
    runtimeEnv: "Google Meet / Trình duyệt Web",
    aiModel: "Khảo sát & ứng dụng mô hình theo bài toán doanh nghiệp",
    tokenEstimate: "Bao gồm token thực hành trong buổi học",
    version: "Mastery 1-on-1",
    fileName: "Quy_Trinh_Xac_Nhan_Lich_Dao_Tao_AI_Agent_1on1.pdf",
    isConciergeService: true,
    conciergeInstructions: "Đơn hàng đào tạo đã thanh toán thành công. Vui lòng bấm vào liên kết Zalo OA hoặc Telegram để chọn khung giờ học 1-1 thuận tiện nhất cho bạn.",
  },
  // 11. DEV-REF-001 (0đ Free Tier)
  {
    sku: "DEV-REF-001",
    title: "Mã Nguồn Mẫu Next.js 15 AI SaaS Cơ Bản (Tham Chiếu Kỹ Thuật)",
    categoryHandle: "ma-nguon-boilerplates",
    priceVnd: 0,
    description: "Gói mã nguồn tham chiếu mã nguồn mở chuẩn kỹ thuật của Đại Việt AI. Kiến trúc tinh gọn minh họa kết nối AI Streaming UI với Vercel AI SDK, quản lý state và cấu trúc thư mục chuẩn mực cho các bạn sinh viên và lập trình viên bắt đầu tiếp cận Next.js 15.",
    thumbnail: "/images/brands/nextjs.svg",
    deliveryFormat: "Git Repository Archive ZIP",
    runtimeEnv: "Node.js >= 18",
    aiModel: "OpenAI GPT-4o-mini / Gemini Flash",
    tokenEstimate: "Tùy chọn",
    version: "v1.0.0",
    fileName: "DevRef_Nextjs15_AI_SaaS_Basic_v1.0.zip",
  },
  // 12. DEV-REF-002 (0đ Free Tier)
  {
    sku: "DEV-REF-002",
    title: "Bộ 3 Workflow n8n Mẫu: Webhook, Báo Cáo Email & Cron Job",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 0,
    description: "Bộ kịch bản n8n cơ bản được thiết kế chuẩn mực dành cho người mới bắt đầu: (1) Tiếp nhận webhook và xác thực token, (2) Lập lịch định kỳ tổng hợp dữ liệu gửi email qua Gmail/Outlook, (3) Kiểm tra trạng thái máy chủ và cảnh báo lỗi. Tải về và import ngay không cần chỉnh sửa phức tạp.",
    thumbnail: "/images/brands/n8n.svg",
    deliveryFormat: "3 Tệp JSON Workflow",
    runtimeEnv: "n8n >= 1.0",
    aiModel: "Không bắt buộc",
    tokenEstimate: "0 tokens",
    version: "v1.0.0",
    fileName: "DevRef_n8n_Starter_Pack_3Workflows.zip",
  },
  // 13. DEV-REF-003 (0đ Free Tier)
  {
    sku: "DEV-REF-003",
    title: "Chatbot Hỗ Trợ Khách Hàng Cơ Bản Cho Fanpage Facebook (Dify Template)",
    categoryHandle: "tu-dong-hoa-workflow",
    priceVnd: 0,
    description: "Bản mẫu Dify Chatbot trực quan trả lời tự động câu hỏi thường gặp (FAQ) cho fanpage bán hàng online. Dễ dàng nhập khẩu tài liệu cửa hàng vào bộ nhớ kiến thức để bot tự động trích xuất thông tin tư vấn chính xác.",
    thumbnail: "/images/brands/dify.svg",
    deliveryFormat: "Dify Template DSL File (.yml)",
    runtimeEnv: "Dify Cloud / Self-hosted",
    aiModel: "DeepSeek-V3 / OpenAI GPT-4o-mini",
    tokenEstimate: "~20.000 tokens/tháng",
    version: "v1.0.1",
    fileName: "DevRef_Dify_Fanpage_FAQ_Chatbot_v1.0.yml",
  },
  // 14. TOOL-CLI-001 (0đ Free Tier)
  {
    sku: "TOOL-CLI-001",
    title: "SanAI Validator — Công Cụ CLI Kiểm Tra Gói Sản Phẩm Số Chuẩn Sàn",
    categoryHandle: "phan-mem-tien-ich-so",
    priceVnd: 0,
    description: "Tiện ích dòng lệnh (CLI Tool) viết bằng Node.js/TypeScript giúp các nhà sáng tạo (Creator & Seller) tự động kiểm tra cú pháp, tính toàn vẹn của tệp JSON workflow n8n, hash mã nguồn SHA256 và rà soát các trường Permission Manifest bắt buộc trước khi tải lên sàn Đại Việt AI.",
    thumbnail: "/images/categories/extensions-tools.svg",
    deliveryFormat: "NPM Package / Standalone Executable",
    runtimeEnv: "Node.js >= 18 hoặc Bun",
    aiModel: "Không yêu cầu AI",
    tokenEstimate: "0 tokens",
    version: "v1.0.0",
    fileName: "SanAI_Validator_CLI_v1.0.0.zip",
  },
  // 15. DEV-REF-004 (0đ Free Tier)
  {
    sku: "DEV-REF-004",
    title: "Chrome Extension Mẫu Tóm Tắt Bài Viết Web Với Gemini Flash",
    categoryHandle: "phan-mem-tien-ich-so",
    priceVnd: 0,
    description: "Mã nguồn Chrome Extension mẫu (Manifest V3) hướng dẫn chi tiết cách đọc DOM bài viết trên các trang báo điện tử và gửi nội dung qua Google Gemini API để nhận tóm tắt 3 gạch đầu dòng siêu tốc. Tài liệu tham khảo hữu ích cho các bạn phát triển tiện ích trình duyệt.",
    thumbnail: "/images/categories/extensions-tools.svg",
    deliveryFormat: "Source Code ZIP",
    runtimeEnv: "Chrome Browser Dev Mode",
    aiModel: "Gemini 2.0 Flash / Gemini 1.5 Flash",
    tokenEstimate: "~10.000 tokens/tháng",
    version: "v1.0.0",
    fileName: "DevRef_ChromeExt_Gemini_Summarizer_v1.0.zip",
  },
]

export default async function seedAiCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModule = container.resolve(Modules.STORE)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const regionModule = container.resolve(Modules.REGION)
  const taxModule = container.resolve(Modules.TAX)
  const productModule = container.resolve(Modules.PRODUCT)
  const authModule = container.resolve(Modules.AUTH)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const digitalAssetService = container.resolve(DIGITAL_ASSET_MODULE) as any

  logger.info("=== BẮT ĐẦU SEED HỆ THỐNG DANH MỤC & SẢN PHẨM ĐẠI VIỆT AI ===")

  // 1. Cập nhật Store Info & Tiền tệ VNĐ
  logger.info("[1/6] Cập nhật thông tin Store & Đơn vị tiền tệ VNĐ...")
  const [store] = await storeModule.listStores()
  let defaultSalesChannel = await salesChannelModule.listSalesChannels({
    name: "Default Sales Channel",
  })

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    })
    defaultSalesChannel = salesChannelResult
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "vnd", is_default: true },
        { currency_code: "usd", is_default: false },
        { currency_code: "eur", is_default: false },
      ],
    },
  })

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Đại Việt AI — Sàn Thương Mại Điện Tử Hàng Số & AI",
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  })

  // 2. Thiết lập Vùng Việt Nam (Region Vietnam)
  logger.info("[2/6] Kiểm tra và thiết lập Region Việt Nam (vnd)...")
  const existingRegions = await regionModule.listRegions({}, { relations: ["countries"] })
  let vnRegion = existingRegions.find((r) => r.currency_code === "vnd" || r.countries?.some((c) => c.iso_2 === "vn"))

  if (!vnRegion) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Việt Nam",
            currency_code: "vnd",
            countries: ["vn"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    vnRegion = regionResult[0]
  }

  // Tax region for VN
  const existingTaxRegions = await taxModule.listTaxRegions({ country_code: "vn" })
  if (!existingTaxRegions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "vn", provider_id: "tp_system" }],
    })
  }

  // 3. Thiết lập 5 Danh mục AI chuẩn Product Taxonomy 1.0
  logger.info("[3/6] Thiết lập 5 Danh mục sản phẩm AI chính thống...")
  const CATEGORIES = [
    { name: "Tự Động Hóa & Workflow (AUT)", handle: "tu-dong-hoa-workflow", rank: 0 },
    { name: "Mã Nguồn & Boilerplates (COD)", handle: "ma-nguon-boilerplates", rank: 1 },
    { name: "Phần Mềm & Tiện Ích Số (SFT)", handle: "phan-mem-tien-ich-so", rank: 2 },
    { name: "Gói Tri Thức & Prompt AI (AIC)", handle: "goi-tri-thuc-prompt-ai", rank: 3 },
    { name: "Dịch Vụ Cài Đặt Chuyên Môn (PRO)", handle: "dich-vu-cai-dat-chuyen-mon", rank: 4 },
  ]

  const existingCategories = await productModule.listProductCategories({
    handle: CATEGORIES.map((c) => c.handle),
  })
  const categoryMap = new Map(existingCategories.map((c) => [c.handle, c]))

  const missingCategories = CATEGORIES.filter((c) => !categoryMap.has(c.handle))
  if (missingCategories.length > 0) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((c) => ({
          name: c.name,
          handle: c.handle,
          is_active: true,
          rank: c.rank,
        })),
      },
    })
    result.forEach((c) => categoryMap.set(c.handle, c))
  }

  // 4. Thiết lập Seller Đại Việt AI Studio
  logger.info("[4/6] Khởi tạo Seller độc quyền: Đại Việt AI Studio...")
  const SELLER_EMAIL = "creator.ai@daiviet.edu.vn"
  const SELLER_PASSWORD = "Password123!"

  let authIdentityId: string
  const registerResponse = await authModule.register("emailpass", {
    body: { email: SELLER_EMAIL, password: SELLER_PASSWORD },
  })

  if (registerResponse.success && registerResponse.authIdentity) {
    authIdentityId = registerResponse.authIdentity.id
  } else {
    const [providerIdentity] = await authModule.listProviderIdentities({
      entity_id: SELLER_EMAIL,
      provider: "emailpass",
    })
    authIdentityId = providerIdentity.auth_identity_id!
  }

  // Kiểm tra seller đã tồn tại chưa
  const { data: existingSellers } = await query.graph({
    entity: "seller",
    fields: ["id", "name", "members.id"],
    filters: { email: SELLER_EMAIL },
  })

  let sellerId: string
  let sellerMemberId: string = ""

  if (existingSellers.length > 0) {
    sellerId = existingSellers[0].id
    sellerMemberId = existingSellers[0].members?.[0]?.id || ""
  } else {
    const { result: seller } = await createSellerAccountWorkflow(container).run({
      input: {
        auth_identity_id: authIdentityId,
        member_email: SELLER_EMAIL,
        first_name: "Đại Việt",
        last_name: "AI Studio",
        seller: {
          name: "Đại Việt AI Studio",
          email: SELLER_EMAIL,
          currency_code: "vnd",
          description: "Đại Việt AI Studio — Nhà sáng tạo giải pháp Tự động hóa, Mã nguồn và Trí tuệ Nhân tạo thực chiến.",
          logo: "/images/brands/deepseek.svg",
          banner: "/images/hero-banner-tech.svg",
        },
      },
    })
    sellerId = seller.id
    await approveSellerWorkflow(container).run({ input: { seller_id: seller.id } })

    const { data: members } = await query.graph({
      entity: "member",
      fields: ["id"],
      filters: { email: SELLER_EMAIL },
    })
    sellerMemberId = members[0].id
  }

  // Stock location & Shipping profile
  const { data: stockLocationsData } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
    filters: { name: "Đại Việt AI Studio Warehouse" },
  })

  let stockLocationId: string
  if (stockLocationsData.length > 0) {
    stockLocationId = stockLocationsData[0].id
  } else {
    const { result: locations } = await createSellerStockLocationsWorkflow(container).run({
      input: {
        seller_id: sellerId,
        locations: [
          {
            name: "Đại Việt AI Studio Warehouse",
            address: {
              city: "Hà Nội",
              country_code: "vn",
              address_1: "Đại học Đại Việt, Hà Nội",
            },
          },
        ],
      },
    })
    stockLocationId = locations[0].id

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })

    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: {
        id: stockLocationId,
        add: [defaultSalesChannel[0].id],
      },
    })

    await createLocationFulfillmentSetWorkflow(container).run({
      input: {
        location_id: stockLocationId,
        fulfillment_set_data: {
          name: "Đại Việt AI Delivery",
          type: "shipping",
        },
      },
    })
  }

  // Shipping profile
  let shippingProfiles = await fulfillmentModule.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfiles.length) {
    const { result: createdProfiles } = await createShippingProfilesWorkflow(container).run({
      input: {
        data: [{ name: "Default Shipping Profile", type: "default" }],
      },
    })
    shippingProfiles = createdProfiles
  }
  const shippingProfileId = shippingProfiles[0].id

  // 5. Tạo 15 Sản phẩm AI & Metadata Manifest
  logger.info("[5/6] Tạo 15 Sản phẩm AI với Permission Manifest JSONB chuẩn...")
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const existingProducts = await productModule.listProducts({
    handle: AI_CATALOG.map((p) => `${p.sku.toLowerCase()}-${slugify(p.title)}`),
  })
  const existingProductHandles = new Set(existingProducts.map((p) => p.handle))

  const productsToCreate: CreateProductDTO[] = []

  for (const item of AI_CATALOG) {
    const handle = `${item.sku.toLowerCase()}-${slugify(item.title)}`
    if (existingProductHandles.has(handle)) {
      logger.info(`Sản phẩm ${item.sku} đã tồn tại, bỏ qua tạo mới.`)
      continue
    }

    const cat = categoryMap.get(item.categoryHandle)
    const categoryIds = cat ? [cat.id] : []

    // Xây dựng Permission Manifest JSONB 16 trường chuẩn
    const metadata: Record<string, any> = {
      sku: item.sku,
      category_code: item.categoryHandle.split("-")[0].toUpperCase(),
      runtime_env: item.runtimeEnv,
      ai_model_supported: item.aiModel,
      monthly_token_estimate: item.tokenEstimate,
      prerequisites: item.runtimeEnv,
      delivery_format: item.deliveryFormat,
      license_type: item.priceVnd === 0 ? "Open-Source Free Tier" : "Commercial Single-Use",
      pricing_model: item.priceVnd === 0 ? "free" : "one-time",
      refund_policy: "Chính sách bảo đảm chất lượng & đổi trả theo quy chế sàn T+3",
      support_type: item.isConciergeService ? "1-on-1 Remote Video/AnyDesk Call" : "Tài liệu kỹ thuật & Hỗ trợ cộng đồng Zalo",
      version: item.version,
      file_name: item.fileName,
      file_hash_sha256: `sha256-${Buffer.from(item.sku + item.version).toString("hex")}`,
      hardware_requirements: "Máy tính cá nhân kết nối Internet tiêu chuẩn",
      external_services: item.aiModel,
      author_badge: "Đại Việt AI Verified Creator",
      ...(item.isConciergeService && {
        is_concierge_service: true,
        concierge_instructions: item.conciergeInstructions,
      }),
    }

    let platformVal = "n8n"
    if (item.title.toLowerCase().includes("dify")) platformVal = "Dify"
    else if (item.title.toLowerCase().includes("make")) platformVal = "Make.com"
    else if (item.title.toLowerCase().includes("next.js") || item.title.toLowerCase().includes("saas")) platformVal = "Next.js 15"
    else if (item.title.toLowerCase().includes("fastapi") || item.title.toLowerCase().includes("python")) platformVal = "Python / FastAPI"
    else if (item.title.toLowerCase().includes("chrome")) platformVal = "Chrome Extension"
    else if (item.title.toLowerCase().includes("docker") || item.title.toLowerCase().includes("vps") || item.title.toLowerCase().includes("cài đặt")) platformVal = "Docker"

    let aiModelVal = "DeepSeek-V3 / R1"
    if (item.title.toLowerCase().includes("openai") || item.title.toLowerCase().includes("gpt")) aiModelVal = "OpenAI (GPT-4o)"
    else if (item.title.toLowerCase().includes("gemini")) aiModelVal = "Gemini 2.0"
    else if (item.title.toLowerCase().includes("claude")) aiModelVal = "Anthropic (Claude 3.5)"
    else if (item.title.toLowerCase().includes("không") || item.title.toLowerCase().includes("sao lưu") || item.title.toLowerCase().includes("cloudflare")) aiModelVal = "Không dùng AI"
    else if (item.title.toLowerCase().includes("ollama") || item.title.toLowerCase().includes("local")) aiModelVal = "Ollama / Local LLM"

    let deliveryVal = "JSON Workflow File"
    if (item.title.toLowerCase().includes("boilerplate") || item.title.toLowerCase().includes("starter kit") || item.title.toLowerCase().includes("source code")) deliveryVal = "Full Source Code ZIP"
    else if (item.title.toLowerCase().includes("dify") || item.title.toLowerCase().includes("dsl")) deliveryVal = "Dify DSL File"
    else if (item.title.toLowerCase().includes("chrome") || item.title.toLowerCase().includes("extension")) deliveryVal = "Chrome Extension ZIP"
    else if (item.title.toLowerCase().includes("prompt") || item.title.toLowerCase().includes("dataset")) deliveryVal = "Prompt & Dataset"
    else if (item.title.toLowerCase().includes("cài đặt") || item.title.toLowerCase().includes("dịch vụ") || item.isConciergeService) deliveryVal = "Dịch vụ Cài đặt 1-1"

    let skillVal = "Mì ăn liền (< 5 phút)"
    if (deliveryVal === "Full Source Code ZIP" || platformVal === "Python / FastAPI") {
      skillVal = "Nâng cao (Cần Dev/Docker)"
    } else if (item.title.toLowerCase().includes("api key") || item.title.toLowerCase().includes("webhook") || deliveryVal === "Chrome Extension ZIP") {
      skillVal = "Cơ bản (Cần API Key)"
    }

    productsToCreate.push({
      title: item.title,
      handle,
      description: item.description,
      category_ids: categoryIds,
      status: ProductStatus.PUBLISHED,
      thumbnail: item.thumbnail,
      images: [{ url: item.thumbnail }],
      weight: 0,
      metadata,
      variants: [
        {
          title: item.isConciergeService ? "Gói Dịch Vụ Cài Đặt Trọn Gói" : "Bản Quyền Tiêu Chuẩn (Standard License)",
          sku: `${item.sku}-STD`,
          options: {
            "Nền tảng & Runtime": platformVal,
            "Mô hình AI hỗ trợ": aiModelVal,
            "Hình thức bàn giao": deliveryVal,
            "Mức độ phức tạp": skillVal,
          },
          metadata: {
            sku: item.sku,
            file_name: item.fileName,
            platform: platformVal,
            ai_model: aiModelVal,
            delivery_format: deliveryVal,
            skill_level: skillVal,
            ...(item.isConciergeService && { is_concierge_service: true }),
          },
        },
      ],
    })
  }

  if (productsToCreate.length > 0) {
    await createProductsWorkflow(container).run({
      input: {
        created_by: sellerMemberId!,
        products: productsToCreate,
      },
    })
    logger.info(`Đã tạo thành công ${productsToCreate.length} sản phẩm AI mới.`)
  }

  // 6. Tạo Offers & Digital Assets liên kết
  logger.info("[6/6] Khởi tạo Offers giá VNĐ và Tệp tài sản số liên kết...")
  const { data: createdProductsWithVariants } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "metadata", "variants.id", "variants.sku", "variants.metadata"],
    filters: {
      handle: AI_CATALOG.map((p) => `${p.sku.toLowerCase()}-${slugify(p.title)}`),
    },
  })

  const offers: CreateOfferDTO[] = []

  for (const product of createdProductsWithVariants) {
    const itemDef = AI_CATALOG.find((p) => product.handle?.startsWith(p.sku.toLowerCase()))
    if (!itemDef) continue

    const variant = product.variants?.[0] as any
    if (!variant) continue

    const offerSku = `OFFER-${itemDef.sku}-VN`
    offers.push({
      seller_id: sellerId!,
      created_by: sellerMemberId!,
      sku: offerSku,
      variant_id: variant.id,
      shipping_profile_id: shippingProfileId,
      inventory_items: [
        {
          sku: offerSku,
          stock_levels: [
            {
              location_id: stockLocationId!,
              stocked_quantity: 1000000,
            },
          ],
        },
      ],
      prices: [
        { amount: itemDef.priceVnd, currency_code: "vnd" },
        { amount: Math.round(itemDef.priceVnd / 25000), currency_code: "usd" },
      ],
    })

    // Tạo digital asset cho variant nếu chưa có
    try {
      const { data: existingAssets } = await query.graph({
        entity: "digital_asset",
        fields: ["id", "product_variant.*"],
        filters: {
          product_variant: { id: variant.id },
        },
      })

      if (!existingAssets || existingAssets.length === 0) {
        const newAsset = await digitalAssetService.createDigitalAssets({
          name: itemDef.fileName,
          file_id: `file_${itemDef.sku.toLowerCase().replace(/-/g, "_")}`,
          mime_type: itemDef.fileName.endsWith(".json")
            ? "application/json"
            : itemDef.fileName.endsWith(".yml")
            ? "application/x-yaml"
            : itemDef.fileName.endsWith(".pdf")
            ? "application/pdf"
            : "application/zip",
          is_revoked: false,
          metadata: {
            sku: itemDef.sku,
            version: itemDef.version,
            price_vnd: itemDef.priceVnd,
            ...(itemDef.isConciergeService && { is_concierge_service: true }),
          },
        })

        await link.create({
          [DIGITAL_ASSET_MODULE]: { digital_asset_id: newAsset.id },
          [Modules.PRODUCT]: { product_variant_id: variant.id },
        })
      }
    } catch (e: any) {
      logger.warn(`Lỗi tạo digital asset cho ${itemDef.sku}: ${e.message}`)
    }
  }

  if (offers.length > 0) {
    try {
      await createOffersWorkflow(container).run({ input: { offers } })
      logger.info(`Đã tạo thành công ${offers.length} offers với giá VNĐ tương ứng.`)
    } catch (err: any) {
      logger.warn(`Offers creation notice: ${err.message}`)
    }
  }

  logger.info("=== HOÀN TẤT SEED HỆ THỐNG DANH MỤC & SẢN PHẨM ĐẠI VIỆT AI THÀNH CÔNG ===")
}
