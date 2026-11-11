import { GalleryCarousel } from '@/components/organisms';
import { SafeImage } from '@/components/atoms';
import { HttpTypes } from '@medusajs/types';

export const ProductGallery = ({
  images,
  thumbnail,
  title,
}: {
  images: HttpTypes.StoreProduct['images'];
  thumbnail?: string | null;
  title?: string;
}) => {
  const displayImages = images && images.length > 0
    ? images
    : thumbnail
    ? [{ id: 'thumb', url: thumbnail, alt: title || 'Product Image' } as any]
    : [];

  if (displayImages.length === 0) {
    return (
      <div className="border w-full aspect-square p-1 rounded-sm" data-testid="product-gallery">
        <SafeImage
          src=""
          alt={title || "Product Image"}
          width={700}
          height={700}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }
   
  return (
    <div data-testid="product-gallery">
      <GalleryCarousel images={displayImages} />
    </div>
  );
};
