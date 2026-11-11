import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chính Sách Bảo Hành Kỹ Thuật T+3 & Hoàn Tiền — Đại Việt AI",
  description:
    "Quy trình kiểm tra chất lượng và cơ chế bảo hành kỹ thuật 72h (T+3) với cam kết hoàn tiền 100% về tài khoản nguồn tại Đại Việt AI.",
}

export default function RefundPolicyPage() {
  return (
    <main className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl text-primary">
      <div className="border-b pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider inline-block px-3 py-1 mb-3 rounded-sm bg-action text-action-on-primary">
          CAM KẾT CHẤT LƯỢNG KỸ THUẬT
        </span>
        <h1 className="heading-xl uppercase mb-2">
          CHÍNH SÁCH BẢO HÀNH KỸ THUẬT T+3 &amp; HOÀN TIỀN
        </h1>
        <p className="text-secondary text-sm">
          Bảo vệ quyền lợi tối cao của Người mua hàng số • Phiên bản 2.0
        </p>
      </div>

      <div className="space-y-8 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            1. Khung Thời Gian Bảo Hành T+3 (72 Giờ Vàng)
          </h2>
          <p className="text-secondary">
            Mọi sản phẩm số mua trên sàn Đại Việt AI đều được bảo hộ bằng <strong>Cơ chế Bảo Hành Kỹ Thuật T+3 (72 giờ)</strong> tính từ thời điểm đơn hàng được ghi nhận thanh toán thành công (status = <code>captured</code>). Trong suốt thời gian này, khoản tiền thanh toán được đóng băng tạm thời tại quỹ đảm bảo trước khi giải ngân cho Creator.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            2. Điều Kiện Được Áp Dụng Hoàn Tiền 100%
          </h2>
          <p className="text-secondary">
            Người mua được quyền khiếu nại và yêu cầu hoàn trả 100% tiền trong các trường hợp:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li><strong>Tệp tin bị lỗi hoặc hỏng:</strong> File tải về bị lỗi cấu trúc nén ZIP, JSON n8n/Dify cú pháp không hợp lệ không thể import vào hệ thống.</li>
            <li><strong>Sai lệch so với Permission Manifest:</strong> Sản phẩm yêu cầu quyền hạn hoặc gọi tới các external API không được khai báo minh bạch trong thông số kỹ thuật.</li>
            <li><strong>Không cài đặt được dù đã làm đúng hướng dẫn:</strong> Người mua đã làm theo tài liệu hướng dẫn và liên hệ hỗ trợ kỹ thuật nhưng lỗi vẫn tồn tại do mã nguồn của Creator.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            3. Nguyên Tắc Hoàn Tiền Chống Rửa Tiền &amp; An Toàn Tài Khoản
          </h2>
          <p className="text-secondary">
            Để tuân thủ nghiêm ngặt quy định chống rửa tiền và bảo vệ an ninh tài chính:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li><strong>CHỈ HOÀN TIỀN VỀ ĐÚNG TÀI KHOẢN NGUỒN:</strong> Tiền hoàn được chuyển khoản trực tiếp về đúng số tài khoản ngân hàng và tên chủ tài khoản đã thực hiện quét VietQR thanh toán đơn hàng đó.</li>
            <li><strong>Tuyệt đối không hoàn tiền sang tài khoản thứ ba</strong> hoặc chuyển đổi thành tiền mặt dưới bất kỳ hình thức nào.</li>
            <li>Thời gian xử lý chuyển tiền hoàn: Trong vòng 24–48 giờ làm việc kể từ khi yêu cầu khiếu nại được phê duyệt.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            4. Quy Trình Gửi Yêu Cầu Khiếu Nại
          </h2>
          <ol className="list-decimal pl-6 space-y-1 text-secondary">
            <li>Gửi mã đơn hàng (ví dụ: <code>order_01...</code>) kèm ảnh chụp màn hình lỗi kỹ thuật tới kênh hỗ trợ Zalo Official Account hoặc Telegram CSKH.</li>
            <li>Kỹ thuật viên sàn tiến hành đối soát độc lập trong môi trường Sandbox cô lập (SLA 2 giờ).</li>
            <li>Nếu lỗi do sản phẩm, sàn đóng băng Payout của Creator và kích hoạt lệnh hoàn tiền tự động 100%.</li>
          </ol>
        </section>
      </div>
    </main>
  )
}
