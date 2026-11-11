import { ProductPageAccordion } from '@/components/molecules';

export const ProductDetailsShipping = () => {
  return (
    <ProductPageAccordion
      heading='Giao Nhận Tức Thì & Chính Sách Bảo Hành T+3'
      defaultOpen={false}
    >
      <div className='product-details'>
        <ul className='space-y-3 text-secondary'>
          <li>
            <strong className="text-primary">Giao nhận tài sản số 24/7 tức thì:</strong> Sau khi hoàn tất quét mã thanh toán VietQR, hệ thống tự động cấp quyền tải tệp (Cloudflare R2 Presigned URL 24h, tối đa 5 lượt tải) ngay trên màn hình xác nhận và lưu trữ trong mục Đơn hàng của bạn.
          </li>
          <li>
            <strong className="text-primary">Bảo hành kỹ thuật T+3:</strong> Người mua có 3 ngày (T+3) để kiểm tra tính toàn vẹn của mã nguồn/workflow. Nếu phát hiện lỗi kỹ thuật, chứa mã độc không đúng Permission Manifest, sàn hỗ trợ kỹ thuật 1-1 hoặc hoàn tiền 100% về đúng tài khoản ngân hàng nguồn.
          </li>
          <li>
            <strong className="text-primary">Hỗ trợ cài đặt chuyên môn 1-1:</strong> Các gói dịch vụ PRO được kỹ thuật viên Đại Việt AI hỗ trợ cấu hình trực tiếp qua UltraViewer/AnyDesk và Zalo Official Account với cam kết phản hồi trong 2 giờ.
          </li>
        </ul>
      </div>
    </ProductPageAccordion>
  );
};
