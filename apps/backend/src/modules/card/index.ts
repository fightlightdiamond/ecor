import CardModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const CARD_MODULE = "card"

export default Module(CARD_MODULE, {
  service: CardModuleService,
})
