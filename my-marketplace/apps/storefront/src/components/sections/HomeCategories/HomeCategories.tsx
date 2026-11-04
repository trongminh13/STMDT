import { Carousel } from "@/components/cells"
import { CategoryCard } from "@/components/organisms"

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
    <section className="bg-primary w-full py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-6 flex flex-col">
          <h2 className="heading-lg text-primary uppercase">{heading}</h2>
          <p className="text-secondary text-sm md:text-base mt-1">
            Khám phá 5 nhóm giải pháp hàng số và AI thực chiến được phân loại theo chuẩn Product Taxonomy 1.0.
          </p>
        </div>
        <Carousel
          items={categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        />
      </div>
    </section>
  )
}
