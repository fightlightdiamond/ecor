import { model } from "@medusajs/framework/utils"

/**
 * Tracks every image uploaded through the Cards admin picker, independent of
 * whether it's currently attached to a card — this is what backs the
 * "previously uploaded images" library in the picker modal.
 */
const CardMedia = model.define("card_media", {
  id: model.id({ prefix: "cdmed" }).primaryKey(),
  url: model.text(),
  filename: model.text().nullable(),
  // Media-library folder (media_folder.id); null = library root. Kept as a
  // plain text column (not a relationship) since folders are flat and
  // deleting a folder just nulls this out.
  folder_id: model.text().nullable(),
})

export default CardMedia
