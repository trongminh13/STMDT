import { SingleProductImage } from "@/types/product"
import { SafeImage } from "@/components/atoms"

export const GalleryCarouselItem = ({
  image,
}: {
  image: SingleProductImage
}) => {
  return (
    <SafeImage
      key={image.id}
      src={decodeURIComponent(image.url)}
      alt={image.alt || "Product image"}
      width={700}
      height={700}
      className="w-full h-full object-contain aspect-square"
    />
  )
}
