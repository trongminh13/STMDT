import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { VantageInspector } from "./components/VantageInspector"

export const metadata: Metadata = {
  title: "Đại Việt AI — Sàn Giải Pháp & Tài Nguyên Số Sẵn Sàng Vận Hành",
  description:
    "Sở hữu workflow n8n, mã nguồn SaaS Next.js 15 và AI agents thực chiến - Tiết kiệm hàng trăm giờ lập trình cho Freelancer và Doanh nghiệp vừa & nhỏ Việt Nam.",
}

const ASSET_PACKAGES = [
  {
    code: "PKG-01",
    title: "Workflow Tự Động Hóa n8n & Zalo OA",
    stack: "n8n - Dify - Webhooks - PostgreSQL",
    tagline: "Kịch bản tự động hóa tiếp nhận khách hàng và bóc tách đơn hàng",
    deliverables: "workflow.json • .env.example • docker-compose.yml • Hướng dẫn import",
    specs: [
      { label: "Môi trường", value: "Docker / n8n self-hosted" },
      { label: "Chi phí 3rd party", value: "0đ (dùng Free tier)" },
      { label: "Thời gian cài đặt", value: "12 phút" },
      { label: "Bảo hành", value: "72h (T+3) hoàn tiền 100%" },
    ],
    priceRange: "Từ 0đ - 190.000đ",
    handle: "tu-dong-hoa-workflow",
    action: "Xem kịch bản n8n",
  },
  {
    code: "PKG-02",
    title: "Khung Ứng Dụng SaaS Full-stack Next.js 15",
    stack: "Next.js 15 - Supabase - VietQR - Tailwind",
    tagline: "Khung ứng dụng hoàn chỉnh tích hợp sẵn cổng thanh toán VietQR tự động",
    deliverables: "Full Source Code ZIP • Dockerfile • Database Migrations • CI/CD",
    specs: [
      { label: "Môi trường", value: "Node.js 20+ / Vercel / VPS" },
      { label: "Cổng thanh toán", value: "VietQR Napas 24/7 (payOS)" },
      { label: "Thời gian deploy", value: "20 phút" },
      { label: "Bảo hành", value: "72h (T+3) hoàn tiền 100%" },
    ],
    priceRange: "290.000đ - 490.000đ",
    handle: "ma-nguon-boilerplates",
    action: "Xem mã nguồn SaaS",
  },
  {
    code: "PKG-03",
    title: "Trợ Lý AI & Kịch Bản Bóc Tách Hóa Đơn VAT",
    stack: "Gemini 1.5 Flash - JSON Schema - RAG",
    tagline: "Trợ lý số trích xuất dữ liệu kế toán và đối soát hóa đơn không ảo giác",
    deliverables: "System Prompt Chains • Schema Validator • API Router • Unit Tests",
    specs: [
      { label: "Môi trường", value: "REST API / Python / Node.js" },
      { label: "Độ chính xác", value: "99.4% trên hóa đơn VAT VN" },
      { label: "Tốc độ xử lý", value: "~240ms / hóa đơn" },
      { label: "Bảo hành", value: "72h (T+3) hoàn tiền 100%" },
    ],
    priceRange: "Từ 490.000đ",
    handle: "tri-tue-nhan-tao-ai",
    action: "Xem giải pháp AI",
  },
]

