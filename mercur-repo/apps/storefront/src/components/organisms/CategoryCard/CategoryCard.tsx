import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import Image from "next/image"

export function CategoryCard({
  category,
}: {
  category: { name: string; handle: string; image?: string }
}) {
  const imageSrc =
    category.image ||
    (category.handle === "tu-dong-hoa-workflow"
      ? "/images/categories/automation-workflow.svg"
      : category.handle === "ma-nguon-boilerplates"
      ? "/images/categories/source-code.svg"
      : category.handle === "phan-mem-tien-ich-so"
      ? "/images/categories/extensions-tools.svg"
      : category.handle === "goi-tri-thuc-prompt-ai"
      ? "/images/categories/ai-knowledge.svg"
      : category.handle === "dich-vu-cai-dat-chuyen-mon"
      ? "/images/categories/setup-service.svg"
      : `/images/categories/${category.handle}.png`)

  return (
    <LocalizedClientLink
      href={`/categories/${category.handle}`}
      className="relative flex flex-col items-center border rounded-sm bg-component transition-all hover:rounded-full w-[233px] aspect-square"
    >
      <div className="flex relative aspect-square overflow-hidden w-[200px]">
        <Image
          loading="lazy"
          src={imageSrc}
          alt={`category - ${category.name}`}
          width={200}
          height={200}
          sizes="(min-width: 1024px) 200px, 40vw"
          className="object-contain scale-90 rounded-full"
        />
      </div>
      <h3 className="w-full text-center label-lg text-primary">
        {category.name}
      </h3>
    </LocalizedClientLink>
  )
}
