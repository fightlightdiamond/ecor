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
})

export default CardMedia