const PRICING_TIERS = [
  {
    tier: "Gói Kịch Bản (Starter)",
    code: "TIER-01",
    price: "0đ - 190.000đ",
    period: "sở hữu vĩnh viễn",
    description: "Dành cho freelancer và cá nhân cần giải pháp tự động hóa cụ thể để giải phóng công việc hàng ngày.",
    features: [
      "1 tệp kịch bản n8n hoặc tiện ích mở rộng đã kiểm định cú pháp AST",
      "Tài liệu cấu hình biến môi trường và hướng dẫn kết nối Zalo OA",
      "Kiểm định an toàn: Cam kết 0% telemetry ngầm và không backdoor",
      "Chính sách bảo hành kỹ thuật 72 giờ (T+3) hoàn tiền 100%",
    ],
    ctaText: "Khám phá gói kịch bản",
    ctaLink: "/categories/tu-dong-hoa-workflow",
    isPrimary: false,
  },
  {
    tier: "Gói Mã Nguồn (Production)",
    code: "TIER-02",
    price: "290.000đ - 490.000đ",
    period: "sở hữu vĩnh viễn",
    description: "Dành cho lập trình viên và doanh nghiệp SMB muốn ra mắt sản phẩm số và hệ thống SaaS ngay lập tức.",
    features: [
      "Toàn bộ kho mã nguồn Next.js 15, Tailwind CSS và Supabase Auth",
      "Tích hợp sẵn webhook đối soát thanh toán tự động VietQR Napas (payOS)",
      "Cấu hình Docker Compose sẵn sàng chạy trên mọi VPS hoặc máy chủ đám mây",
      "Đầy đủ database migrations và tài liệu hướng dẫn triển khai",
      "Bảo hành kỹ thuật 72 giờ và hỗ trợ trực tiếp qua Zalo OA",
    ],
    ctaText: "Xem mã nguồn SaaS",
    ctaLink: "/categories/ma-nguon-boilerplates",
    isPrimary: true,
  },
  {
    tier: "Triển Khai Chuyên Môn (Enterprise)",
    code: "TIER-03",
    price: "Từ 1.200.000đ",
    period: "triển khai trọn gói 1-1",
    description: "Dành cho doanh nghiệp cần kỹ sư hỗ trợ cài đặt, tùy biến luồng dữ liệu và tích hợp trực tiếp vào hạ tầng nội bộ.",
    features: [
      "Kỹ sư phụ trách cài đặt và kết nối trực tiếp vào máy chủ của doanh nghiệp",
      "Tùy biến luồng n8n theo yêu cầu đặc thù của phần mềm quản trị (KiotViet, SAP)",
      "Cam kết thời gian phản hồi kỹ thuật (SLA) dưới 2 giờ",
      "Bàn giao video walkthrough và tài liệu hướng dẫn vận hành cho nhân sự",
      "Bảo hành kỹ thuật mở rộng lên đến 30 ngày",
    ],
    ctaText: "Yêu cầu tư vấn 1-1",
    ctaLink: "https://zalo.me/daivietai",
    isPrimary: false,
    isExternal: true,
  },
]

const COMPARISON_MATRIX = [
  {
    criteria: "Thời gian đưa vào vận hành",
    diy: "2 - 4 tuần tự viết mã, cấu hình và gỡ lỗi",
    riskyMarket: "Mù mờ, thường phát sinh lỗi thiếu thư viện",
    daiviet: "15 phút tải về, điền .env và chạy ngay",
  },
  {
    criteria: "Chi phí nhân sự đầu tư",
    diy: "15.000.000đ - 30.000.000đ lương dev",
    riskyMarket: "Giá rẻ nhưng tốn công sửa lỗi mã độc",
    daiviet: "Từ 0đ - 490.000đ sở hữu trọn đời",
  },
  {
    criteria: "Bảo đảm an toàn mã nguồn",
    diy: "Tự rà soát phụ thuộc và lỗ hổng",
    riskyMarket: "Rủi ro chứa backdoor đánh cắp API keys",
    daiviet: "100% quét tĩnh AST và công khai Permission Manifest",
  },
  {
    criteria: "Cổng thanh toán tự động",
    diy: "Mất 1 tuần tích hợp và kiểm thử ngân hàng",
    riskyMarket: "Thường không tích hợp sẵn cổng thanh toán",
    daiviet: "VietQR Napas 24/7 tự động xác nhận sau 3 giây",
  },
  {
    criteria: "Chính sách bảo vệ người mua",
    diy: "Tự chịu 100% rủi ro khi có lỗi phát sinh",
    riskyMarket: "Không bảo hành, không có kênh khiếu nại",
    daiviet: "Bảo hành kỹ thuật 72 giờ (T+3) hoàn tiền 100%",
  },
]

