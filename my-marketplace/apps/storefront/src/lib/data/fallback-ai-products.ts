import { HttpTypes } from "@medusajs/types"

export type FallbackProductItem = HttpTypes.StoreProduct & {
  attributes_map: {
    platform: string
    ai_model: string
    delivery_format: string
    skill_level: string
  }
}

export const FALLBACK_AI_PRODUCTS: FallbackProductItem[] = [
  // 1. Next.js 15 Boilerplate Commercial
  {
    id: "prod_cod_bol_01",
    title: "Next.js 15 SaaS Starter Kit Tích Hợp VietQR & PayOS Chuẩn Production",
    handle: "cod-bol-01-nextjs-15-saas-starter-kit-vietqr-payos",
    description: "Boilerplate Full-stack Next.js 15 (App Router, React 19, Tailwind CSS, shadcn/ui) tích hợp sẵn cổng thanh toán quét mã VietQR tự động qua payOS với Webhook xác thực chữ ký HMAC SHA256 an toàn. Đi kèm hệ thống xác thực Auth, quản lý subscription, Dashboard phân tích doanh thu và Docker compose chuẩn hóa sẵn sàng deploy Vercel/VPS.",
    thumbnail: "/images/brands/nextjs.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_ma_nguon", name: "Mã Nguồn & Boilerplates", handle: "ma-nguon-boilerplates" } as any,
    ],
    metadata: {
      sku: "COD-BOL-01",
      platform: "Next.js 15",
      ai_model: "Gemini 2.0",
      delivery_format: "Full Source Code ZIP",
      skill_level: "Nâng cao (Cần Dev/Docker)",
      runtime_env: "Node.js >= 20 hoặc Bun >= 1.1",
      license_type: "Commercial Single-Use",
    },
    attributes_map: {
      platform: "Next.js 15",
      ai_model: "Gemini 2.0",
      delivery_format: "Full Source Code ZIP",
      skill_level: "Nâng cao (Cần Dev/Docker)",
    },
    variants: [
      {
        id: "variant_cod_bol_01",
        title: "Bản Quyền Tiêu Chuẩn (Standard License)",
        sku: "COD-BOL-01-STD",
        options: [
          { id: "opt_1", value: "Next.js 15" } as any,
          { id: "opt_2", value: "Gemini 2.0" } as any,
          { id: "opt_3", value: "Full Source Code ZIP" } as any,
          { id: "opt_4", value: "Nâng cao (Cần Dev/Docker)" } as any,
        ],
        calculated_price: {
          calculated_amount: 490000,
          calculated_amount_with_tax: 490000,
          currency_code: "vnd",
          original_amount: 490000,
          original_amount_with_tax: 490000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },

  // 2. Next.js 15 Boilerplate Free Reference
  {
    id: "prod_dev_ref_001",
    title: "Mã Nguồn Mẫu Next.js 15 AI SaaS Cơ Bản (Tham Chiếu Kỹ Thuật)",
    handle: "dev-ref-001-ma-nguon-mau-nextjs-15-ai-saas-co-ban",
    description: "Gói mã nguồn tham chiếu mã nguồn mở chuẩn kỹ thuật của Đại Việt AI. Kiến trúc tinh gọn minh họa kết nối AI Streaming UI với Vercel AI SDK, quản lý state và cấu trúc thư mục chuẩn mực cho các bạn sinh viên và lập trình viên bắt đầu tiếp cận Next.js 15.",
    thumbnail: "/images/brands/nextjs.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_ma_nguon", name: "Mã Nguồn & Boilerplates", handle: "ma-nguon-boilerplates" } as any,
    ],
    metadata: {
      sku: "DEV-REF-001",
      platform: "Next.js 15",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Full Source Code ZIP",
      skill_level: "Nâng cao (Cần Dev/Docker)",
      runtime_env: "Node.js >= 18",
      license_type: "Open-Source Free Tier",
    },
    attributes_map: {
      platform: "Next.js 15",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Full Source Code ZIP",
      skill_level: "Nâng cao (Cần Dev/Docker)",
    },
    variants: [
      {
        id: "variant_dev_ref_001",
        title: "Bản Quyền Mã Nguồn Mở (Open-Source Free)",
        sku: "DEV-REF-001-STD",
        options: [
          { id: "opt_5", value: "Next.js 15" } as any,
          { id: "opt_6", value: "OpenAI (GPT-4o)" } as any,
          { id: "opt_7", value: "Full Source Code ZIP" } as any,
          { id: "opt_8", value: "Nâng cao (Cần Dev/Docker)" } as any,
        ],
        calculated_price: {
          calculated_amount: 0,
          calculated_amount_with_tax: 0,
          currency_code: "vnd",
          original_amount: 0,
          original_amount_with_tax: 0,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },

  // 3. n8n Zalo OA Commercial
  {
    id: "prod_aut_biz_01",
    title: "Workflow n8n Tự Động Chăm Sóc Khách Hàng Zalo OA",
    handle: "aut-biz-01-workflow-n8n-tu-dong-cham-soc-khach-hang-zalo-oa",
    description: "Kịch bản tự động hóa n8n hoàn chỉnh kết nối Zalo Official Account qua Webhook & Zalo OpenAPI. Tự động phản hồi tin nhắn khách hàng 24/7, gắn tag phân loại khách hàng theo intent, đồng bộ dữ liệu khách hàng tiềm năng vào Google Sheets/CRM và cảnh báo cho tư vấn viên khi phát hiện khách hàng VIP.",
    thumbnail: "/images/brands/zalo-oa.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_tu_dong_hoa", name: "Tự Động Hóa & Workflow", handle: "tu-dong-hoa-workflow" } as any,
    ],
    metadata: {
      sku: "AUT-BIZ-01",
      platform: "n8n",
      ai_model: "Không dùng AI",
      delivery_format: "JSON Workflow File",
      skill_level: "Cơ bản (Cần API Key)",
      license_type: "Commercial Single-Use",
    },
    attributes_map: {
      platform: "n8n",
      ai_model: "Không dùng AI",
      delivery_format: "JSON Workflow File",
      skill_level: "Cơ bản (Cần API Key)",
    },
    variants: [
      {
        id: "variant_aut_biz_01",
        title: "Bản Quyền Tiêu Chuẩn",
        sku: "AUT-BIZ-01-STD",
        options: [
          { id: "opt_9", value: "n8n" } as any,
          { id: "opt_10", value: "JSON Workflow File" } as any,
        ],
        calculated_price: {
          calculated_amount: 299000,
          calculated_amount_with_tax: 299000,
          currency_code: "vnd",
          original_amount: 299000,
          original_amount_with_tax: 299000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },

  // 4. n8n DeepSeek-V3 Invoice Extraction
  {
    id: "prod_aut_fin_01",
    title: "Workflow n8n Bóc Tách Hóa Đơn Tự Động Với DeepSeek-V3",
    handle: "aut-fin-01-workflow-n8n-boc-tach-hoa-don-tu-dong-deepseek-v3",
    description: "Giải pháp trích xuất dữ liệu hóa đơn điện tử (PDF, ảnh scan JPG/PNG) sử dụng mô hình DeepSeek-V3 Vision & Structured Output. Tự động bóc tách mã số thuế, tên đơn vị mua/bán, tổng tiền trước thuế, VAT và danh mục mặt hàng với độ chính xác trên 98%. Tự động kết xuất ra Google Sheets và lưu trữ tệp trên Cloudflare R2.",
    thumbnail: "/images/brands/deepseek.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_tu_dong_hoa", name: "Tự Động Hóa & Workflow", handle: "tu-dong-hoa-workflow" } as any,
    ],
    metadata: {
      sku: "AUT-FIN-01",
      platform: "n8n",
      ai_model: "DeepSeek-V3 / R1",
      delivery_format: "JSON Workflow File",
      skill_level: "Cơ bản (Cần API Key)",
      license_type: "Commercial Single-Use",
    },
    attributes_map: {
      platform: "n8n",
      ai_model: "DeepSeek-V3 / R1",
      delivery_format: "JSON Workflow File",
      skill_level: "Cơ bản (Cần API Key)",
    },
    variants: [
      {
        id: "variant_aut_fin_01",
        title: "Bản Quyền Tiêu Chuẩn",
        sku: "AUT-FIN-01-STD",
        options: [
          { id: "opt_11", value: "n8n" } as any,
          { id: "opt_12", value: "DeepSeek-V3 / R1" } as any,
          { id: "opt_13", value: "JSON Workflow File" } as any,
        ],
        calculated_price: {
          calculated_amount: 199000,
          calculated_amount_with_tax: 199000,
          currency_code: "vnd",
          original_amount: 199000,
          original_amount_with_tax: 199000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },

  // 5. Dify Agent OpenAI
  {
    id: "prod_aut_dif_01",
    title: "Agent Dify Tư Vấn Bán Hàng & Chốt Đơn Đa Kênh Tích Hợp OpenAI",
    handle: "aut-dif-01-agent-dify-tu-van-ban-hang-chot-don-openai",
    description: "Gói ứng dụng Dify DSL hoàn chỉnh thiết kế luồng Agentic Workflow với Memory, Knowledge Retrieval (RAG) và Tools Calling. Hỗ trợ tư vấn thông tin sản phẩm, báo giá thông minh, thu thập số điện thoại/địa chỉ giao hàng và gửi webhook tạo đơn hàng vào hệ thống ERP nội bộ.",
    thumbnail: "/images/brands/dify.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_tu_dong_hoa", name: "Tự Động Hóa & Workflow", handle: "tu-dong-hoa-workflow" } as any,
    ],
    metadata: {
      sku: "AUT-DIF-01",
      platform: "Dify",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Dify DSL File",
      skill_level: "Cơ bản (Cần API Key)",
    },
    attributes_map: {
      platform: "Dify",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Dify DSL File",
      skill_level: "Cơ bản (Cần API Key)",
    },
    variants: [
      {
        id: "variant_aut_dif_01",
        title: "Bản Quyền Tiêu Chuẩn",
        sku: "AUT-DIF-01-STD",
        options: [
          { id: "opt_14", value: "Dify" } as any,
          { id: "opt_15", value: "OpenAI (GPT-4o)" } as any,
          { id: "opt_16", value: "Dify DSL File" } as any,
        ],
        calculated_price: {
          calculated_amount: 199000,
          calculated_amount_with_tax: 199000,
          currency_code: "vnd",
          original_amount: 199000,
          original_amount_with_tax: 199000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },

  // 6. Python FastAPI RAG Kit
  {
    id: "prod_cod_rag_01",
    title: "FastAPI RAG Pipeline Starter Kit Với Qdrant & DeepSeek",
    handle: "cod-rag-01-fastapi-rag-pipeline-starter-kit-qdrant-deepseek",
    description: "Khung mã nguồn Backend Python FastAPI hiệu năng cao triển khai kiến trúc RAG hiện đại: Phân đoạn văn bản thông minh (Recursive Character & Semantic Chunking), Embeddings đa ngôn ngữ, Vector Database Qdrant và mô hình suy luận DeepSeek LLM. Hỗ trợ cơ chế Hybrid Search (Dense + Sparse BM25) và Reranker FlashRank.",
    thumbnail: "/images/brands/deepseek.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_ma_nguon", name: "Mã Nguồn & Boilerplates", handle: "ma-nguon-boilerplates" } as any,
    ],
    metadata: {
      sku: "COD-RAG-01",
      platform: "Python / FastAPI",
      ai_model: "DeepSeek-V3 / R1",
      delivery_format: "Full Source Code ZIP",
      skill_level: "Nâng cao (Cần Dev/Docker)",
    },
    attributes_map: {
      platform: "Python / FastAPI",
      ai_model: "DeepSeek-V3 / R1",
      delivery_format: "Full Source Code ZIP",
      skill_level: "Nâng cao (Cần Dev/Docker)",
    },
    variants: [
      {
        id: "variant_cod_rag_01",
        title: "Bản Quyền Tiêu Chuẩn",
        sku: "COD-RAG-01-STD",
        options: [
          { id: "opt_17", value: "Python / FastAPI" } as any,
          { id: "opt_18", value: "DeepSeek-V3 / R1" } as any,
          { id: "opt_19", value: "Full Source Code ZIP" } as any,
        ],
        calculated_price: {
          calculated_amount: 390000,
          calculated_amount_with_tax: 390000,
          currency_code: "vnd",
          original_amount: 390000,
          original_amount_with_tax: 390000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },

  // 7. Make.com Blueprint
  {
    id: "prod_aut_mak_01",
    title: "Kịch Bản Make.com Đồng Bộ Đơn Hàng Tự Động Vào Google Sheets & Zalo",
    handle: "aut-mak-01-kich-ban-make-dong-bo-don-hang-google-sheets-zalo",
    description: "Blueprints Make.com (Integromat) chuyên dụng bắt Webhook khi có đơn hàng mới từ Landing Page, WooCommerce, TikTok Shop hoặc Medusa. Tự động chuẩn hóa dữ liệu, ghi sổ kế toán Google Sheets theo thời gian thực và bắn tin nhắn thông báo kèm mã VietQR cho khách hàng qua Zalo ZNS/OA.",
    thumbnail: "/images/brands/make.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_tu_dong_hoa", name: "Tự Động Hóa & Workflow", handle: "tu-dong-hoa-workflow" } as any,
    ],
    metadata: {
      sku: "AUT-MAK-01",
      platform: "Make.com",
      ai_model: "Không dùng AI",
      delivery_format: "JSON Workflow File",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    attributes_map: {
      platform: "Make.com",
      ai_model: "Không dùng AI",
      delivery_format: "JSON Workflow File",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    variants: [
      {
        id: "variant_aut_mak_01",
        title: "Bản Quyền Tiêu Chuẩn",
        sku: "AUT-MAK-01-STD",
        options: [
          { id: "opt_20", value: "Make.com" } as any,
          { id: "opt_21", value: "JSON Workflow File" } as any,
        ],
        calculated_price: {
          calculated_amount: 149000,
          calculated_amount_with_tax: 149000,
          currency_code: "vnd",
          original_amount: 149000,
          original_amount_with_tax: 149000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },

  // 8. Chrome Extension YouTube Summary
  {
    id: "prod_sft_ext_02",
    title: "Chrome Extension Tóm Tắt Video YouTube & Xuất Mindmap Tự Động",
    handle: "sft-ext-02-chrome-extension-tom-tat-video-youtube-mindmap",
    description: "Tiện ích mở rộng Google Chrome (Manifest V3) phân tích phụ đề (transcripts) video YouTube siêu tốc. Tự động tạo tóm tắt ý chính theo mốc thời gian (timestamps), trích xuất danh sách hành động (Action Items) và xuất file Mindmap định dạng Markdown/XMind.",
    thumbnail: "/images/categories/extensions-tools.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_phan_mem", name: "Phần Mềm & Tiện Ích Số", handle: "phan-mem-tien-ich-so" } as any,
    ],
    metadata: {
      sku: "SFT-EXT-02",
      platform: "Chrome Extension",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Chrome Extension ZIP",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    attributes_map: {
      platform: "Chrome Extension",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Chrome Extension ZIP",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    variants: [
      {
        id: "variant_sft_ext_02",
        title: "Bản Quyền Tiêu Chuẩn",
        sku: "SFT-EXT-02-STD",
        options: [
          { id: "opt_22", value: "Chrome Extension" } as any,
          { id: "opt_23", value: "OpenAI (GPT-4o)" } as any,
        ],
        calculated_price: {
          calculated_amount: 69000,
          calculated_amount_with_tax: 69000,
          currency_code: "vnd",
          original_amount: 69000,
          original_amount_with_tax: 69000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },

  // 9. Dịch vụ Cài đặt 1-1
  {
    id: "prod_srv_con_01",
    title: "Gói Tư Vấn & Cài Đặt 1-1: Triển Khai Hệ Thống Tự Động Hóa Thực Chiến",
    handle: "srv-con-01-goi-tu-van-cai-dat-1-1-trien-khai-tu-dong-hoa",
    description: "Phiên coaching chuyên sâu 1 kèm 1 trong 90 phút qua Google Meet cùng Chuyên gia AI Đại Việt. Nội dung: Chẩn đoán quy trình doanh nghiệp hiện tại, lên kiến trúc giải pháp tự động hóa bằng n8n/Dify, hướng dẫn viết prompt chuyên sâu tối ưu chi phí token, trực tiếp xây dựng 01 quy trình tự động hóa hoàn chỉnh và bàn giao toàn bộ mã nguồn.",
    thumbnail: "/images/categories/setup-service.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_dich_vu", name: "Dịch Vụ Cài Đặt Chuyên Môn", handle: "dich-vu-cai-dat-chuyen-mon" } as any,
    ],
    metadata: {
      sku: "SRV-CON-01",
      platform: "Docker",
      ai_model: "DeepSeek-V3 / R1",
      delivery_format: "Dịch vụ Cài đặt 1-1",
      skill_level: "Nâng cao (Cần Dev/Docker)",
    },
    attributes_map: {
      platform: "Docker",
      ai_model: "DeepSeek-V3 / R1",
      delivery_format: "Dịch vụ Cài đặt 1-1",
      skill_level: "Nâng cao (Cần Dev/Docker)",
    },
    variants: [
      {
        id: "variant_srv_con_01",
        title: "Gói Dịch Vụ Cài Đặt Trọn Gói",
        sku: "SRV-CON-01-STD",
        options: [
          { id: "opt_24", value: "Docker" } as any,
          { id: "opt_25", value: "Dịch vụ Cài đặt 1-1" } as any,
        ],
        calculated_price: {
          calculated_amount: 490000,
          calculated_amount_with_tax: 490000,
          currency_code: "vnd",
          original_amount: 490000,
          original_amount_with_tax: 490000,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },

  // 10. n8n Free Sample
  {
    id: "prod_dev_ref_002",
    title: "Bộ 3 Workflow n8n Mẫu: Webhook, Báo Cáo Email & Cron Job",
    handle: "dev-ref-002-bo-3-workflow-n8n-mau-webhook-email-cron",
    description: "Bộ kịch bản n8n cơ bản được thiết kế chuẩn mực dành cho người mới bắt đầu: (1) Tiếp nhận webhook và xác thực token, (2) Lập lịch định kỳ tổng hợp dữ liệu gửi email qua Gmail/Outlook, (3) Kiểm tra trạng thái máy chủ và cảnh báo lỗi. Tải về và import ngay không cần chỉnh sửa phức tạp.",
    thumbnail: "/images/brands/n8n.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_tu_dong_hoa", name: "Tự Động Hóa & Workflow", handle: "tu-dong-hoa-workflow" } as any,
    ],
    metadata: {
      sku: "DEV-REF-002",
      platform: "n8n",
      ai_model: "Không dùng AI",
      delivery_format: "JSON Workflow File",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    attributes_map: {
      platform: "n8n",
      ai_model: "Không dùng AI",
      delivery_format: "JSON Workflow File",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    variants: [
      {
        id: "variant_dev_ref_002",
        title: "Bản Quyền Miễn Phí",
        sku: "DEV-REF-002-STD",
        options: [
          { id: "opt_26", value: "n8n" } as any,
          { id: "opt_27", value: "JSON Workflow File" } as any,
        ],
        calculated_price: {
          calculated_amount: 0,
          calculated_amount_with_tax: 0,
          currency_code: "vnd",
          original_amount: 0,
          original_amount_with_tax: 0,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },

  // 11. Dify Template Free
  {
    id: "prod_dev_ref_003",
    title: "Chatbot Hỗ Trợ Khách Hàng Cơ Bản Cho Fanpage Facebook (Dify Template)",
    handle: "dev-ref-003-chatbot-ho-tro-khach-hang-fanpage-dify",
    description: "Bản mẫu Dify Chatbot trực quan trả lời tự động câu hỏi thường gặp (FAQ) cho fanpage bán hàng online. Dễ dàng nhập khẩu tài liệu cửa hàng vào bộ nhớ kiến thức để bot tự động trích xuất thông tin tư vấn chính xác.",
    thumbnail: "/images/brands/dify.svg",
    status: "published" as any,
    categories: [
      { id: "pcat_tu_dong_hoa", name: "Tự Động Hóa & Workflow", handle: "tu-dong-hoa-workflow" } as any,
    ],
    metadata: {
      sku: "DEV-REF-003",
      platform: "Dify",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Dify DSL File",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    attributes_map: {
      platform: "Dify",
      ai_model: "OpenAI (GPT-4o)",
      delivery_format: "Dify DSL File",
      skill_level: "Mì ăn liền (< 5 phút)",
    },
    variants: [
      {
        id: "variant_dev_ref_003",
        title: "Bản Quyền Miễn Phí",
        sku: "DEV-REF-003-STD",
        options: [
          { id: "opt_28", value: "Dify" } as any,
          { id: "opt_29", value: "Dify DSL File" } as any,
        ],
        calculated_price: {
          calculated_amount: 0,
          calculated_amount_with_tax: 0,
          currency_code: "vnd",
          original_amount: 0,
          original_amount_with_tax: 0,
          price_list_type: "default",
        } as any,
      } as any,
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
]

/**
 * Lọc danh mục AI Fallback theo các tiêu chí (Category, Attributes, Query, Sorting, Pagination)
 */
export function filterFallbackAiProducts({
  handle,
  query,
  category_id,
  attributes,
  sortBy,
  page = 1,
  limit = 12,
}: {
  handle?: string | string[]
  query?: string
  category_id?: string | string[]
  attributes?: Record<string, string | string[]>
  sortBy?: string
  page?: number
  limit?: number
}): {
  products: HttpTypes.StoreProduct[]
  count: number
  nextPage: number | null
} {
  let list = [...FALLBACK_AI_PRODUCTS]

  // 0. Lọc chính xác theo handle nếu được yêu cầu
  if (handle) {
    const handleList = (Array.isArray(handle) ? handle : [handle]).map((h) => h.toLowerCase())
    list = list.filter((p) => handleList.includes(p.handle.toLowerCase()))
  }

  // 1. Lọc theo category_id hoặc category handle
  if (category_id) {
    const categoryFilterList = (Array.isArray(category_id) ? category_id : [category_id]).map((c) =>
      c.toLowerCase()
    )
    list = list.filter((p) =>
      p.categories?.some(
        (cat) =>
          categoryFilterList.includes(cat.id.toLowerCase()) ||
          categoryFilterList.includes((cat.handle || "").toLowerCase()) ||
          // Sub-slug matching
          categoryFilterList.some((filterKey) => (cat.handle || "").toLowerCase().includes(filterKey))
      )
    )
  }

  // 2. Lọc theo query text
  if (query && query.trim()) {
    const q = query.toLowerCase().trim()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.handle || "").toLowerCase().includes(q)
    )
  }

  // 3. Lọc theo attributes động (platform, ai_model, delivery_format, skill_level)
  if (attributes && Object.keys(attributes).length > 0) {
    for (const [attrKey, rawVal] of Object.entries(attributes)) {
      if (!rawVal) continue
      const targetValues = (Array.isArray(rawVal) ? rawVal : String(rawVal).split(","))
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean)

      if (targetValues.length === 0) continue

      list = list.filter((p) => {
        // Kiểm tra trong attributes_map
        const mappedVal = (p.attributes_map as any)?.[attrKey]
        if (mappedVal && targetValues.includes(String(mappedVal).toLowerCase())) {
          return true
        }

        // Kiểm tra trong variants.options
        const hasMatchingOption = p.variants?.some((v) =>
          (v.options as any[])?.some((opt) =>
            targetValues.includes(String(opt.value || "").toLowerCase())
          )
        )
        if (hasMatchingOption) return true

        // Fallback kiểm tra trong metadata
        const metaVal = (p.metadata as any)?.[attrKey]
        if (metaVal && targetValues.includes(String(metaVal).toLowerCase())) {
          return true
        }

        return false
      })
    }
  }

  // 4. Sắp xếp (Sorting)
  if (sortBy === "price_asc") {
    list.sort((a, b) => {
      const pA = a.variants?.[0]?.calculated_price?.calculated_amount || 0
      const pB = b.variants?.[0]?.calculated_price?.calculated_amount || 0
      return pA - pB
    })
  } else if (sortBy === "price_desc") {
    list.sort((a, b) => {
      const pA = a.variants?.[0]?.calculated_price?.calculated_amount || 0
      const pB = b.variants?.[0]?.calculated_price?.calculated_amount || 0
      return pB - pA
    })
  } else {
    // Mặc định: Mới nhất trước (created_at desc)
    list.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
  }

  const totalCount = list.length
  const offset = Math.max(page - 1, 0) * limit
  const paginated = list.slice(offset, offset + limit)
  const nextPage = totalCount > offset + limit ? page + 1 : null

  return {
    products: paginated,
    count: totalCount,
    nextPage,
  }
}
