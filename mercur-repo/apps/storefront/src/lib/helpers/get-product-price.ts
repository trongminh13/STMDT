import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

export const getPricesForVariant = (variant: any) => {
  if (
    variant?.calculated_price?.calculated_amount_with_tax == null &&
    variant?.calculated_price?.calculated_amount == null
  ) {
    return null
  }

  const cp = variant.calculated_price
  const priceType =
    cp.calculated_price?.price_list_type || cp.price_list_type || "default"
  const percentageDiff =
    cp.original_amount != null &&
    cp.calculated_amount != null &&
    cp.original_amount > 0 &&
    cp.original_amount > cp.calculated_amount
      ? getPercentageDiff(cp.original_amount, cp.calculated_amount)
      : "0"

  if (cp.calculated_amount_with_tax == null) {
    return {
      calculated_price_number: cp.calculated_amount,
      calculated_price: convertToLocale({
        amount: cp.calculated_amount,
        currency_code: cp.currency_code,
      }),
      calculated_price_without_tax: convertToLocale({
        amount: cp.calculated_amount_without_tax ?? cp.calculated_amount,
        currency_code: cp.currency_code,
      }),
      calculated_price_without_tax_number:
        cp.calculated_amount_without_tax ?? cp.calculated_amount,
      original_price_number: cp.original_amount ?? cp.calculated_amount,
      original_price: convertToLocale({
        amount: cp.original_amount ?? cp.calculated_amount,
        currency_code: cp.currency_code,
      }),
      currency_code: cp.currency_code,
      price_type: priceType,
      percentage_diff: percentageDiff,
    }
  }

  return {
    calculated_price_number: cp.calculated_amount_with_tax,
    calculated_price: convertToLocale({
      amount: cp.calculated_amount_with_tax,
      currency_code: cp.currency_code,
    }),
    calculated_price_without_tax: convertToLocale({
      amount: cp.calculated_amount_without_tax ?? cp.calculated_amount_with_tax,
      currency_code: cp.currency_code,
    }),
    calculated_price_without_tax_number:
      cp.calculated_amount_without_tax ?? cp.calculated_amount_with_tax,
    original_price_number:
      cp.original_amount_with_tax ?? cp.calculated_amount_with_tax,
    original_price: convertToLocale({
      amount: cp.original_amount_with_tax ?? cp.calculated_amount_with_tax,
      currency_code: cp.currency_code,
    }),
    currency_code: cp.currency_code,
    price_type: priceType,
    percentage_diff: percentageDiff,
  }
}

export function getProductPrice({
  product,
  variantId,
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
}) {
  if (!product || !product.id) {
    return {
      product,
      cheapestPrice: null,
      variantPrice: null,
      cheapestVariant: null,
    }
  }

  const cheapestVariant = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    return product.variants
      .filter((v: any) => v?.calculated_price != null)
      .sort((a: any, b: any) => {
        const amountA =
          a.calculated_price?.calculated_amount_with_tax ??
          a.calculated_price?.calculated_amount ??
          0
        const amountB =
          b.calculated_price?.calculated_amount_with_tax ??
          b.calculated_price?.calculated_amount ??
          0
        return amountA - amountB
      })[0]
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const variant: any = cheapestVariant()

    return getPricesForVariant(variant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v: any) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
    cheapestVariant: cheapestVariant(),
  }
}
