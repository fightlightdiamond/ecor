import {
  InjectManager,
  MedusaContext,
  MedusaService,
} from "@medusajs/framework/utils"
import type { Context } from "@medusajs/framework/types"
import Card from "./models/card"
import CardMedia from "./models/card-media"
import MediaFolder from "./models/media-folder"

type CardFilters = {
  id?: string | string[]
  type?: string | string[]
  is_active?: boolean
}

class CardModuleService extends MedusaService({
  Card,
  CardMedia,
  MediaFolder,
}) {
  @InjectManager()
  async listActiveCardsOrdered(
    filters: CardFilters = {},
    config: Record<string, unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    return await this.listCards(
      { ...filters, is_active: true },
      { order: { rank: "ASC" }, ...config },
      sharedContext
    )
  }
}

export default CardModuleService
