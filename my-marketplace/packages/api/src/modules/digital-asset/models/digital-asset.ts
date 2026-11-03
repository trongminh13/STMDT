import { model } from "@medusajs/framework/utils"

export const DigitalAsset = model.define("digital_asset", {
  id: model.id().primaryKey(),
  file_id: model.text(),
  name: model.text(),
  mime_type: model.text().nullable(),
  is_revoked: model.boolean().default(false),
  metadata: model.json().nullable(),
})
