const links = {
  customerServices: [
    { label: 'Quy chế giao dịch & Bảo hành T+3', path: '/refund-policy' },
    { label: 'Kiểm tra đơn & Tải tài sản số', path: '/user/orders' },
    { label: 'Điều khoản dịch vụ sàn', path: '/terms' },
    { label: 'Thanh toán tự động VietQR & payOS', path: '/terms' },
    { label: 'Hỗ trợ kỹ thuật Zalo OA 1-1', path: 'https://zalo.me/daivietai' },
  ],
  about: [
    { label: 'Về Đại Việt AI (Sứ mệnh & Landing Page)', path: '/landing' },
    { label: 'Chính sách bảo vệ dữ liệu cá nhân', path: '/privacy' },
    { label: 'Quy chế kiểm duyệt sản phẩm AI', path: '/creator-policy' },
    { label: 'Quy trình Notice-and-Takedown 24h', path: '/creator-policy' },
  ],
  connect: [
    { label: 'Zalo Official Account', path: 'https://zalo.me/daivietai' },
    { label: 'Kênh hỗ trợ Telegram', path: 'https://t.me/daiviet_ai_support' },
    { label: 'Cổng thông tin Creator', path: process.env.NEXT_PUBLIC_VENDOR_URL || 'http://localhost:7001' },
  ],
};

export default links;
