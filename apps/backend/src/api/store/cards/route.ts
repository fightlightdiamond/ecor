import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARD_MODULE } from "../../../modules/card"
import type CardModuleService from "../../../modules/card/service"

/**
 * GET /store/cards
 *
 * Homepage pillar/card list, active only, ordered for display.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cardModuleService: CardModuleService = req.scope.resolve(CARD_MODULE)

  const cards = await cardModuleService.listActiveCardsOrdered()

  res.json({ cards })
}
