import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DotsSix, GridLayout } from "@medusajs/icons"
import { Badge, Button, Container, Heading, Switch, Text, Tooltip, toast } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cardTitle } from "../../lib/card"
import { sdk } from "../../lib/sdk"
import type { Card, CardsResponse } from "../../types/card"

type RowProps = {
  card: Card
  onNavigate: (id: string) => void
  onToggleActive: (card: Card) => void
  togglingId: string | null
}

const CardRow = ({ card, onNavigate, onToggleActive, togglingId }: RowProps) => {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 1 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-x-4 px-6 py-3 hover:bg-ui-bg-subtle-hover bg-ui-bg-base"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing text-ui-fg-muted touch-none"
        aria-label={t("cards.actions.drag")}
        {...attributes}
        {...listeners}
      >
        <DotsSix />
      </button>

      <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded bg-ui-bg-subtle flex items-center justify-center">
        {card.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none"
            }}
          />
        ) : (
          <Text size="xsmall" className="text-ui-fg-muted text-center px-1">
            {t(`cards.type.${card.type}`)}
          </Text>
        )}
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onNavigate(card.id)}>
        <Text size="small" weight="plus" className="truncate">
          {cardTitle(card, t)}
        </Text>
        {card.path && (
          <Text size="xsmall" className="text-ui-fg-subtle truncate">
            {card.path}
          </Text>
        )}
      </div>

      <Badge size="2xsmall" color="blue">
        {t(`cards.type.${card.type}`)}
      </Badge>

      {card.locked && (
        <Tooltip content={t("cards.lockedNotice")}>
          <Badge size="2xsmall" color="orange">
            🔒
          </Badge>
        </Tooltip>
      )}

      <div className="flex items-center gap-x-2 pl-2 border-l border-ui-border-base">
        <Switch
          checked={card.is_active}
          disabled={togglingId === card.id}
          onCheckedChange={() => onToggleActive(card)}
          onClick={(e) => e.stopPropagation()}
        />
        <Text size="xsmall" className="text-ui-fg-subtle whitespace-nowrap">
          {card.is_active ? t("cards.status.active") : t("cards.status.inactive")}
        </Text>
      </div>
    </div>
  )
}

const CardsPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<CardsResponse>({
    queryFn: () => sdk.client.fetch(`/admin/cards`),
    queryKey: [["cards"]],
  })

  // Local, immediately-rendered order — synced from the query, then updated
  // in place on drag/toggle so the UI never waits on a refetch round-trip.
  const [items, setItems] = useState<Card[]>([])
  useEffect(() => {
    if (data?.cards) setItems(data.cards)
  }, [data])

  const { mutate: reorder } = useMutation({
    mutationFn: (payload: { id: string, rank: number }[]) =>
      sdk.client.fetch("/admin/cards/reorder", { method: "POST", body: { items: payload } }),
    onSuccess: (response: CardsResponse) => {
      queryClient.setQueryData([["cards"]], { cards: response.cards, count: response.cards.length })
    },
    onError: () => {
      toast.error(t("cards.messages.reorderFailed"))
      queryClient.invalidateQueries({ queryKey: [["cards"]] })
    },
  })

  const [togglingId, setTogglingId] = useState<string | null>(null)
  const { mutate: toggleActive } = useMutation({
    mutationFn: (card: Card) =>
      sdk.client.fetch(`/admin/cards/${card.id}`, {
        method: "PATCH",
        body: { is_active: !card.is_active },
      }),
    onSettled: () => setTogglingId(null),
    onError: (_err, card) => {
      toast.error(t("cards.messages.updateFailed"))
      setItems((prev) => prev.map((c) => (c.id === card.id ? { ...c, is_active: card.is_active } : c)))
    },
  })

  const handleToggleActive = (card: Card) => {
    setTogglingId(card.id)
    setItems((prev) => prev.map((c) => (c.id === card.id ? { ...c, is_active: !c.is_active } : c)))
    toggleActive(card)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((c) => c.id === active.id)
    const newIndex = items.findIndex((c) => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next) // instant visual reorder
    reorder(next.map((c, i) => ({ id: c.id, rank: i })))
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col gap-y-1 px-6 py-4">
        <div className="flex items-center justify-between">
          <Heading>{t("cards.title")}</Heading>
          <Button size="small" variant="secondary" onClick={() => navigate("create")}>
            {t("cards.create")}
          </Button>
        </div>
        <Text className="text-ui-fg-subtle" size="small">
          {t("cards.hint")}
        </Text>
      </div>

      <div className="flex flex-col divide-y divide-ui-border-base">
        {isLoading && (
          <div className="px-6 py-4">
            <Text size="small">…</Text>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {items.map((card) => (
              <CardRow
                key={card.id}
                card={card}
                onNavigate={navigate}
                onToggleActive={handleToggleActive}
                togglingId={togglingId}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Cards",
  icon: GridLayout,
})

export default CardsPage