const BUYER_FAQS = [
  {
    q: "Sau khi quét mã VietQR thành công, tôi nhận được tài nguyên như thế nào?",
    a: "Ngay sau khi giao dịch ngân hàng thành công (khoảng 3 giây), hệ thống tự động mở khóa liên kết tải tệp trực tiếp từ Cloudflare R2 với chữ ký số bảo mật (Presigned URL). Gói tải về chứa toàn bộ mã nguồn sạch, tệp kịch bản cấu hình sẵn và hướng dẫn cài đặt từng bước.",
  },
  {
    q: "Tôi có cần thuê máy chủ đắt tiền để vận hành các workflow n8n này không?",
    a: "Không. Toàn bộ kịch bản tự động hóa n8n và công cụ AI trên sàn đều được thiết kế để chạy trơn tru trên máy tính cá nhân hoặc các máy chủ ảo VPS tự lưu trữ (self-hosted) với chi phí chỉ từ 100.000đ/tháng.",
  },
  {
    q: "Nếu gặp sự cố trong quá trình import hoặc cấu hình biến môi trường thì sao?",
    a: "Trong thời gian 72 giờ bảo hành kỹ thuật (T+3), bạn có thể gửi yêu cầu hỗ trợ qua kênh Zalo OA chuyên trách của sàn. Kỹ sư kỹ thuật sẽ trực tiếp hỗ trợ kiểm tra hoặc kết nối tác giả để xử lý triệt để sự cố cho bạn.",
  },
  {
    q: "Doanh nghiệp của tôi có được cung cấp hóa đơn thanh toán hợp lệ không?",
    a: "Có. Đại Việt AI vận hành theo đúng quy định pháp luật thương mại điện tử Việt Nam. Người mua doanh nghiệp có thể cung cấp thông tin mã số thuế khi thanh toán để nhận hóa đơn điện tử hợp lệ phục vụ hạch toán chi phí.",
  },
]

