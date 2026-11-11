import { BlogPost } from '@/types/blog';
import { BlogCard } from '@/components/organisms';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Hướng Dẫn Tích Hợp n8n Với Zalo Official Account Tự Động 24/7',
    excerpt:
      'Chi tiết từng bước cấu hình Webhook và OpenAPI Zalo giúp doanh nghiệp tự động phản hồi tin nhắn, phân loại khách hàng tiềm năng không gián đoạn.',
    image: '/images/categories/automation-workflow.svg',
    category: 'TỰ ĐỘNG HÓA',
    href: '#',
  },
  {
    id: 2,
    title: 'Xây Dựng Pipeline RAG Tài Liệu Với DeepSeek-V3 & Qdrant',
    excerpt:
      'Kiến trúc trích xuất thông tin thông minh từ PDF/Excel, tối ưu hóa chi phí token và nâng cao độ chính xác khi tìm kiếm ngữ nghĩa nội bộ.',
    image: '/images/categories/ai-knowledge.svg',
    category: 'KỸ THUẬT AI',
    href: '#',
  },
  {
    id: 3,
    title: 'Chính Sách Bảo Vệ Người Mua & Quy Chế Giao Dịch Hàng Số T+3',
    excerpt:
      'Tìm hiểu cơ chế kiểm duyệt tĩnh Permission Manifest, quy trình hỗ trợ cài đặt 1-1 và cam kết an toàn mã nguồn trên sàn Đại Việt AI.',
    image: '/images/categories/setup-service.svg',
    category: 'CHÍNH SÁCH & BẢO HÀNH',
    href: '#',
  },
];

export function BlogSection() {
  return (
    <section className='bg-tertiary container'>
      <div className='flex items-center justify-between mb-12'>
        <h2 className='heading-lg text-tertiary uppercase'>
          CẨM NANG &amp; TRI THỨC TRIỂN KHAI AI
        </h2>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3'>
        {blogPosts.map((post, index) => (
          <BlogCard
            key={post.id}
            index={index}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}
