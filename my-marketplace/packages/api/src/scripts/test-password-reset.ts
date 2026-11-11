import { generatePasswordResetEmailHtml } from "../modules/email/templates/password-reset-template"
import { emailService } from "../modules/email/email.service"
import passwordResetHandler from "../subscribers/password-reset"

async function runTestSuite() {
  console.log("========================================================================================")
  console.log("BỘ KIỂM ĐỊNH TỰ ĐỘNG CHUYÊN SÂU: EMAIL SERVICE & SUBSCRIBER KHÔI PHỤC MẬT KHẨU")
  console.log("========================================================================================\n")

  let passedTests = 0
  const totalTests = 4

  // -------------------------------------------------------------------------------------
  // Test 1: Tạo HTML Email Template chuẩn Sàn Đại Việt AI
  // -------------------------------------------------------------------------------------
  console.log("[Test 1] Kiểm tra cấu trúc HTML & Text Template email...")
  const testData = {
    email: "khachhang@daiviet.ai",
    resetUrl: "http://localhost:3000/vn/reset-password?token=test_token_123456",
    token: "test_token_123456",
    expiresInMinutes: 15,
  }

  const { subject, html, text } = generatePasswordResetEmailHtml(testData)

  if (!subject.includes("Khôi phục mật khẩu")) {
    throw new Error("Test 1 FAILED: Tiêu đề email không đúng định dạng!")
  }
  if (!html.includes(testData.resetUrl) || !html.includes("15 phút") || !html.includes("SÀN ĐẠI VIỆT AI")) {
    throw new Error("Test 1 FAILED: HTML Email thiếu liên kết reset hoặc thông tin thương hiệu!")
  }
  if (!text.includes(testData.resetUrl) || !text.includes(testData.email)) {
    throw new Error("Test 1 FAILED: Text plain email thiếu dữ liệu người nhận!")
  }

  console.log(`  ✓ Tiêu đề email: "${subject}"`)
  console.log(`  ✓ Dung lượng HTML: ${html.length} bytes`)
  console.log(`  ✓ Dung lượng Text: ${text.length} bytes`)
  console.log("  => Test 1 PASSED: Template chuẩn nhận diện Sàn Đại Việt AI.\n")
  passedTests++

  // -------------------------------------------------------------------------------------
  // Test 2: Gửi email qua EmailService (Chế độ Mock / Console Logger)
  // -------------------------------------------------------------------------------------
  console.log("[Test 2] Kiểm tra EmailService dispatch ở chế độ Mock/Development...")
  const result = await emailService.sendPasswordResetEmail(testData)

  if (!result.success) {
    throw new Error(`Test 2 FAILED: EmailService trả về thất bại: ${result.error}`)
  }
  if (result.mode !== "mock") {
    throw new Error(`Test 2 FAILED: Kỳ vọng mode 'mock' khi chưa cấu hình API key, nhận được '${result.mode}'`)
  }

  console.log(`  ✓ Trạng thái gửi: ${result.success}`)
  console.log(`  ✓ Chế độ hoạt động: ${result.mode}`)
  console.log("  => Test 2 PASSED: EmailService tự động fallback an toàn sang Logger Console.\n")
  passedTests++

  // -------------------------------------------------------------------------------------
  // Test 3: Kích hoạt Subscriber Medusa auth.password_reset
  // -------------------------------------------------------------------------------------
  console.log("[Test 3] Kiểm tra Subscriber passwordResetHandler xử lý sự kiện auth.password_reset...")
  const logs: string[] = []
  const mockLogger = {
    info: (msg: string) => logs.push(`[INFO] ${msg}`),
    warn: (msg: string) => logs.push(`[WARN] ${msg}`),
    error: (msg: string) => logs.push(`[ERROR] ${msg}`),
  }

  const mockContainer = {
    resolve: (key: string) => {
      if (key === "logger") return mockLogger
      return null
    },
  } as any

  await passwordResetHandler({
    event: {
      name: "auth.password_reset",
      data: {
        entity_id: "developer@daiviet.ai",
        actor_type: "customer",
        token: "jwt_token_sample_abcxyz",
      },
    },
    container: mockContainer,
  } as any)

  const hasDispatchedLog = logs.some((l) => l.includes("Email dispatched successfully"))
  if (!hasDispatchedLog) {
    throw new Error(`Test 3 FAILED: Subscriber không ghi nhận email dispatch thành công. Logs: ${JSON.stringify(logs)}`)
  }

  console.log(`  ✓ Log subscriber: ${logs.join(" | ")}`)
  console.log("  => Test 3 PASSED: Subscriber lắng nghe và kích hoạt gửi mail hoàn hảo.\n")
  passedTests++

  // -------------------------------------------------------------------------------------
  // Test 4: Kiểm tra phòng hộ thiếu dữ liệu trong payload
  // -------------------------------------------------------------------------------------
  console.log("[Test 4] Kiểm tra cơ chế phòng hộ khi payload thiếu email hoặc token...")
  const warnLogs: string[] = []
  const warnLogger = {
    info: () => {},
    warn: (msg: string) => warnLogs.push(msg),
    error: () => {},
  }
  const warnContainer = {
    resolve: () => warnLogger,
  } as any

  await passwordResetHandler({
    event: {
      name: "auth.password_reset",
      data: {
        entity_id: "",
        actor_type: "customer",
        token: "",
      },
    },
    container: warnContainer,
  } as any)

  if (warnLogs.length === 0 || !warnLogs[0].includes("Missing email or token")) {
    throw new Error("Test 4 FAILED: Subscriber không cảnh báo khi dữ liệu rỗng!")
  }

  console.log(`  ✓ Cảnh báo phòng hộ: "${warnLogs[0]}"`)
  console.log("  => Test 4 PASSED: Cơ chế bảo vệ payload rỗng hoạt động an toàn.\n")
  passedTests++

  console.log("========================================================================================")
  console.log(`TỔNG KẾT: ${passedTests}/${totalTests} BÀI TEST THÀNH CÔNG 100%!`)
  console.log("========================================================================================")
}

runTestSuite().catch((err) => {
  console.error("Test Suite thất bại:", err)
  process.exit(1)
})
