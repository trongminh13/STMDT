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
  updateProductsWorkflow,
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
  subcategoryHandle: string
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
    subcategoryHandle: "n8n-workflows",
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
    subcategoryHandle: "n8n-workflows",
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
    subcategoryHandle: "n8n-workflows",
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
    subcategoryHandle: "dify-agents",
    priceVnd: 349000,
    description: "Ứng dụng AI Agent thông minh xây dựng trên nền tảng Dify (export định dạng DSL hoàn chỉnh). Đóng vai trò chuyên viên tư vấn bán hàng chuyên nghiệp, hiểu sâu danh mục sản phẩm, tính toán giá khuyến mãi và tự động tạo đơn hàng nháp gửi qua Webhook vào hệ thống Medusa/Shopify.",
    thumbnail: "/images/brands/dify.svg",
    deliveryFormat: "Dify Application DSL (YAML)",
    runtimeEnv: "Dify CE >= 0.6.10 hoặc Dify Cloud",
    aiModel: "OpenAI GPT-4o / GPT-4o-mini",
    tokenEstimate: "~200.000 tokens/tháng (~25.000đ)",
    version: "v1.0.3",
    fileName: "Dify_Sales_Consultant_Agent_DSL_v1.0.yml",
  },
  // 5. AUT-MAK-01
  {
    sku: "AUT-MAK-01",
    title: "Kịch Bản Make.com Đồng Bộ Đơn Hàng Tự Động Vào Google Sheets & Zalo",
    categoryHandle: "tu-dong-hoa-workflow",
    subcategoryHandle: "make-blueprints",
    priceVnd: 179000,
    description: "File Blueprint xuất chuẩn từ Make.com kết nối Webhook thanh toán thành công (VietQR/PayOS/Stripe). Tự động ghi chép dữ liệu giao dịch vào Google Sheets kế toán, gửi thông báo chúc mừng kèm hóa đơn qua Zalo ZNS cho người mua và thông báo vào nhóm Telegram nội bộ doanh nghiệp.",
    thumbnail: "/images/brands/make.svg",
    deliveryFormat: "Make.com Blueprint JSON",
    runtimeEnv: "Make.com (Integromat) Core Plan trở lên",
    aiModel: "Không dùng AI (Logic tích hợp đa kênh)",
    tokenEstimate: "0 tokens",
    version: "v1.4.2",
    fileName: "Make_Blueprint_Order_Sync_Zalo_v1.4.json",
  },
  // 6. COD-BOL-01
  {
    sku: "COD-BOL-01",
    title: "Next.js 15 SaaS Starter Kit Tích Hợp VietQR & PayOS Chuẩn Production",
    categoryHandle: "ma-nguon-boilerplates",
    subcategoryHandle: "nextjs-ai-saas",
    priceVnd: 890000,
    description: "Bộ mã nguồn khởi tạo dự án SaaS AI hoàn chỉnh xây dựng với Next.js 15 App Router, React 19, Tailwind CSS v4 và PostgreSQL. Tích hợp sẵn xác thực phân quyền Supabase Auth, cổng thanh toán VietQR chuyển khoản ngân hàng tự động qua PayOS webhook, hệ thống bảng giá đa gói (Tiered Pricing) và giao diện Dark/Light mode hiện đại.",
    thumbnail: "/images/brands/nextjs.svg",
    deliveryFormat: "Full Source Code ZIP (Kèm tài liệu hướng dẫn .md)",
    runtimeEnv: "Node.js >= 20, Bun hoặc Docker",
    aiModel: "Tương thích SDK OpenAI, Anthropic, Gemini, DeepSeek",
    tokenEstimate: "Tùy lượng người dùng ứng dụng",
    version: "v2.0.0",
    fileName: "Nextjs15_SaaS_Starter_PayOS_VietQR_v2.0.zip",
  },
  // 7. COD-RAG-01
  {
    sku: "COD-RAG-01",
    title: "FastAPI RAG Pipeline Starter Kit Với Qdrant & DeepSeek",
    categoryHandle: "ma-nguon-boilerplates",
    subcategoryHandle: "fastapi-python-rag",
    priceVnd: 490000,
    description: "Khung backend API hiệu năng cao viết bằng Python FastAPI chuyên biệt cho hệ thống Hỏi-Đáp dữ liệu nội bộ (RAG). Sử dụng Qdrant Vector Database, mô hình embedding đa ngôn ngữ BAAI/bge-m3 và kết nối mô hình suy luận DeepSeek-R1/V3. Đã cấu hình sẵn Docker Compose, cơ chế Hybrid Search và re-ranking đạt độ chính xác cao.",
    thumbnail: "/images/brands/python.svg",
    deliveryFormat: "Full Source Code ZIP (Docker Compose + Requirements)",
    runtimeEnv: "Python 3.10+ / Docker & Docker Compose",
    aiModel: "DeepSeek-V3 / Ollama Local LLMs",
    tokenEstimate: "~500.000 tokens/tháng (~40.000đ)",
    version: "v1.3.0",
    fileName: "FastAPI_RAG_Qdrant_DeepSeek_Pipeline_v1.3.zip",
  },
  // 8. COD-SCR-01 (Mới)
  {
    sku: "COD-SCR-01",
    title: "Script Python Cào Dữ Liệu Thị Trường Thương Mại Điện Tử Đa Sàn",
    categoryHandle: "ma-nguon-boilerplates",
    subcategoryHandle: "scripts-automation",
    priceVnd: 249000,
    description: "Tool cào dữ liệu giá bán, đánh giá và tồn kho sản phẩm từ Shopee, Lazada, Tiki sử dụng Playwright và Stealth Plugin. Tự động bypass Cloudflare WAF, xoay vòng proxy, xuất dữ liệu ra SQLite/PostgreSQL và báo cáo biến động giá qua Telegram.",
    thumbnail: "/images/brands/python.svg",
    deliveryFormat: "Full Source Code ZIP",
    runtimeEnv: "Python >= 3.10 / Playwright",
    aiModel: "Không dùng AI",
    tokenEstimate: "0 tokens",
    version: "v2.3.0",
    fileName: "Ecom_Market_Scraper_Playwright_v2.3.zip",
  },
  // 9. SFT-EXT-02
  {
    sku: "SFT-EXT-02",
    title: "Chrome Extension Tóm Tắt Video YouTube & Xuất Mindmap Tự Động",
    categoryHandle: "phan-mem-tien-ich-so",
    subcategoryHandle: "chrome-extensions",
    priceVnd: 129000,
    description: "Tiện ích mở rộng Google Chrome (Manifest V3) phân tích phụ đề và nội dung video YouTube bằng AI trong 3 giây. Tự động trích xuất các ý chính theo dòng thời gian (Timestamp), tạo bản tóm tắt hành động (Action Items) và xuất sơ đồ tư duy dạng Markdown / Mermaid tương thích Notion và Obsidian.",
    thumbnail: "/images/brands/chrome.svg",
    deliveryFormat: "Chrome Extension Packed CRX & Unpacked ZIP",
    runtimeEnv: "Google Chrome, Cốc Cốc, Microsoft Edge, Brave",
    aiModel: "Google Gemini 2.0 Flash / OpenAI GPT-4o-mini",
    tokenEstimate: "Miễn phí theo hạn mức Gemini Free API (15 RPM)",
    version: "v1.1.5",
    fileName: "Chrome_Extension_YouTube_Mindmap_AI_v1.1.zip",
  },
  // 10. AIC-SYS-01 (Mới)
  {
    sku: "AIC-SYS-01",
    title: "Bộ System Prompt Master Senior Developer Cho Claude 3.5 & GPT-4o",
    categoryHandle: "goi-tri-thuc-prompt-ai",
    subcategoryHandle: "prompts-ky-thuat",
    priceVnd: 199000,
    description: "Bộ system prompt cấu trúc cao cấp dành cho Senior Developer và Tech Lead. Tối ưu hóa khả năng suy luận kiến trúc, refactoring không lỗi, sinh unit test tự động và phân tích bảo mật code theo chuẩn OWASP Top 10.",
    thumbnail: "/images/brands/claude.svg",
    deliveryFormat: "Prompt & Dataset",
    runtimeEnv: "Claude 3.5 Sonnet / OpenAI GPT-4o / Cursor IDE / Windsurf",
    aiModel: "Anthropic (Claude 3.5)",
    tokenEstimate: "~1.500 tokens/lượt prompt",
    version: "v2.1.0",
    fileName: "System_Prompt_Master_Senior_Dev_Pack_v2.1.json",
  },
  // 11. AIC-MKT-01 (Mới)
  {
    sku: "AIC-MKT-01",
    title: "Gói Prompt AI Copywriting Triệu View & Kịch Bản Video Ngắn Đa Kênh",
    categoryHandle: "goi-tri-thuc-prompt-ai",
    subcategoryHandle: "prompts-marketing",
    priceVnd: 149000,
    description: "Bộ 50+ prompt thực chiến sản xuất nội dung viral cho TikTok, Facebook Reels và YouTube Shorts. Bao gồm công thức viết hook 3 giây đầu, kịch bản storytelling giữ chân người xem và CTA chuyển đổi đơn hàng cao.",
    thumbnail: "/images/brands/openai.svg",
    deliveryFormat: "Prompt & Dataset",
    runtimeEnv: "ChatGPT Plus / Gemini Advanced / Claude",
    aiModel: "OpenAI (GPT-4o)",
    tokenEstimate: "~800 tokens/kịch bản",
    version: "v1.5.0",
    fileName: "Viral_Video_Copywriting_Prompt_Pack_v1.5.pdf",
  },
  // 12. AIC-RAG-01 (Mới)
  {
    sku: "AIC-RAG-01",
    title: "Bộ Tri Thức Vector Hóa RAG: Luật Doanh Nghiệp, Thuế & Kế Toán VN 2024",
    categoryHandle: "goi-tri-thuc-prompt-ai",
    subcategoryHandle: "rag-datasets",
    priceVnd: 499000,
    description: "Dataset tri thức doanh nghiệp Việt Nam hoàn chỉnh đã được làm sạch, phân đoạn (chunking 512 tokens có overlap) và định dạng chuẩn JSONL. Tích hợp sẵn metadata điều khoản, nghị định và hướng dẫn thuế mới nhất 2024 để import vào Qdrant/Pinecone.",
    thumbnail: "/images/brands/qdrant.svg",
    deliveryFormat: "Prompt & Dataset",
    runtimeEnv: "Qdrant / Milvus / ChromaDB / pgvector",
    aiModel: "OpenAI (GPT-4o)",
    tokenEstimate: "500.000 tokens vector",
    version: "v2024.2",
    fileName: "VN_Corporate_Tax_Law_RAG_Dataset_2024.jsonl",
  },
  // 13. AIC-PER-01 (Mới)
  {
    sku: "AIC-PER-01",
    title: "Bộ Persona Chuyên Gia Pháp Lý & Mẫu Dữ Liệu Huấn Luyện AI Doanh Nghiệp",
    categoryHandle: "goi-tri-thuc-prompt-ai",
    subcategoryHandle: "ai-personas",
    priceVnd: 299000,
    description: "Tập hợp 1.200 cặp hỏi-đáp (instruction-response) chuẩn pháp lý doanh nghiệp để fine-tuning mô hình ngôn ngữ mã nguồn mở (Llama-3, DeepSeek-V3). Kèm system card định hình phong thái tư vấn chuẩn mực, khách quan và chính xác.",
    thumbnail: "/images/brands/deepseek.svg",
    deliveryFormat: "Prompt & Dataset",
    runtimeEnv: "Unsloth / Hugging Face / Ollama",
    aiModel: "Ollama / Local LLM",
    tokenEstimate: "1.200 samples",
    version: "v1.0.0",
    fileName: "Corporate_Legal_Persona_FineTuning_v1.0.jsonl",
  },
  // 14. PRO-SET-01A
  {
    sku: "PRO-SET-01A",
    title: "Dịch Vụ Cài Đặt n8n Self-Hosted Trọn Gói Qua UltraViewer/AnyDesk",
    categoryHandle: "dich-vu-cai-dat-chuyen-mon",
    subcategoryHandle: "cai-dat-1-1",
    priceVnd: 499000,
    description: "Dịch vụ kỹ thuật viên cài đặt chuyên nghiệp: Thiết lập n8n phiên bản mới nhất trên VPS riêng (Ubuntu 22.04/24.04), cấu hình Docker Compose an toàn, trỏ tên miền phụ, cài chứng chỉ SSL Let's Encrypt tự động gia hạn, bảo mật Webhook và cấu hình gửi email SMTP thông báo lỗi.",
    thumbnail: "/images/brands/n8n.svg",
    deliveryFormat: "Dịch vụ Kỹ thuật Trực tiếp (Remote 1-on-1)",
    runtimeEnv: "VPS Cloudflare / DigitalOcean / Vultr / Linode",
    aiModel: "Không áp dụng",
    tokenEstimate: "0 tokens",
    version: "v1.0.0",
    fileName: "Bien_Ban_Ban_Giao_Cai_Dat_n8n_v1.0.pdf",
    isConciergeService: true,
    conciergeInstructions: "Sau khi đặt đơn thành công, kỹ sư kỹ thuật Đại Việt AI Studio sẽ liên hệ qua Zalo/Điện thoại trong vòng 30 phút để lên lịch hẹn kết nối hỗ trợ qua UltraViewer hoặc AnyDesk.",
  },
  // 15. PRO-CUS-01 (Mới)
  {
    sku: "PRO-CUS-01",
    title: "Dịch Vụ Tùy Biến Luồng Tự Động Hóa AI Doanh Nghiệp Theo Yêu Cầu",
    categoryHandle: "dich-vu-cai-dat-chuyen-mon",
    subcategoryHandle: "custom-workflows",
    priceVnd: 1500000,
    description: "Dịch vụ tư vấn, thiết kế và phát triển luồng tự động hóa n8n / Dify riêng biệt theo đúng nghiệp vụ của doanh nghiệp bạn. Bao gồm tích hợp CRM nội bộ, kết nối ERP/KiotViet, cấu hình AI Agent chuyên biệt và bảo hành vận hành 30 ngày.",
    thumbnail: "/images/brands/n8n.svg",
    deliveryFormat: "Dịch vụ Cài đặt 1-1",
    runtimeEnv: "Hạ tầng khách hàng (Cloud hoặc On-premise)",
    aiModel: "Đa mô hình (OpenAI / DeepSeek / Claude)",
    tokenEstimate: "Không giới hạn",
    version: "v1.0.0",
    fileName: "Hop_Dong_Dich_Vu_Custom_Workflow_AI.pdf",
    isConciergeService: true,
    conciergeInstructions: "Sau khi đặt đơn thành công, kỹ sư trưởng Đại Việt AI Studio sẽ liên hệ qua Zalo/Điện thoại trong vòng 2 giờ làm việc để tiếp nhận yêu cầu chi tiết và thiết lập kênh hỗ trợ kỹ thuật riêng.",
  },
  // 16. PRO-TRN-01
  {
    sku: "PRO-TRN-01",
    title: "Gói Đào Tạo 1-1 Xây Dựng AI Agent Tự Động Hóa Thực Chiến (3 Buổi)",
    categoryHandle: "dich-vu-cai-dat-chuyen-mon",
    subcategoryHandle: "dao-tao-chuyen-giao",
    priceVnd: 1990000,
    description: "Khóa huấn luyện chuyên sâu 1 kèm 1 (3 buổi x 2 giờ qua Google Meet/Zoom): Buổi 1: Kiến trúc n8n nâng cao & Webhook; Buổi 2: Tích hợp mô hình AI (OpenAI, DeepSeek) & Structured Output; Buổi 3: Xây dựng AI Agent hoàn chỉnh kết nối cơ sở dữ liệu và triển khai lên Production.",
    thumbnail: "/images/brands/google.svg",
    deliveryFormat: "Khóa học 1-1 Trực tuyến & Tài liệu Thực hành",
    runtimeEnv: "Google Meet + Tài khoản n8n Cloud thực hành",
    aiModel: "OpenAI GPT-4o, DeepSeek-V3",
    tokenEstimate: "Đã bao gồm token thực hành",
    version: "v2025.1",
    fileName: "Giao_Trinh_Dao_Tao_AI_Agent_Thuc_Chien_v2025.pdf",
    isConciergeService: true,
    conciergeInstructions: "Đội ngũ chuyên gia đào tạo sẽ gửi email xác nhận và liên hệ Zalo sắp xếp lịch học phù hợp với thời gian biểu của học viên trong vòng 24 giờ sau khi thanh toán.",
  },
  // 17. PRO-MNT-01 (Mới)
  {
    sku: "PRO-MNT-01",
    title: "Gói Giám Sát Vận Hành & Tối Ưu Chi Phí Token API LLM Hàng Tháng",
    categoryHandle: "dich-vu-cai-dat-chuyen-mon",
    subcategoryHandle: "bao-tri-toi-uu",
    priceVnd: 990000,
    description: "Dịch vụ giám sát độ sẵn sàng hệ thống AI 24/7, thiết lập gateway đệm bộ nhớ đệm (prompt caching), theo dõi tỷ lệ lỗi và tối ưu chi phí tiêu thụ token API LLM hàng tháng cho doanh nghiệp. Tiết kiệm từ 30% đến 50% chi phí OpenAI/Claude hàng tháng.",
    thumbnail: "/images/brands/cloudflare.svg",
    deliveryFormat: "Dịch vụ Cài đặt 1-1",
    runtimeEnv: "Cloudflare AI Gateway / Langfuse / Helicone",
    aiModel: "Đa mô hình (OpenAI / DeepSeek / Claude / Gemini)",
    tokenEstimate: "Tối ưu hóa toàn bộ hệ thống",
    version: "v1.0.0",
    fileName: "Cam_Ket_SLAs_Giam_Sat_Toi_Uu_Token.pdf",
    isConciergeService: true,
    conciergeInstructions: "Đội ngũ DevOps & AI Engineer sẽ kết nối trực tiếp vào hệ thống giám sát của doanh nghiệp, bàn giao dashboard trực quan trong 24 giờ sau khi thanh toán.",
  },
  // 18. DEV-REF-001 (0đ Free Tier)
  {
    sku: "DEV-REF-001",
    title: "Mã Nguồn Mẫu Next.js 15 AI SaaS Cơ Bản (Tham Chiếu Kỹ Thuật)",
    categoryHandle: "ma-nguon-boilerplates",
    subcategoryHandle: "nextjs-ai-saas",
    priceVnd: 0,
    description: "Mã nguồn tham chiếu mã nguồn mở (Open Source) cung cấp cấu trúc thư mục chuẩn Next.js 15 App Router, cấu hình Tailwind CSS, Prisma ORM và tích hợp OpenAI Streaming API cơ bản. Hoàn toàn miễn phí cho cộng đồng lập trình viên học tập và nghiên cứu.",
    thumbnail: "/images/categories/source-code.svg",
    deliveryFormat: "Source Code ZIP (GitHub Repository Export)",
    runtimeEnv: "Node.js >= 18, npm hoặc pnpm",
    aiModel: "OpenAI GPT-3.5/GPT-4o-mini",
    tokenEstimate: "Tùy nhu cầu phát triển cá nhân",
    version: "v1.0.0",
    fileName: "DevRef_Nextjs15_AI_SaaS_Starter_v1.0.zip",
  },
  // 19. DEV-REF-002 (0đ Free Tier)
  {
    sku: "DEV-REF-002",
    title: "Bộ 3 Workflow n8n Mẫu: Webhook, Báo Cáo Email & Cron Job",
    categoryHandle: "tu-dong-hoa-workflow",
    subcategoryHandle: "n8n-workflows",
    priceVnd: 0,
    description: "Gói 3 workflow n8n căn bản hoàn toàn miễn phí dành cho người mới bắt đầu: (1) Nhận Webhook và lưu vào Google Sheets, (2) Báo cáo thống kê hàng ngày gửi qua Gmail/SMTP, (3) Cron job kiểm tra trạng thái máy chủ ping định kỳ.",
    thumbnail: "/images/categories/automation-workflow.svg",
    deliveryFormat: "JSON Workflow Files ZIP",
    runtimeEnv: "n8n >= 1.0.0",
    aiModel: "Không dùng AI",
    tokenEstimate: "0 tokens",
    version: "v1.0.0",
    fileName: "DevRef_3_Basic_n8n_Workflows_v1.0.zip",
  },
  // 20. DEV-REF-003 (0đ Free Tier)
  {
    sku: "DEV-REF-003",
    title: "Chatbot Hỗ Trợ Khách Hàng Cơ Bản Cho Fanpage Facebook (Dify Template)",
    categoryHandle: "tu-dong-hoa-workflow",
    subcategoryHandle: "chatbot-voicebot",
    priceVnd: 0,
    description: "Kịch bản Dify DSL mẫu thiết lập trợ lý giải đáp câu hỏi thường gặp (FAQ) cho Fanpage bán hàng trực tuyến. Cung cấp sẵn cơ chế fallback chuyển tiếp tin nhắn cho nhân viên trực fanpage khi AI không thể trả lời chắc chắn.",
    thumbnail: "/images/categories/automation-workflow.svg",
    deliveryFormat: "Dify DSL YAML",
    runtimeEnv: "Dify Community Edition",
    aiModel: "OpenAI GPT-4o-mini / Gemini Flash",
    tokenEstimate: "~10.000 tokens thử nghiệm",
    version: "v1.0.0",
    fileName: "DevRef_Dify_Fanpage_Chatbot_Template_v1.0.yml",
  },
  // 21. TOOL-CLI-001 (0đ Free Tier)
  {
    sku: "TOOL-CLI-001",
    title: "SanAI Validator — Công Cụ CLI Kiểm Tra Gói Sản Phẩm Số Chuẩn Sàn",
    categoryHandle: "phan-mem-tien-ich-so",
    subcategoryHandle: "desktop-tools",
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
  // 22. DEV-REF-004 (0đ Free Tier)
  {
    sku: "DEV-REF-004",
    title: "Chrome Extension Mẫu Tóm Tắt Bài Viết Web Với Gemini Flash",
    categoryHandle: "phan-mem-tien-ich-so",
    subcategoryHandle: "chrome-extensions",
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

// Product Taxonomy 1.0: 5 Parent Categories + 20 Subcategories
interface SubcategoryDef {
  name: string
  handle: string
  rank: number
  description: string
}

interface ParentCategoryDef {
  name: string
  handle: string
  rank: number
  description: string
  subcategories: SubcategoryDef[]
}

const AI_TAXONOMY: ParentCategoryDef[] = [
  {
    name: "Tự Động Hóa & Workflow (AUT)",
    handle: "tu-dong-hoa-workflow",
    rank: 0,
    description: "Kịch bản tự động hóa quy trình kinh doanh, AI Agent và workflow đa kênh",
    subcategories: [
      { name: "n8n Workflows", handle: "n8n-workflows", rank: 0, description: "Kịch bản n8n tự động hóa doanh nghiệp & AI Agent" },
      { name: "Dify Agents & Workflows", handle: "dify-agents", rank: 1, description: "Ứng dụng & Agent thông minh trên nền tảng Dify" },
      { name: "Make.com Blueprints", handle: "make-blueprints", rank: 2, description: "Kịch bản tích hợp đa kênh Make / Zapier" },
      { name: "Chatbot & Voicebot Flows", handle: "chatbot-voicebot", rank: 3, description: "Luồng trợ lý ảo tư vấn & CSKH đa kênh" },
    ],
  },
  {
    name: "Mã Nguồn & Boilerplates (COD)",
    handle: "ma-nguon-boilerplates",
    rank: 1,
    description: "Khung ứng dụng hoàn chỉnh, mã nguồn khởi tạo SaaS AI và RAG Pipelines",
    subcategories: [
      { name: "Next.js AI SaaS Boilerplates", handle: "nextjs-ai-saas", rank: 0, description: "Khung ứng dụng AI SaaS đầy đủ thanh toán & auth" },
      { name: "FastAPI & Python RAG Kits", handle: "fastapi-python-rag", rank: 1, description: "Backend AI hiệu năng cao, vector database" },
      { name: "Scripts & Automation Tools", handle: "scripts-automation", rank: 2, description: "Tool cào dữ liệu, xử lý ảnh & video tự động" },
      { name: "AI APIs & Microservices", handle: "apis-microservices", rank: 3, description: "Cổng dịch vụ AI độc lập, dễ tích hợp" },
    ],
  },
  {
    name: "Phần Mềm & Tiện Ích Số (SFT)",
    handle: "phan-mem-tien-ich-so",
    rank: 2,
    description: "Công cụ mở rộng trình duyệt, plugin năng suất và ứng dụng desktop chuyên biệt",
    subcategories: [
      { name: "Chrome Extensions", handle: "chrome-extensions", rank: 0, description: "Tiện ích mở rộng trình duyệt tăng năng suất" },
      { name: "Plugins & Add-ons", handle: "plugins-addons", rank: 1, description: "Plugin Figma, Notion, Google Workspace" },
      { name: "Micro SaaS Web Apps", handle: "micro-saas", rank: 2, description: "Ứng dụng web chuyên biệt giải quyết bài toán cụ thể" },
      { name: "Desktop Tools & Utilities", handle: "desktop-tools", rank: 3, description: "Công cụ chạy offline, xử lý dữ liệu bảo mật" },
    ],
  },
  {
    name: "Gói Tri Thức & Prompt AI (AIC)",
    handle: "goi-tri-thuc-prompt-ai",
    rank: 3,
    description: "System prompts chuyên sâu, bộ dữ liệu RAG sạch và persona huấn luyện AI",
    subcategories: [
      { name: "Prompts Kỹ thuật & Coding", handle: "prompts-ky-thuat", rank: 0, description: "System prompt chuyên sâu cho Claude & GPT" },
      { name: "Prompts Marketing & Content", handle: "prompts-marketing", rank: 1, description: "Kịch bản content, SEO, quảng cáo tự động" },
      { name: "RAG Knowledge Datasets", handle: "rag-datasets", rank: 2, description: "Bộ dữ liệu tri thức sạch đã vector hóa" },
      { name: "AI Personas & Fine-tuning", handle: "ai-personas", rank: 3, description: "Bộ tính cách chuyên gia & dữ liệu mẫu" },
    ],
  },
  {
    name: "Dịch Vụ Cài Đặt Chuyên Môn (PRO)",
    handle: "dich-vu-cai-dat-chuyen-mon",
    rank: 4,
    description: "Dịch vụ kỹ thuật triển khai 1-1, tùy biến workflow và đào tạo chuyên sâu",
    subcategories: [
      { name: "Cài đặt & Triển khai 1-1", handle: "cai-dat-1-1", rank: 0, description: "Hỗ trợ setup qua UltraViewer / AnyDesk" },
      { name: "Tùy biến Workflow Doanh nghiệp", handle: "custom-workflows", rank: 1, description: "Thiết kế luồng tự động hóa theo yêu cầu" },
      { name: "Đào tạo & Chuyển giao AI", handle: "dao-tao-chuyen-giao", rank: 2, description: "Khóa huấn luyện nội bộ cho đội ngũ" },
      { name: "Bảo trì & Tối ưu Hệ thống AI", handle: "bao-tri-toi-uu", rank: 3, description: "Giám sát vận hành, tối ưu chi phí token API" },
    ],
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
        salesChannelsData: [
          {
            name: "Default Sales Channel",
            description: "Default Sales Channel for Đại Việt AI Marketplace",
          },
        ],
      },
    })
    defaultSalesChannel = salesChannelResult
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Đại Việt AI Marketplace",
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  })

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "vnd", is_default: true },
        { currency_code: "usd", is_default: false },
      ],
    },
  })

  // Publishable API Key
  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "type"],
    filters: { type: "publishable" },
  })

  let publishableApiKeyId: string
  if (apiKeys.length > 0) {
    publishableApiKeyId = apiKeys[0].id
  } else {
    const apiKeyModule = container.resolve(Modules.API_KEY)
    const newKey = await apiKeyModule.createApiKeys({
      title: "Đại Việt AI Storefront Key",
      type: "publishable",
      created_by: "system",
    })
    publishableApiKeyId = newKey.id
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKeyId,
      add: [defaultSalesChannel[0].id],
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

  // 3. Thiết lập Cây Danh Mục AI Đa Cấp: 5 Danh mục cha + 20 Danh mục con
  logger.info("[3/6] Thiết lập Cây Danh mục AI Đa cấp: 5 Danh mục cha & 20 Danh mục con...")
  const allExistingCats = await productModule.listProductCategories({}, {
    relations: ["parent_category", "category_children"]
  })
  const categoryMap = new Map(allExistingCats.map((c) => [c.handle, c]))

  // 3.1. Tạo các danh mục cha nếu chưa có
  const missingParents = AI_TAXONOMY.filter((p) => !categoryMap.has(p.handle))
  if (missingParents.length > 0) {
    logger.info(`Đang tạo ${missingParents.length} danh mục cha AI...`)
    const { result: createdParents } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingParents.map((c) => ({
          name: c.name,
          handle: c.handle,
          description: c.description,
          is_active: true,
          rank: c.rank,
        })),
      },
    })
    createdParents.forEach((c) => categoryMap.set(c.handle, c))
  }

  // 3.2. Tạo 20 danh mục con liên kết với danh mục cha tương ứng
  const childInputs: {
    name: string
    handle: string
    description: string
    is_active: boolean
    rank: number
    parent_category_id: string
  }[] = []

  for (const parentDef of AI_TAXONOMY) {
    const parentCat = categoryMap.get(parentDef.handle)
    if (!parentCat) continue

    for (const subDef of parentDef.subcategories) {
      if (!categoryMap.has(subDef.handle)) {
        childInputs.push({
          name: subDef.name,
          handle: subDef.handle,
          description: subDef.description,
          is_active: true,
          rank: subDef.rank,
          parent_category_id: parentCat.id,
        })
      }
    }
  }

  if (childInputs.length > 0) {
    logger.info(`Đang tạo ${childInputs.length} danh mục con AI chuyên môn...`)
    const { result: createdChildren } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: childInputs },
    })
    createdChildren.forEach((c) => categoryMap.set(c.handle, c))
  }
  logger.info(`Cây danh mục AI đã sẵn sàng: ${categoryMap.size} danh mục trong database.`)

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
        location: {
          name: "Đại Việt AI Studio Warehouse",
          address: {
            address_1: "Tầng 12, Tòa nhà Công Nghệ Đại Việt",
            city: "Hà Nội",
            country_code: "vn",
            postal_code: "100000",
          },
        },
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

  // 5. Tạo & Đồng bộ 22 Sản phẩm AI với Dual-linking Category
  logger.info("[5/6] Tạo và đồng bộ 22 Sản phẩm AI với chiến lược Dual-linking Category...")
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "metadata", "categories.id", "variants.id", "variants.sku"],
  })

  const productsToCreate: CreateProductDTO[] = []
  const productsToUpdateCategories: { id: string; category_ids: string[] }[] = []

  for (const item of AI_CATALOG) {
    const handle = `${item.sku.toLowerCase()}-${slugify(item.title)}`

    // Thu thập category_ids: cả cha VÀ con
    const targetCatIds: string[] = []
    if (item.categoryHandle && categoryMap.has(item.categoryHandle)) {
      targetCatIds.push(categoryMap.get(item.categoryHandle)!.id)
    }
    if (item.subcategoryHandle && categoryMap.has(item.subcategoryHandle)) {
      targetCatIds.push(categoryMap.get(item.subcategoryHandle)!.id)
    }

    const existingProd = (existingProducts as any[]).find((p) => {
      const matchSku = p.variants?.some((v: any) => v.sku === `${item.sku}-STD` || v.sku === item.sku)
      const matchMetaSku = p.metadata?.sku === item.sku
      const matchHandlePrefix = p.handle?.toLowerCase().startsWith(`${item.sku.toLowerCase()}-`)
      const matchHandle = p.handle === handle
      return matchSku || matchMetaSku || matchHandlePrefix || matchHandle
    })

    if (existingProd) {
      // Đã tồn tại -> kiểm tra xem đã đủ liên kết cha và con chưa
      const currentCatIds = ((existingProd.categories || []) as { id: string }[]).map((c) => c.id)
      const isMissingAnyCat = targetCatIds.some((id) => !currentCatIds.includes(id))
      if (isMissingAnyCat) {
        productsToUpdateCategories.push({
          id: existingProd.id,
          category_ids: Array.from(new Set([...currentCatIds, ...targetCatIds])),
        })
      }
      continue
    }

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
      category_ids: targetCatIds,
      status: ProductStatus.PUBLISHED,
      thumbnail: item.thumbnail,
      images: [{ url: item.thumbnail }],
      weight: 0,
      metadata,
      variants: [
        {
          title: item.isConciergeService ? "Gói Dịch Vụ Cài Đặt Trọn Gói" : "Bản Quyền Tiêu Chuẩn (Standard License)",
          sku: `${item.sku}-STD`,
          options: {},
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

  // Cập nhật dual-linking cho các sản phẩm đã có
  if (productsToUpdateCategories.length > 0) {
    logger.info(`Đang cập nhật liên kết category đa tầng cho ${productsToUpdateCategories.length} sản phẩm hiện có...`)
    await updateProductsWorkflow(container).run({
      input: {
        products: productsToUpdateCategories,
      },
    })
    logger.info("Đã cập nhật dual-linking cho sản phẩm hiện có thành công.")
  }

  // Tạo sản phẩm mới
  if (productsToCreate.length > 0) {
    logger.info(`Đang tạo ${productsToCreate.length} sản phẩm AI mới...`)
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
  })

  const offers: CreateOfferDTO[] = []

  for (const itemDef of AI_CATALOG) {
    const product = (createdProductsWithVariants as any[]).find((p) => {
      const hasStdSku = p.variants?.some((v: any) => v.sku === `${itemDef.sku}-STD`)
      if (hasStdSku) return true
      return (
        p.metadata?.sku === itemDef.sku ||
        p.handle?.toLowerCase().startsWith(`${itemDef.sku.toLowerCase()}-`)
      )
    })
    if (!product) continue

    const variant = (product.variants || []).find((v: any) => v.sku === `${itemDef.sku}-STD`) || (product.variants?.[0] as any)
    if (!variant) continue

    const offerSku = `OFFER-${itemDef.sku}-VN`

    // Kiểm tra xem SKU offer hoặc variant này đã có offer chưa
    const { data: existingOffersBySku } = await query.graph({
      entity: "offer",
      fields: ["id"],
      filters: { sku: offerSku },
    })
    const { data: existingOffersByVariant } = await query.graph({
      entity: "offer",
      fields: ["id"],
      filters: { variant_id: variant.id },
    })

    if (
      (!existingOffersBySku || existingOffersBySku.length === 0) &&
      (!existingOffersByVariant || existingOffersByVariant.length === 0)
    ) {
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
    }

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
            : itemDef.fileName.endsWith(".yml") || itemDef.fileName.endsWith(".yaml")
            ? "application/x-yaml"
            : itemDef.fileName.endsWith(".pdf")
            ? "application/pdf"
            : itemDef.fileName.endsWith(".jsonl")
            ? "application/x-ndjson"
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
    logger.info(`Đang tạo ${offers.length} offers mới với giá VNĐ...`)
    let successCount = 0
    for (const offer of offers) {
      try {
        await createOffersWorkflow(container).run({ input: { offers: [offer] } })
        successCount++
        logger.info(`Đã tạo offer thành công cho: ${offer.sku}`)
      } catch (err: any) {
        logger.warn(`Lỗi tạo offer ${offer.sku}: ${err.message}`)
      }
    }
    logger.info(`Hoàn tất tạo ${successCount}/${offers.length} offers mới với giá VNĐ tương ứng.`)
  }

  logger.info("=== HOÀN TẤT SEED HỆ THỐNG DANH MỤC & SẢN PHẨM ĐẠI VIỆT AI THÀNH CÔNG ===")
}
