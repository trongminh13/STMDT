import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quy Chế Hoạt Động & Điều Khoản Dịch Vụ — Đại Việt AI",
  description:
    "Quy chế hoạt động sàn giao dịch thương mại điện tử hàng số & AI Đại Việt AI, tuân thủ Luật Thương mại điện tử số 122/2025/QH15.",
}

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl text-primary">
      <div className="border-b pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider inline-block px-3 py-1 mb-3 rounded-sm bg-action text-action-on-primary">
          CĂN CỨ LUẬT TMĐT SỐ 122/2025/QH15
        </span>
        <h1 className="heading-xl uppercase mb-2">
          QUY CHẾ HOẠT ĐỘNG &amp; ĐIỀU KHOẢN DỊCH VỤ SÀN ĐẠI VIỆT AI
        </h1>
        <p className="text-secondary text-sm">
          Áp dụng chính thức từ ngày 01/01/2026 • Phiên bản 2.0
        </p>
      </div>

      <div className="space-y-8 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            1. Nguyên Tắc Chung &amp; Định Vị Nền Tảng
          </h2>
          <p className="text-secondary">
            Sàn giao dịch thương mại điện tử <strong>Đại Việt AI</strong> (thuộc Công ty Giáo dục Đại Việt) là nền tảng công nghệ chuyên biệt cho việc giao dịch các <strong>Sản phẩm Số, Mã nguồn phần mềm và Dịch vụ triển khai Trí tuệ Nhân tạo thực chiến</strong> theo quy định tại Luật Công nghiệp công nghệ số số 71/2025/QH15 và Luật Thương mại điện tử số 122/2025/QH15.
          </p>
          <p className="text-secondary">
            Toàn bộ giao dịch trên sàn được thực hiện tự động qua hợp đồng điện tử tải tức thì, tích hợp thanh toán bảo mật VietQR NAPAS 24/7.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            2. Phạm Vi Sản Phẩm Khả Dụng &amp; Phân Loại Danh Mục
          </h2>
          <p className="text-secondary">
            Sàn phân phối 5 nhóm giải pháp công nghệ theo chuẩn Product Taxonomy 1.0:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li><strong>Tự Động Hóa &amp; Workflow (AUT):</strong> Kịch bản n8n, Dify, Make.com tự động hóa nghiệp vụ doanh nghiệp.</li>
            <li><strong>Mã Nguồn &amp; Boilerplates (COD):</strong> Source code SaaS fullstack Next.js, FastAPI, NestJS chuẩn hóa.</li>
            <li><strong>Phần Mềm &amp; Tiện Ích Số (SFT):</strong> Tiện ích mở rộng Chrome Extension, CLI tools, scripts tự động hóa.</li>
            <li><strong>Gói Tri Thức &amp; Prompt AI (AIC):</strong> Bộ dữ liệu RAG, System Prompts tinh chỉnh theo ngành dọc.</li>
            <li><strong>Dịch Vụ Cài Đặt Chuyên Môn (PRO):</strong> Gói hỗ trợ kỹ thuật remote 1-1 cài đặt VPS và coaching vận hành thực chiến.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            3. Cơ Chế Giao Kết Hợp Đồng &amp; Tải Tệp Tin Tức Thì
          </h2>
          <p className="text-secondary">
            Sau khi Người mua hoàn tất thanh toán quét mã VietQR qua cổng đối tác ngân hàng:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li>Hệ thống tự động kích hoạt quyền tải tệp trong 3 giây (Cloudflare R2 Presigned URL 24h, tối đa 5 lượt tải).</li>
            <li>Hợp đồng điện tử và biên lai giao dịch được lưu trữ vĩnh viễn trong mục <em>Đơn hàng của bạn</em>.</li>
            <li>Đối với dịch vụ PRO, Người mua nhận đường dẫn liên hệ Zalo Official Account và Telegram để đặt lịch hỗ trợ kỹ thuật với cam kết SLA tiếp nhận trong 2 giờ.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            4. Trách Nhiệm Về Thuế &amp; Nghĩa Vụ Tài Chính
          </h2>
          <p className="text-secondary">
            Sàn Đại Việt AI thực hiện nghĩa vụ khấu trừ thuế tại nguồn đối với Người bán (Creator) theo quy định tại Nghị định 117/2025/NĐ-CP (0.5% TNCN đối với hàng số/phần mềm và 7% đối với dịch vụ cài đặt PRO) trước khi thực hiện Payout theo định kỳ.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            5. Giải Quyết Tranh Chấp &amp; Thẩm Quyền Pháp Lý
          </h2>
          <p className="text-secondary">
            Mọi tranh chấp phát sinh trong quá trình giao dịch ưu tiên giải quyết qua thương lượng thông qua cơ chế Bảo hành T+3 của Sàn. Trường hợp không đạt được thỏa thuận, vụ việc sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam theo pháp luật hiện hành.
          </p>
        </section>
      </div>
    </main>
  )
}
