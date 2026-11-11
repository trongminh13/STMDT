import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chính Sách Bảo Vệ Dữ Liệu Cá Nhân — Đại Việt AI",
  description:
    "Chính sách bảo vệ dữ liệu cá nhân tuân thủ Nghị định 13/2023/NĐ-CP và Luật Dữ liệu số 91/2025/QH15 tại Sàn Đại Việt AI.",
}

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl text-primary">
      <div className="border-b pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider inline-block px-3 py-1 mb-3 rounded-sm bg-action text-action-on-primary">
          TUÂN THỦ NGHỊ ĐỊNH 13/2023/NĐ-CP &amp; LUẬT DỮ LIỆU SỐ 91/2025/QH15
        </span>
        <h1 className="heading-xl uppercase mb-2">
          CHÍNH SÁCH BẢO VỆ DỮ LIỆU CÁ NHÂN
        </h1>
        <p className="text-secondary text-sm">
          Hiệu lực từ ngày 01/01/2026 • Bảo mật theo tiêu chuẩn cấp bộ
        </p>
      </div>

      <div className="space-y-8 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            1. Mục Đích Thu Thập Dữ Liệu
          </h2>
          <p className="text-secondary">
            Đại Việt AI chỉ thu thập các dữ liệu cá nhân tối thiểu cần thiết để phục vụ:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li>Tạo lập tài khoản và xác thực phiên đăng nhập an toàn.</li>
            <li>Xử lý giao dịch thanh toán VietQR và đối soát ngân hàng tự động.</li>
            <li>Cấp phát chữ ký số ngắn hạn (Presigned URL) tải tệp trên hạ tầng Cloudflare R2.</li>
            <li>Cung cấp hỗ trợ kỹ thuật 1-1 đối với các gói dịch vụ PRO qua Zalo OA và Telegram.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            2. Cam Kết Không Thương Mại Hóa Dữ Liệu
          </h2>
          <p className="text-secondary">
            Đại Việt AI cam kết tuyệt đối <strong>KHÔNG bán, chia sẻ hoặc cho thuê dữ liệu cá nhân</strong> của người dùng cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị trái phép. Mọi thông tin trao đổi trong quá trình hỗ trợ kỹ thuật được bảo mật theo thỏa thuận bảo mật NDA.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            3. Lưu Trữ &amp; Biện Pháp Bảo Vệ Kỹ Thuật
          </h2>
          <p className="text-secondary">
            Toàn bộ dữ liệu người dùng được lưu trữ trên hệ thống cơ sở dữ liệu mã hóa tĩnh (Encryption at Rest) và mã hóa truyền dẫn (TLS 1.3). Hạ tầng lưu trữ tệp số R2 được bảo vệ bằng chữ ký số có thời hạn (TTL 24h), khống chế tối đa 5 lượt tải chống scraping và rò rỉ mã nguồn.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            4. Quyền Của Chủ Thể Dữ Liệu
          </h2>
          <p className="text-secondary">
            Người dùng có đầy đủ các quyền theo quy định tại Nghị định 13/2023/NĐ-CP:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li>Quyền được biết và đồng ý về phạm vi dữ liệu thu thập.</li>
            <li>Quyền tra cứu, chỉnh sửa thông tin tài khoản trong mục Cài đặt.</li>
            <li>Quyền yêu cầu trích xuất hoặc xóa bỏ toàn bộ dữ liệu cá nhân (Right to Erasure) bằng cách liên hệ bộ phận Data Protection Officer (DPO) qua email <code>privacy@daiviet.edu.vn</code>.</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
