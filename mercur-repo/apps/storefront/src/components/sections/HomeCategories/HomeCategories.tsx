import { CustomCarousel as Carousel } from '@/components/cells/Carousel/Carousel';
import { CategoryCard } from '@/components/organisms/CategoryCard/CategoryCard';

export const categories: { id: number; name: string; handle: string; image?: string }[] = [
  {
    id: 1,
    name: "Tự Động Hóa & Workflow",
    handle: "tu-dong-hoa-workflow",
    image: "/images/categories/automation-workflow.svg",
  },
  {
    id: 2,
    name: "Mã Nguồn & Boilerplates",
    handle: "ma-nguon-boilerplates",
    image: "/images/categories/source-code.svg",
  },
  {
    id: 3,
    name: "Phần Mềm & Tiện Ích",
    handle: "phan-mem-tien-ich-so",
    image: "/images/categories/extensions-tools.svg",
  },
  {
    id: 4,
    name: "Gói Tri Thức & Prompt AI",
    handle: "goi-tri-thuc-prompt-ai",
    image: "/images/categories/ai-knowledge.svg",
  },
  {
    id: 5,
    name: "Dịch Vụ Cài Đặt 1-1",
    handle: "dich-vu-cai-dat-chuyen-mon",
    image: "/images/categories/setup-service.svg",
  },
]

export const HomeCategories = async ({ heading }: { heading: string }) => {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="mb-6">
        <h2 className="heading-lg text-primary uppercase">{heading}</h2>
      </div>
      <Carousel
        items={categories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      />
    </section>
  )
}
