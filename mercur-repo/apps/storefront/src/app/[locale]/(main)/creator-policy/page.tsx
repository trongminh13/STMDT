import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quy Chế Kiểm Duyệt Sản Phẩm AI & Điều Khoản Creator — Đại Việt AI",
  description:
    "Tiêu chuẩn kiểm duyệt kỹ thuật DoD, nguyên tắc an toàn mã nguồn Zero-Malware và cơ chế Notice-and-Takedown 24h tại Sàn Đại Việt AI.",
}

export default function CreatorPolicyPage() {
  return (
    <main className="container mx-auto px-4 lg:px-8 py-10 max-w-5xl text-primary">
      <div className="border-b pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-wider inline-block px-3 py-1 mb-3 rounded-sm bg-action text-action-on-primary">
          TIÊU CHUẨN AN TOÀN KỸ THUẬT &amp; BẢN QUYỀN TÁC GIẢ
        </span>
        <h1 className="heading-xl uppercase mb-2">
          QUY CHẾ KIỂM DUYỆT SẢN PHẨM AI &amp; ĐIỀU KHOẢN DÀNH CHO CREATOR
        </h1>
        <p className="text-secondary text-sm">
          Áp dụng cho mọi Nhà phát triển, Kỹ sư AI và Creator đăng bán trên sàn
        </p>
      </div>

      <div className="space-y-8 text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            1. Tiêu Chuẩn Kiểm Duyệt Tĩnh Permission Manifest (DoD)
          </h2>
          <p className="text-secondary">
            Mọi sản phẩm trước khi được cấp phép xuất bản lên Marketplace bắt buộc phải vượt qua pipeline kiểm duyệt tĩnh tự động (Static AST JSON Linter &amp; Antivirus Scanner):
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li><strong>Cấm tuyệt đối mã độc &amp; hành vi nguy hiểm (Zero-Malware):</strong> Chặn đứng mọi node <code>executeCommand</code>, <code>child_process</code>, <code>eval()</code>, hoặc các đoạn mã obfuscated cố tình che giấu hành vi.</li>
            <li><strong>Minh bạch biến môi trường &amp; External Domains:</strong> Toàn bộ API Keys và tên miền bên thứ ba (OpenAI, Zalo OA, DeepSeek, Webhook) phải được khai báo rõ trong trường Permission Manifest.</li>
            <li><strong>Bảo vệ định dạng tệp Model:</strong> Nghiêm cấm phân phối tệp nhị phân Python Pickle (<code>.pt</code>, <code>.bin</code>, <code>.ckpt</code>) do nguy cơ RCE. Chỉ chấp nhận các định dạng an toàn <code>.safetensors</code> và <code>.gguf</code>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            2. Cam Kết Bản Quyền Tác Giả &amp; Trách Nhiệm Pháp Lý
          </h2>
          <p className="text-secondary">
            Creator đăng bán sản phẩm cam đoan và bảo đảm:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-secondary">
            <li>Sở hữu quyền tác giả hợp pháp hoặc có giấy phép phân phối thương mại hợp lệ đối với mã nguồn, workflow và tài sản số được đăng ký.</li>
            <li>Không vi phạm giấy phép nguồn mở (GPL, Apache, MIT) và giấy phép hạn chế của các Foundation Models (như Black Forest Labs với Flux.1-Dev).</li>
            <li>Chịu trách nhiệm bồi hoàn 100% thiệt hại phát sinh và miễn trừ toàn bộ trách nhiệm liên đới cho Ban quản trị Sàn Đại Việt AI nếu xảy ra tranh chấp sở hữu trí tuệ.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            3. Cơ Chế Báo Cáo Vi Phạm Notice-and-Takedown 24 Giờ
          </h2>
          <p className="text-secondary">
            Khi nhận được văn bản thông báo vi phạm bản quyền kèm bằng chứng chứng minh từ chủ sở hữu quyền hợp pháp:
          </p>
          <ol className="list-decimal pl-6 space-y-1 text-secondary">
            <li>Ban quản trị sàn lập tức gỡ bỏ quyền truy cập công khai sản phẩm và chuyển trạng thái <code>DISPUTED_LOCKED</code> trong vòng tối đa <strong>24 giờ</strong>.</li>
            <li>Đóng băng số dư ví Payout tương ứng của Creator liên quan trong thời gian xác minh.</li>
            <li>Gửi thông báo yêu cầu Creator giải trình trong thời hạn 48 giờ. Nếu Creator không phản hồi hoặc không chứng minh được quyền sở hữu hợp pháp, sản phẩm sẽ bị xóa vĩnh viễn và chấm dứt tài khoản Creator.</li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="heading-md uppercase text-primary border-l-4 border-action pl-3">
            4. Phí Nền Tảng &amp; Quy Chế Thanh Toán Payout
          </h2>
          <p className="text-secondary">
            Phí hoa hồng sàn được áp dụng cạnh tranh (10% - 15% trên giá trị đơn hàng thành công). Creator được rút tiền Payout về tài khoản ngân hàng định kỳ vào ngày 01 và ngày 15 hàng tháng khi số dư khả dụng đạt tối thiểu 200.000 VNĐ (sau khi đã trừ khoản thuế TNCN/GTGT theo Nghị định 117/2025/NĐ-CP).
          </p>
        </section>
      </div>
    </main>
  )
}
