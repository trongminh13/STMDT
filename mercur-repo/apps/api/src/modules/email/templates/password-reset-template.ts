export interface PasswordResetEmailData {
  email: string
  resetUrl: string
  token: string
  expiresInMinutes?: number
}

export function generatePasswordResetEmailHtml(data: PasswordResetEmailData): {
  subject: string
  html: string
  text: string
} {
  const expiresIn = data.expiresInMinutes || 15
  const subject = `[Đại Việt AI] Khôi phục mật khẩu tài khoản của bạn`

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F4F4F5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #18181B;
      line-height: 1.5;
    }
    .wrapper {
      width: 100%;
      background-color: #F4F4F5;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #18181B;
      color: #FFFFFF;
      padding: 24px 32px;
      border-bottom: 3px solid #1E5FBF;
    }
    .header-title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }
    .header-sub {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #A1A1AA;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .body {
      padding: 32px;
    }
    .heading {
      margin: 0 0 16px 0;
      font-size: 20px;
      font-weight: 700;
      color: #18181B;
    }
    .paragraph {
      margin: 0 0 20px 0;
      font-size: 15px;
      color: #3F3F46;
    }
    .btn-container {
      margin: 28px 0;
      text-align: center;
    }
    .btn {
      display: inline-block;
      background-color: #83C0D7;
      color: #18181B !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 28px;
      border-radius: 8px;
      border: 2px solid #18181B;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .alert-box {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #1E5FBF;
      padding: 14px 16px;
      border-radius: 4px;
      margin: 24px 0;
      font-size: 13px;
      color: #475569;
    }
    .url-fallback {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px dashed #E4E4E7;
      font-size: 12px;
      color: #71717A;
      word-break: break-all;
    }
    .url-fallback a {
      color: #1E5FBF;
    }
    .footer {
      background-color: #FAFAFA;
      padding: 20px 32px;
      border-top: 1px solid #E4E4E7;
      font-size: 12px;
      color: #A1A1AA;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="header-title">SÀN ĐẠI VIỆT AI</h1>
        <p class="header-sub">Hệ thống phân phối Tài nguyên số & Tự động hóa</p>
      </div>
      <div class="body">
        <h2 class="heading">Yêu cầu đặt lại mật khẩu</h2>
        <p class="paragraph">
          Xin chào <strong>${data.email}</strong>,
        </p>
        <p class="paragraph">
          Chúng tôi nhận được yêu cầu khôi phục mật khẩu đăng nhập cho tài khoản của bạn tại Sàn Đại Việt AI. Hãy bấm vào nút dưới đây để thiết lập mật khẩu mới:
        </p>
        
        <div class="btn-container">
          <a href="${data.resetUrl}" class="btn" target="_blank" rel="noopener noreferrer">
            ĐẶT LẠI MẬT KHẨU CỦA BẠN &rarr;
          </a>
        </div>

        <div class="alert-box">
          <strong>Lưu ý bảo mật:</strong> Liên kết đặt lại mật khẩu này chỉ có hiệu lực trong vòng <strong>${expiresIn} phút</strong>. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua thư. Mật khẩu hiện tại của bạn vẫn an toàn tuyệt đối.
        </div>

        <div class="url-fallback">
          Nếu không bấm được vào nút trên, hãy sao chép và dán trực tiếp liên kết sau vào trình duyệt:<br>
          <a href="${data.resetUrl}">${data.resetUrl}</a>
        </div>
      </div>
      <div class="footer">
        © 2026 Sàn Đại Việt AI (Công ty Cổ phần Giáo dục Đại Việt). Mọi quyền được bảo lưu.<br>
        Email này được gửi tự động từ hệ thống xác thực tài khoản.
      </div>
    </div>
  </div>
</body>
</html>`

  const text = `[SÀN ĐẠI VIỆT AI] Yêu cầu khôi phục mật khẩu

Xin chào ${data.email},

Chúng tôi nhận được yêu cầu khôi phục mật khẩu tài khoản của bạn tại Sàn Đại Việt AI.

Để đặt lại mật khẩu, vui lòng truy cập liên kết sau:
${data.resetUrl}

Lưu ý: Liên kết chỉ có hiệu lực trong vòng ${expiresIn} phút. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.

---
© 2026 Sàn Đại Việt AI - Công ty Cổ phần Giáo dục Đại Việt`

  return { subject, html, text }
}
