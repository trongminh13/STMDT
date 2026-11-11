"use client"

import React, { useState } from "react"

type InspectorTab = "workflow" | "manifest" | "code" | "benchmark"

interface LayerState {
  ui: boolean
  workflow: boolean
  payment: boolean
  ai: boolean
}

export function VantageInspector() {
  const [activeTab, setActiveTab] = useState<InspectorTab>("workflow")
  const [layers, setLayers] = useState<LayerState>({
    ui: true,
    workflow: true,
    payment: true,
    ai: true,
  })

  const [activeNode, setActiveNode] = useState<number>(0)

  const toggleLayer = (key: keyof LayerState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const NODES = [
    {
      id: 0,
      title: "Webhook Khách Hàng",
      tech: "Zalo OA Webhook",
      latency: "18ms",
      desc: "Tiếp nhận tin nhắn, hình ảnh hóa đơn hoặc yêu cầu tư vấn từ khách hàng gửi vào Zalo Official Account của doanh nghiệp.",
      status: "Verified",
    },
    {
      id: 1,
      title: "Bộ Phân Tích Kỹ Thuật",
      tech: "Gemini 1.5 Flash",
      latency: "210ms",
      desc: "Trích xuất thông tin mã số thuế, tổng tiền VAT và danh mục sản phẩm từ hình ảnh hóa đơn; trả về định dạng JSON Schema chuẩn hóa.",
      status: "Zero-Hallucination",
    },
    {
      id: 2,
      title: "Đồng Bộ Dữ Liệu",
      tech: "KiotViet & PostgreSQL",
      latency: "84ms",
      desc: "Tự động đối soát tồn kho, tạo phiếu thu và cập nhật trạng thái đơn hàng vào hệ thống kế toán nội bộ mà không cần nhập liệu tay.",
      status: "Idempotent",
    },
    {
      id: 3,
      title: "Kích Hoạt Thanh Toán",
      tech: "VietQR Napas (payOS)",
      latency: "42ms",
      desc: "Tạo mã QR Napas chuyển khoản chính xác từng đồng, tự động xác nhận sau 3 giây và mở khóa tệp tải R2 có chữ ký số bảo mật.",
      status: "24/7 Auto",
    },
  ]

  return (
    <div className="border-2 border-[#18181B] rounded-[8px] bg-white overflow-hidden shadow-sm">
      {/* 1. TOP STATUS BAR (ENGINEERING MASTHEAD) */}
      <div className="border-b-2 border-[#18181B] bg-[#EAEAEA] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#18181B]">BỘ KIỂM ĐỊNH TÀI NGUYÊN SỐ</span>
          <span className="text-[#18181B]/30">/</span>
          <span className="text-[#18181B]/70">PHIÊN BẢN V2.4</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#18181B]/70">
          <span>Kiểm định cú pháp: 100% Pass</span>
          <span className="text-[#18181B]/30">/</span>
          <span>Telemetry: 0</span>
          <span className="text-[#18181B]/30">/</span>
          <span className="font-bold text-[#1E5FBF]">Bảo hành kỹ thuật: T+3</span>
        </div>
      </div>

      {/* 2. TAB CONTROLS (UNTRACKED SENTENCE-CASE) */}
      <div className="border-b border-[#18181B]/20 bg-white px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("workflow")}
            className={`px-3 py-1.5 text-xs font-bold rounded-[6px] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              activeTab === "workflow"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-[#18181B] border-[#18181B]/30 hover:bg-[#EAEAEA]"
            }`}
          >
            Sơ đồ luồng n8n
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("manifest")}
            className={`px-3 py-1.5 text-xs font-bold rounded-[6px] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              activeTab === "manifest"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-[#18181B] border-[#18181B]/30 hover:bg-[#EAEAEA]"
            }`}
          >
            Permission manifest
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1.5 text-xs font-bold rounded-[6px] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              activeTab === "code"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-[#18181B] border-[#18181B]/30 hover:bg-[#EAEAEA]"
            }`}
          >
            API webhook handler
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("benchmark")}
            className={`px-3 py-1.5 text-xs font-bold rounded-[6px] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              activeTab === "benchmark"
                ? "bg-[#18181B] text-white border-[#18181B]"
                : "bg-white text-[#18181B] border-[#18181B]/30 hover:bg-[#EAEAEA]"
            }`}
          >
            Báo cáo đo kiểm AST
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#18181B]/50">
          Chế độ xem trước trước khi thanh toán
        </span>
      </div>

      {/* 3. MAIN INSPECTOR CANVAS */}
      <div className="p-4 sm:p-6 bg-[#FAFAFA] min-h-[340px]">
        {/* TAB 1: WORKFLOW NODE MAP */}
        {activeTab === "workflow" && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {NODES.map((node) => {
                const isSelected = activeNode === node.id
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNode(node.id)}
                    className={`text-left p-3.5 rounded-[8px] border-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
                      isSelected
                        ? "border-[#18181B] bg-white shadow-sm"
                        : "border-[#18181B]/20 bg-[#EAEAEA]/40 hover:bg-white/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#18181B]/60 mb-1.5">
                      <span>NODE 0{node.id + 1}</span>
                      <span className="font-bold text-[#1E5FBF]">{node.latency}</span>
                    </div>
                    <div className="text-sm font-bold text-[#18181B] mb-1">
                      {node.title}
                    </div>
                    <div className="text-xs font-mono text-[#18181B]/70">
                      {node.tech}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Node Detail Box */}
            <div className="p-4 bg-white border border-[#18181B] rounded-[8px]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2 pb-2 border-b border-[#18181B]/10">
                <span className="text-xs font-mono font-bold text-[#1E5FBF]">
                  THÔNG SỐ NODE 0{activeNode + 1}: {NODES[activeNode].title}
                </span>
                <span className="text-xs font-mono text-[#18181B]/60">
                  Trạng thái: <strong className="text-[#18181B]">{NODES[activeNode].status}</strong>
                </span>
              </div>
              <p className="text-sm text-[#18181B]/80 leading-relaxed mb-3">
                {NODES[activeNode].desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-[#18181B]/70">
                <div className="p-2 bg-[#EAEAEA]/50 rounded-[4px] border border-[#18181B]/10">
                  <span className="block text-[10px] text-[#18181B]/50">ĐẦU VÀO (INPUT)</span>
                  Payload JSON / Webhook Event
                </div>
                <div className="p-2 bg-[#EAEAEA]/50 rounded-[4px] border border-[#18181B]/10">
                  <span className="block text-[10px] text-[#18181B]/50">BẢO MẬT</span>
                  HMAC SHA-256 Token
                </div>
                <div className="p-2 bg-[#EAEAEA]/50 rounded-[4px] border border-[#18181B]/10">
                  <span className="block text-[10px] text-[#18181B]/50">XỬ LÝ LỖI (FALLBACK)</span>
                  Retry 3 lần có jitter backoff
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PERMISSION MANIFEST */}
        {activeTab === "manifest" && (
          <div className="bg-white border border-[#18181B] rounded-[8px] overflow-hidden">
            <div className="px-4 py-3 bg-[#EAEAEA] border-b border-[#18181B]/20 flex items-center justify-between text-xs font-mono font-bold text-[#18181B]">
              <span>DANH SÁCH EXTERNAL DOMAINS & MÔI TRƯỜNG KẾT NỐI</span>
              <span className="text-[#1E5FBF]">CHÍNH SÁCH ZERO-BACKDOOR</span>
            </div>
            <div className="divide-y divide-[#18181B]/10 text-xs font-mono">
              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-[#18181B]">api.zalo.me:443</strong>
                  <p className="text-[#18181B]/60 text-[11px] mt-0.5">
                    Gửi nhận thông báo Zalo OA khách hàng qua HTTPS TLS 1.3
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-[#EAEAEA] border border-[#18181B]/20 rounded-[4px] self-start sm:self-auto">
                  Quyền: Tin nhắn & Webhook
                </span>
              </div>

              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-[#18181B]">api.payos.vn:443</strong>
                  <p className="text-[#18181B]/60 text-[11px] mt-0.5">
                    Xác thực giao dịch chuyển khoản VietQR Napas 24/7 tự động
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-[#EAEAEA] border border-[#18181B]/20 rounded-[4px] self-start sm:self-auto">
                  Quyền: Tạo QR & Webhook IP Whitelist
                </span>
              </div>

              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-[#18181B]">generativelanguage.googleapis.com</strong>
                  <p className="text-[#18181B]/60 text-[11px] mt-0.5">
                    Gọi mô hình Gemini 1.5 Flash bóc tách hóa đơn VAT (giới hạn token)
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-[#EAEAEA] border border-[#18181B]/20 rounded-[4px] self-start sm:self-auto">
                  Quyền: Inference Only (No Telemetry)
                </span>
              </div>

              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#EAEAEA]/30">
                <div>
                  <strong className="text-[#18181B]">Telemetry ngầm & Máy chủ ngoài</strong>
                  <p className="text-[#18181B]/60 text-[11px] mt-0.5">
                    Cam kết không gửi thông tin cấu hình, mật khẩu hay dữ liệu khách hàng
                  </p>
                </div>
                <span className="text-[11px] px-2 py-0.5 bg-white border border-[#18181B] font-bold text-[#18181B] rounded-[4px] self-start sm:self-auto">
                  0 requests / Blocked
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CODE SNIPPET */}
        {activeTab === "code" && (
          <div className="bg-[#18181B] text-[#EAEAEA] p-4 rounded-[8px] font-mono text-xs overflow-x-auto leading-relaxed border border-[#18181B]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAEAEA]/10 text-[11px] text-[#EAEAEA]/50">
              <span>src/app/api/webhook/payos/route.ts</span>
              <span>TypeScript • Node.js LTS</span>
            </div>
            <pre>
              {`// 1. Đối soát chữ ký số giao dịch VietQR Napas từ payOS
export async function POST(req: Request) {
  const webhookBody = await req.json();
  const isValidSignature = payos.verifyPaymentWebhookData(webhookBody);
  
  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 400 });
  }

  // 2. Kích hoạt đơn hàng và sinh Presigned URL Cloudflare R2
  const orderId = webhookBody.data.orderCode;
  const assetPackage = await getDigitalAssetByOrderId(orderId);
  const downloadUrl = await generateR2PresignedUrl(assetPackage.fileKey, {
    expiresIn: 86400, // 24 giờ
  });

  // 3. Thông báo Zalo OA tức thì cho người mua
  await sendZaloOANotification({
    buyerPhone: webhookBody.data.buyerPhone,
    downloadUrl: downloadUrl,
    warrantyHours: 72, // Chính sách bảo hành T+3
  });

  return Response.json({ success: true, processedInMs: 42 });
}`}
            </pre>
          </div>
        )}

        {/* TAB 4: BENCHMARK */}
        {activeTab === "benchmark" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-[#18181B] rounded-[8px]">
              <span className="text-[11px] font-mono text-[#18181B]/50 block mb-1">
                TỶ LỆ CÚ PHÁP CHUẨN
              </span>
              <div className="text-2xl font-black text-[#18181B] mb-1">100%</div>
              <p className="text-xs text-[#18181B]/70">
                Đạt 0 lỗi linting, kiểm tra TypeScript strict mode và ESLint v9.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#18181B] rounded-[8px]">
              <span className="text-[11px] font-mono text-[#18181B]/50 block mb-1">
                BỘ NHỚ THỰC THI
              </span>
              <div className="text-2xl font-black text-[#18181B] mb-1">&lt; 64MB</div>
              <p className="text-xs text-[#18181B]/70">
                Tối ưu hóa tài nguyên, vận hành trơn tru trên VPS cơ bản 1 vCPU.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#18181B] rounded-[8px]">
              <span className="text-[11px] font-mono text-[#18181B]/50 block mb-1">
                TỐC ĐỘ XÁC NHẬN VIETQR
              </span>
              <div className="text-2xl font-black text-[#1E5FBF] mb-1">3.1 giây</div>
              <p className="text-xs text-[#18181B]/70">
                Giao dịch Napas 24/7 tự động xác thực và mở quyền tải ngay tức thì.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#18181B] rounded-[8px]">
              <span className="text-[11px] font-mono text-[#18181B]/50 block mb-1">
                BẢO HÀNH KỸ THUẬT (T+3)
              </span>
              <div className="text-2xl font-black text-[#18181B] mb-1">72 giờ</div>
              <p className="text-xs text-[#18181B]/70">
                Trọn vẹn 3 ngày chạy thử; hoàn tiền 100% nếu sản phẩm có lỗi kỹ thuật.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. INTERACTIVE LAYER SWITCHER (HALLMARK VANTAGE SIGNATURE) */}
      <div className="border-t-2 border-[#18181B] bg-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#18181B]/15">
          <div>
            <span className="text-xs font-mono font-bold text-[#1E5FBF]">
              CÔNG TẮC BẬT/TẮT CÁC LỚP KIẾN TRÚC (ARCHITECTURAL LAYERS)
            </span>
            <p className="text-xs text-[#18181B]/70 mt-0.5">
              Mỗi thành phần là một công tắc độc lập — Tùy biến module giải pháp theo nhu cầu thực tế của doanh nghiệp.
            </p>
          </div>

          <div className="text-xs font-mono font-semibold text-[#18181B] bg-[#EAEAEA] px-3 py-1 rounded-[6px] border border-[#18181B]/20 self-start sm:self-auto">
            Thời gian cấu hình: {Object.values(layers).filter(Boolean).length * 4} phút
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => toggleLayer("ui")}
            className={`p-2.5 text-left border rounded-[6px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              layers.ui
                ? "border-[#18181B] bg-[#EAEAEA]/80 text-[#18181B]"
                : "border-[#18181B]/20 bg-white text-[#18181B]/40"
            }`}
          >
            <div className="text-[10px] font-mono mb-1">LỚP 01 / GIAO DIỆN</div>
            <div className="text-xs font-bold leading-tight">Next.js 15 UI</div>
            <span className="text-[10px] font-mono block mt-1">
              {layers.ui ? "[Đang bật]" : "[Tắt]"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("workflow")}
            className={`p-2.5 text-left border rounded-[6px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              layers.workflow
                ? "border-[#18181B] bg-[#EAEAEA]/80 text-[#18181B]"
                : "border-[#18181B]/20 bg-white text-[#18181B]/40"
            }`}
          >
            <div className="text-[10px] font-mono mb-1">LỚP 02 / TỰ ĐỘNG HÓA</div>
            <div className="text-xs font-bold leading-tight">Workflow n8n</div>
            <span className="text-[10px] font-mono block mt-1">
              {layers.workflow ? "[Đang bật]" : "[Tắt]"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("payment")}
            className={`p-2.5 text-left border rounded-[6px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              layers.payment
                ? "border-[#18181B] bg-[#EAEAEA]/80 text-[#18181B]"
                : "border-[#18181B]/20 bg-white text-[#18181B]/40"
            }`}
          >
            <div className="text-[10px] font-mono mb-1">LỚP 03 / CỔNG THU</div>
            <div className="text-xs font-bold leading-tight">VietQR Napas</div>
            <span className="text-[10px] font-mono block mt-1">
              {layers.payment ? "[Đang bật]" : "[Tắt]"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleLayer("ai")}
            className={`p-2.5 text-left border rounded-[6px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
              layers.ai
                ? "border-[#18181B] bg-[#EAEAEA]/80 text-[#18181B]"
                : "border-[#18181B]/20 bg-white text-[#18181B]/40"
            }`}
          >
            <div className="text-[10px] font-mono mb-1">LỚP 04 / TRÍ TUỆ AI</div>
            <div className="text-xs font-bold leading-tight">Gemini Flash Chain</div>
            <span className="text-[10px] font-mono block mt-1">
              {layers.ai ? "[Đang bật]" : "[Tắt]"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