export default async function DedicatedLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="bg-[#EAEAEA] text-[#18181B] font-sans">
      {/* 1. TOP STATUS & ENGINEERING MASTHEAD (VANTAGE CHROME) */}
      <div className="border-b border-[#18181B]/20 bg-[#EAEAEA] py-2 px-4 text-xs font-mono">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1E5FBF]">ĐẠI VIỆT AI</span>
            <span className="text-[#18181B]/30">/</span>
            <span className="text-[#18181B]/70">SÀN GIẢI PHÁP SỐ CHUẨN HOÁ CHO DOANH NGHIỆP VIỆT</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#18181B]/60">
            <span>KIỂM ĐỊNH TĨNH AST: 100% PASS</span>
            <span className="text-[#18181B]/30">/</span>
            <span>VIETQR NAPAS 24/7</span>
            <span className="text-[#18181B]/30">/</span>
            <span className="text-[#18181B] font-bold">BẢO HÀNH 72H (T+3)</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <header className="border-b-2 border-[#18181B] bg-[#EAEAEA] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/landing`}
              className="text-xl font-black tracking-tight text-[#18181B] hover:text-[#1E5FBF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] rounded-[4px]"
            >
              ĐẠI VIỆT AI
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-[#18181B]/70">
              <a href="#giai-phap" className="hover:text-[#18181B] transition-colors">
                Gói giải pháp
              </a>
              <a href="#kiem-dinh" className="hover:text-[#18181B] transition-colors">
                Bộ kiểm định
              </a>
              <a href="#so-sanh" className="hover:text-[#18181B] transition-colors">
                Bảng đối soát
              </a>
              <a href="#bang-gia" className="hover:text-[#18181B] transition-colors">
                Bảng giá
              </a>
              <a href="#quy-trinh" className="hover:text-[#18181B] transition-colors">
                Quy trình T+3
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="text-xs font-semibold text-[#18181B]/70 hover:text-[#18181B] px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] rounded-[8px]"
            >
              Vào sàn chính
            </Link>

            <Link
              href={`/${locale}/categories`}
              className="bg-[#83C0D7] text-[#18181B] text-xs font-bold px-4 py-2 border-2 border-[#18181B] rounded-[8px] hover:bg-[#18181B] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
            >
              Xem danh mục giải pháp
            </Link>
          </div>
        </div>
      </header>

      {/* 3. MAIN CAPPED & CENTRED CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <section className="pt-14 pb-10 border-b border-[#18181B]/20">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-mono font-bold text-[#1E5FBF] mb-3">
              TÀI NGUYÊN SỐ ĐÃ RÀ SOÁT CÚ PHÁP VÀ KIỂM ĐỊNH BẢO MẬT
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#18181B] leading-[1.12] mb-5">
              Tài nguyên số AI sẵn sàng chạy.
            </h1>

            <p className="text-base sm:text-lg text-[#18181B]/80 leading-relaxed mb-8">
              Tiết kiệm hàng trăm giờ code cho lập trình viên và doanh nghiệp Việt.
            </p>

            {/* Quick Search */}
            <form
              action={`/${locale}/categories`}
              method="GET"
              className="flex flex-col sm:flex-row gap-2.5 mb-6"
            >
              <input
                type="text"
                name="q"
                placeholder="Tìm workflow n8n Zalo OA, chatbot Dify, SaaS Next.js..."
                className="flex-1 bg-white border-2 border-[#18181B] rounded-[8px] px-4 py-3 text-sm text-[#18181B] placeholder:text-[#18181B]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
              />
              <button
                type="submit"
                className="bg-[#83C0D7] text-[#18181B] font-bold text-sm px-6 py-3 border-2 border-[#18181B] rounded-[8px] hover:bg-[#18181B] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
              >
                Tìm giải pháp
              </button>
            </form>

            {/* Untracked Sentence-Case Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#18181B]/60 font-medium mr-1">Chủ đề tìm nhiều:</span>
              {[
                { label: "n8n Zalo OA", query: "zalo" },
                { label: "Bóc tách hóa đơn VAT", query: "hóa đơn" },
                { label: "Next.js 15 Starter", query: "next.js" },
                { label: "Chrome Extension MV3", query: "extension" },
                { label: "Chatbot Dify RAG", query: "dify" },
                { label: "Dịch vụ cài đặt 1-1", query: "cài đặt" },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  href={`/${locale}/categories?q=${encodeURIComponent(chip.query)}`}
                  className="px-2.5 py-1 bg-white border border-[#18181B] rounded-[8px] text-[#18181B] hover:bg-[#18181B] hover:text-white transition-colors duration-150 font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* VANTAGE SIGNATURE INSPECTOR WIDGET */}
          <div id="kiem-dinh" className="mt-8">
            <VantageInspector />
          </div>
        </section>

        {/* 4. CORE ASSET PACKAGES (DATA-DENSE TECHNICAL GRID) */}
        <section id="giai-phap" className="py-14 border-b border-[#18181B]/20">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 gap-2">
            <div>
              <p className="text-xs font-mono font-bold text-[#1E5FBF] mb-1">
                DANH MỤC TÀI NGUYÊN SỐ
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
                3 nhóm giải pháp triển khai ngay
              </h2>
            </div>
            <Link
              href={`/${locale}/categories`}
              className="text-xs font-semibold text-[#18181B] hover:text-[#1E5FBF] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
            >
              Xem toàn bộ danh mục &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ASSET_PACKAGES.map((pkg) => (
              <div
                key={pkg.code}
                className="border-2 border-[#18181B] rounded-[8px] bg-white p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#18181B]/15 text-xs font-mono">
                    <span className="font-bold text-[#1E5FBF]">{pkg.code}</span>
                    <span className="text-[#18181B]/60 font-semibold">{pkg.priceRange}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#18181B] mb-1 leading-snug">
                    {pkg.title}
                  </h3>

                  <p className="text-xs font-mono text-[#18181B]/60 mb-3">
                    {pkg.stack}
                  </p>

                  <p className="text-xs text-[#18181B]/80 leading-relaxed mb-4">
                    {pkg.tagline}
                  </p>

                  {/* Deliverables */}
                  <div className="p-2.5 bg-[#EAEAEA]/50 border border-[#18181B]/10 rounded-[6px] mb-4 text-[11px] font-mono text-[#18181B]/70">
                    <strong className="block text-[#18181B] mb-0.5">Tệp bàn giao:</strong>
                    {pkg.deliverables}
                  </div>

                  {/* Specs table */}
                  <div className="space-y-1.5 text-xs font-mono mb-6">
                    {pkg.specs.map((s) => (
                      <div key={s.label} className="flex justify-between py-1 border-b border-[#18181B]/10">
                        <span className="text-[#18181B]/60">{s.label}:</span>
                        <span className="font-bold text-[#18181B]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/${locale}/categories/${pkg.handle}`}
                  className="w-full text-center bg-[#83C0D7] text-[#18181B] font-bold text-xs py-2.5 border-2 border-[#18181B] rounded-[8px] hover:bg-[#18181B] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                >
                  {pkg.action}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 5. COMPARISON MATRIX (ENGINEERING AUDIT TABLE) */}
        <section id="so-sanh" className="py-14 border-b border-[#18181B]/20">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-mono font-bold text-[#1E5FBF] mb-1">
              ĐỐI SOÁT KỸ THUẬT & HIỆU NĂNG KINH TẾ
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] mb-2">
              So sánh phương án phát triển và mức độ rủi ro
            </h2>
            <p className="text-sm text-[#18181B]/75 leading-relaxed">
              Minh bạch giữa việc tự code từ đầu, mua nguồn trôi nổi trên mạng và sở hữu giải pháp chuẩn hóa tại Sàn Đại Việt AI.
            </p>
          </div>

          <div className="border-y-2 border-[#18181B] overflow-x-auto bg-white rounded-[8px]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#18181B] bg-[#EAEAEA] text-xs font-mono font-bold text-[#18181B]">
                  <th className="py-3 px-4">TIÊU CHÍ KỸ THUẬT</th>
                  <th className="py-3 px-4 text-[#18181B]/60">TỰ XÂY DỰNG IN-HOUSE</th>
                  <th className="py-3 px-4 text-[#18181B]/60">MUA NGUỒN TRÔI NỔI</th>
                  <th className="py-3 px-4 text-[#1E5FBF]">SỞ HỮU TẠI ĐẠI VIỆT AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]/15 text-xs">
                {COMPARISON_MATRIX.map((row) => (
                  <tr key={row.criteria} className="hover:bg-[#EAEAEA]/30 transition-colors duration-150">
                    <td className="py-3.5 px-4 font-bold text-[#18181B]">
                      {row.criteria}
                    </td>
                    <td className="py-3.5 px-4 text-[#18181B]/70 leading-relaxed">
                      {row.diy}
                    </td>
                    <td className="py-3.5 px-4 text-[#18181B]/70 leading-relaxed">
                      {row.riskyMarket}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#18181B] leading-relaxed bg-[#EAEAEA]/40">
                      {row.daiviet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. VANTAGE TIERED PRICING (MATCHING SWATH STRUCTURE) */}
        <section id="bang-gia" className="py-14 border-b border-[#18181B]/20">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-mono font-bold text-[#1E5FBF] mb-1">
              BẢNG GIÁ MINH BẠCH THEO ĐÚNG GIÁ TRỊ THỰC
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] mb-2">
              Lựa chọn gói triển khai phù hợp quy mô
            </h2>
            <p className="text-sm text-[#18181B]/75 leading-relaxed">
              Không phí duy trì ẩn — Thanh toán 1 lần qua VietQR Napas và sở hữu vĩnh viễn tệp mã nguồn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.code}
                className={`border-2 border-[#18181B] rounded-[8px] p-6 flex flex-col justify-between ${
                  tier.isPrimary ? "bg-white shadow-md relative" : "bg-[#EAEAEA]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#18181B]/20 text-xs font-mono">
                    <span className="font-bold text-[#1E5FBF]">{tier.code}</span>
                    {tier.isPrimary && (
                      <span className="px-2 py-0.5 bg-[#83C0D7] border border-[#18181B] font-bold text-[#18181B] rounded-[4px] text-[10px]">
                        Phổ biến nhất
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#18181B] mb-1">
                    {tier.tier}
                  </h3>

                  <div className="my-3">
                    <span className="text-2xl sm:text-3xl font-black text-[#18181B]">
                      {tier.price}
                    </span>
                    <span className="block text-xs font-mono text-[#18181B]/60 mt-0.5">
                      {tier.period}
                    </span>
                  </div>

                  <p className="text-xs text-[#18181B]/80 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="border-t border-[#18181B]/15 pt-4 mb-6">
                    <span className="text-xs font-mono font-bold text-[#18181B] block mb-3">
                      Đặc quyền bao gồm:
                    </span>
                    <ul className="space-y-2 text-xs text-[#18181B]/80">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <span className="font-mono font-bold text-[#1E5FBF] shrink-0">+</span>
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {tier.isExternal ? (
                  <a
                    href={tier.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-white text-[#18181B] font-bold text-xs py-3 border-2 border-[#18181B] rounded-[8px] hover:bg-[#18181B] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                  >
                    {tier.ctaText} &rarr;
                  </a>
                ) : (
                  <Link
                    href={`/${locale}${tier.ctaLink}`}
                    className={`w-full text-center font-bold text-xs py-3 border-2 border-[#18181B] rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF] ${
                      tier.isPrimary
                        ? "bg-[#83C0D7] text-[#18181B] hover:bg-[#18181B] hover:text-white shadow-sm"
                        : "bg-white text-[#18181B] hover:bg-[#18181B] hover:text-white"
                    }`}
                  >
                    {tier.ctaText} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 7. TRANSACTION PROTOCOL & 72H WARRANTY (T+3) */}
        <section id="quy-trinh" className="py-14 border-b border-[#18181B]/20">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-mono font-bold text-[#1E5FBF] mb-1">
              QUY TRÌNH GIAO DỊCH MINH BẠCH
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B] mb-2">
              Sở hữu tài nguyên trong 3 bước tự động
            </h2>
            <p className="text-sm text-[#18181B]/75 leading-relaxed">
              Xác thực qua VietQR Napas 24/7 và cam kết bảo vệ người mua với chính sách kiểm thử T+3.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-[#18181B] rounded-[8px] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#1E5FBF]">
                    BƯỚC 01
                  </span>
                  <span className="text-[11px] font-mono text-[#18181B]/50">
                    00:00 THỜI ĐIỂM ĐẦU
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#18181B] mb-2">
                  Kiểm tra Permission Manifest
                </h3>
                <p className="text-xs text-[#18181B]/80 leading-relaxed">
                  Xem trước toàn bộ danh sách external domain, biến môi trường và yêu cầu RAM trước khi bấm thanh toán. Không mua tài sản mù quáng.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#18181B]/15 text-[11px] font-mono text-[#18181B]/60">
                Minh bạch 100% kiến trúc
              </div>
            </div>

            <div className="border-2 border-[#18181B] rounded-[8px] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#1E5FBF]">
                    BƯỚC 02
                  </span>
                  <span className="text-[11px] font-mono text-[#18181B]/50">
                    00:03 SAU KHI QUÉT
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#18181B] mb-2">
                  Quét mã VietQR Napas 24/7
                </h3>
                <p className="text-xs text-[#18181B]/80 leading-relaxed">
                  Cổng payOS tự động đối soát trong 3 giây, lập tức sinh link tải trực tiếp từ Cloudflare R2 có chữ ký số bảo mật (Presigned URL 24h).
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#18181B]/15 text-[11px] font-mono text-[#18181B]/60">
                Không giữ thông tin thẻ tín dụng
              </div>
            </div>

            <div className="border-2 border-[#18181B] rounded-[8px] bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#1E5FBF]">
                    BƯỚC 03
                  </span>
                  <span className="text-[11px] font-mono text-[#1E5FBF] font-bold">
                    00:03 &rarr; 72:00 (T+3)
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#18181B] mb-2">
                  Bảo hành kỹ thuật 72 giờ
                </h3>
                <p className="text-xs text-[#18181B]/80 leading-relaxed">
                  Người mua có trọn vẹn 3 ngày chạy thử trên máy chủ thật. Kỹ sư hỗ trợ kỹ thuật 1-1 qua Zalo OA hoặc hoàn tiền 100% nếu có sai lệch mô tả.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#18181B]/15 text-[11px] font-mono text-[#18181B]/60">
                Hoàn tiền đúng về tài khoản ngân hàng nguồn
              </div>
            </div>
          </div>
        </section>

        {/* 8. BUYER TECHNICAL FAQS */}
        <section id="faq" className="py-14 border-b border-[#18181B]/20">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-mono font-bold text-[#1E5FBF] mb-1">
              GIẢI ĐÁP KỸ THUẬT
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181B]">
              Câu hỏi kỹ thuật thường gặp của người mua
            </h2>
          </div>

          <div className="divide-y divide-[#18181B]/20 border-y border-[#18181B]/20">
            {BUYER_FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="text-sm font-bold text-[#18181B] mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs text-[#18181B]/75 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. HALLMARK MINIMAL FOOTER */}
        <footer className="py-12 text-xs text-[#18181B]/70">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            <div className="md:col-span-5">
              <p className="font-black text-sm text-[#18181B] mb-2 tracking-tight">
                ĐẠI VIỆT AI
              </p>
              <p className="text-xs text-[#18181B]/70 leading-relaxed max-w-sm mb-3">
                Sàn giao dịch sản phẩm số chuẩn hóa: Workflow tự động hóa n8n, Mã nguồn SaaS Next.js 15 và Kịch bản AI Agents thực chiến dành cho Freelancer và Doanh nghiệp Việt Nam.
              </p>
              <p className="text-[11px] font-mono text-[#18181B]/50">
                Tuân thủ Nghị định 52/2013/NĐ-CP, Nghị định 85/2021/NĐ-CP và Luật TMĐT 122/2025/QH15.
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="font-bold text-[#18181B] mb-2">Chính sách bảo vệ người mua</p>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href={`/${locale}/refund-policy`}
                    className="hover:text-[#1E5FBF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                  >
                    Chính sách bảo hành 72 giờ (T+3)
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/privacy`}
                    className="hover:text-[#1E5FBF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                  >
                    Chính sách bảo vệ dữ liệu cá nhân
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/terms`}
                    className="hover:text-[#1E5FBF] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                  >
                    Điều khoản dịch vụ sàn
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="font-bold text-[#18181B] mb-2">Hỗ trợ kỹ thuật người mua</p>
              <ul className="space-y-1.5">
                <li>
                  <span>Kênh hỗ trợ Zalo OA: </span>
                  <a
                    href="https://zalo.me/daivietai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1E5FBF] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
                  >
                    zalo.me/daivietai
                  </a>
                </li>
                <li>
                  <span>Tiếp nhận phản hồi kỹ thuật: </span>
                  <span className="font-mono text-[#18181B]">support@daivietai.vn</span>
                </li>
                <li>
                  <span>Cổng thanh toán: </span>
                  <span className="font-mono text-[#18181B]">VietQR Napas 24/7 (payOS)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#18181B]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} Đại Việt AI Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}`}
                className="hover:text-[#1E5FBF] transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
              >
                Trang chủ sàn
              </Link>
              <span className="text-[#18181B]/30">/</span>
              <Link
                href={`/${locale}/categories`}
                className="hover:text-[#1E5FBF] transition-colors duration-150 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5FBF]"
              >
                Khám phá giải pháp
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
