import { model } from "@medusajs/framework/utils"

/**
 * A flat (non-nested) folder for organizing the media library. CardMedia rows
 * point at a folder via `folder_id`; rows with folder_id = null live at the
 * library root ("uncategorized").
 */
const MediaFolder = model.define("media_folder", {
  id: model.id({ prefix: "mfold" }).primaryKey(),
  name: model.text(),
})

export default MediaFolder
