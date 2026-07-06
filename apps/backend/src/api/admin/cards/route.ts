import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { CARD_MODULE } from "../../../modules/card"
import type CardModuleService from "../../../modules/card/service"

const CreateCardSchema = z.object({
  title: z.record(z.string(), z.string()).default({}),
  image: z.string().nullable().optional(),
  path: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cardModuleService: CardModuleService = req.scope.resolve(CARD_MODULE)

  const [cards, count] = await cardModuleService.listAndCountCards(
    {},
    { order: { rank: "ASC" } }
  )

  res.json({ cards, count })
}

/**
 * POST /admin/cards
 *
 * Always creates a plain type="link" card, never locked — the 3 special
 * widget-backed cards (contact/map/promotions) are seeded once and can't be
 * recreated through this endpoint.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const cardModuleService: CardModuleService = req.scope.resolve(CARD_MODULE)

  const body = CreateCardSchema.parse(req.body)

  const [lastCard] = await cardModuleService.listCards(
    {},
    { order: { rank: "DESC" }, take: 1 }
  )
  const highestRank = lastCard?.rank ?? -1

  const card = await cardModuleService.createCards({
    type: "link",
    title: body.title,
    image: body.image ?? null,
    path: body.path ?? null,
    is_active: body.is_active,
    locked: false,
    rank: highestRank + 1,
  })

  res.status(201).json({ card })
}
