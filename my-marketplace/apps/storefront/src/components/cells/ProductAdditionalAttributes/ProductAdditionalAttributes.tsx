import { ProductPageAccordion } from "@/components/molecules"
import { AdditionalAttributeProps } from "@/types/product"
import { extractProductAiSpecifications, AiSpecificationItem } from "@/lib/helpers/product-specifications"

interface ProductAdditionalAttributesProps {
  attributes?: AdditionalAttributeProps[]
  product?: any
}

export const ProductAdditionalAttributes = ({
  attributes,
  product,
}: ProductAdditionalAttributesProps) => {
  // 1. Nếu có product truyền vào, chuẩn hóa toàn diện từ cả attribute_values và metadata
  let specs: AiSpecificationItem[] = []

  if (product) {
    specs = extractProductAiSpecifications(product)
  } else if (attributes && attributes.length > 0) {
    // Fallback: Nếu chỉ truyền attributes truyền thống
    const nonEmptyAttributes = attributes.filter((attribute) => !!attribute && attribute.id)
    specs = nonEmptyAttributes.map((attr) => ({
      key: attr.attribute?.handle || String(attr.id),
      label: attr.attribute?.name || "Thuộc tính",
      value: String(attr.value || ""),
    }))
  }

  if (!specs.length) return null

  return (
    <ProductPageAccordion
      heading="Thông số Kỹ thuật & Môi trường AI"
      defaultOpen={true}
      data-testid="product-additional-attributes-section"
    >
      <div className="border rounded-sm overflow-hidden divide-y text-sm bg-primary">
        {specs.map((item) => (
          <div
            key={item.key}
            className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-2 hover:bg-secondary/5 transition-colors"
            data-testid={`product-spec-${item.key}`}
          >
            <div className="font-medium text-secondary sm:border-r sm:pr-3 flex items-center">
              {item.label}
            </div>
            <div className="sm:col-span-2 flex items-center text-primary">
              {item.badgeColor ? (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.badgeColor}`}>
                  {item.value}
                </span>
              ) : item.isCode ? (
                <code className="text-xs bg-secondary/10 px-2 py-1 rounded font-mono break-all text-secondary select-all">
                  {item.value}
                </code>
              ) : (
                <span className="font-normal">{item.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ProductPageAccordion>
  )
}
