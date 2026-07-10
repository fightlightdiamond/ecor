import {
  Button,
  Heading,
  Text,
  toast,
} from "@medusajs/ui"
import type { JSONContent } from "@tiptap/core"
import { EMPTY_TIPTAP_DOC } from "../../../components/tiptap-editor/extensions"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import EventForm from "../../../components/event-form"
import PageLayout from "../../../components/page-layout"
import { slugify, toIsoDateTime } from "../../../lib/campaign-post"
import { sdk } from "../../../lib/sdk"
import type { EventResponse } from "../../../types/event"

const CreateEventPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [location, setLocation] = useState("")
  const [startAt, setStartAt] = useState("")
  const [endAt, setEndAt] = useState("")
  const [capacity, setCapacity] = useState("")
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [isActive, setIsActive] = useState(true)
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [seoKeywords, setSeoKeywords] = useState("")
  const [content, setContent] = useState<JSONContent | null>(null)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      sdk.client.fetch("/admin/events", {
        method: "POST",
        body,
      }),
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = await mutateAsync({
        title,
        slug: slug || slugify(title),
        content: content || EMPTY_TIPTAP_DOC,
        thumbnail: thumbnail || null,
        location: location || null,
        start_at: toIsoDateTime(startAt),
        end_at: toIsoDateTime(endAt),
        capacity: capacity ? Number(capacity) : null,
        registration_open: registrationOpen,
        is_active: isActive,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        seo_keywords: seoKeywords || null,
      }) as EventResponse

      toast.success(t("events.messages.created"))
      navigate(`../${response.event.id}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("events.messages.createFailed")
      )
    }
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">{t("events.create")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("events.hint")}
          </Text>
        </div>
        <Button variant="secondary" onClick={() => navigate("..")}>
          {t("events.actions.backToList")}
        </Button>
      </div>

      <EventForm
        title={title}
        slug={slug}
        thumbnail={thumbnail}
        location={location}
        startAt={startAt}
        endAt={endAt}
        capacity={capacity}
        registrationOpen={registrationOpen}
        isActive={isActive}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        seoKeywords={seoKeywords}
        content={content}
        isSubmitting={isPending}
        submitLabel={t("events.actions.create")}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
        onThumbnailChange={setThumbnail}
        onLocationChange={setLocation}
        onStartAtChange={setStartAt}
        onEndAtChange={setEndAt}
        onCapacityChange={setCapacity}
        onRegistrationOpenChange={setRegistrationOpen}
        onIsActiveChange={setIsActive}
        onSeoTitleChange={setSeoTitle}
        onSeoDescriptionChange={setSeoDescription}
        onSeoKeywordsChange={setSeoKeywords}
        onContentChange={setContent}
        onSubmit={handleSubmit}
        editorKey="create"
      />
    </PageLayout>
  )
}

export default CreateEventPage
