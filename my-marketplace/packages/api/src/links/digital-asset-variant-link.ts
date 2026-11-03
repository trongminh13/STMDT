import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import DigitalAssetModule from "../modules/digital-asset"

export default defineLink(
  DigitalAssetModule.linkable.digitalAsset,
  ProductModule.linkable.productVariant
)
