import {
  Button,
  Input,
  Label,
  Select,
  Switch,
} from "@medusajs/ui"
import type { JSONContent } from "@tiptap/core"
import { useQuery } from "@tanstack/react-query"
import TiptapEditor from "../tiptap-editor"
import ImagePicker from "../image-picker"
import { slugify } from "../../lib/campaign-post"
import { sdk } from "../../lib/sdk"
import { useTranslation } from "react-i18next"
import type { CampaignTopicsResponse } from "../../types/campaign-topic"

const NO_TOPIC = "__none__"

type CampaignPostFormProps = {
  title: string
  slug: string
  thumbnail: string
  topicId: string
  isActive: boolean
  publishAt: string
  unpublishAt: string
  content: JSONContent | null
  editorKey?: string
  isSubmitting?: boolean
  submitLabel: string
  onTitleChange: (value: string) => void
  onSlugChange: (value: string) => void
  onThumbnailChange: (value: string) => void
  onTopicIdChange: (value: string) => void
  onIsActiveChange: (value: boolean) => void
  onPublishAtChange: (value: string) => void
  onUnpublishAtChange: (value: string) => void
  onContentChange: (value: JSONContent) => void
  onSubmit: (event: React.FormEvent) => void
}

const CampaignPostForm = ({
  title,
  slug,
  thumbnail,
  topicId,
  isActive,
  publishAt,
  unpublishAt,
  content,
  editorKey,
  isSubmitting = false,
  submitLabel,
  onTitleChange,
  onSlugChange,
  onThumbnailChange,
  onTopicIdChange,
  onIsActiveChange,
  onPublishAtChange,
  onUnpublishAtChange,
  onContentChange,
  onSubmit,
}: CampaignPostFormProps) => {
  const { t } = useTranslation()

  const { data: topicsData } = useQuery<CampaignTopicsResponse>({
    queryFn: () =>
      sdk.client.fetch("/admin/campaign-topics", {
        query: { limit: 100 },
      }),
    queryKey: [["campaign-topics", "select-options"]],
  })

  const topics = topicsData?.campaign_topics ?? []

  return (
    <form className="flex flex-col gap-6 px-6 py-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="title">{t("campaign-posts.fields.title")}</Label>
        <Input
          id="title"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="slug">{t("campaign-posts.fields.slug")}</Label>
        <Input
          id="slug"
          required={!!slug}
          placeholder={slugify(title) || t("campaign-posts.fields.slugPlaceholder")}
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{t("campaign-posts.fields.topic")}</Label>
        <Select
          value={topicId || NO_TOPIC}
          onValueChange={(value) =>
            onTopicIdChange(value === NO_TOPIC ? "" : value)
          }
        >
          <Select.Trigger>
            <Select.Value placeholder={t("campaign-posts.fields.topicPlaceholder")} />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={NO_TOPIC}>
              {t("campaign-posts.fields.noTopic")}
            </Select.Item>
            {topics.map((topic) => (
              <Select.Item key={topic.id} value={topic.id}>
                {topic.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      <div className="flex flex-col gap-y-2">
        <Label>{t("campaign-posts.fields.thumbnail")}</Label>
        <ImagePicker value={thumbnail} onChange={onThumbnailChange} />
        <span className="text-ui-fg-subtle text-xs">
          {t("campaign-posts.fields.thumbnailHint")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="publish_at">{t("campaign-posts.fields.publishAt")}</Label>
          <Input
            id="publish_at"
            type="datetime-local"
            value={publishAt}
            onChange={(e) => onPublishAtChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="unpublish_at">{t("campaign-posts.fields.unpublishAt")}</Label>
          <Input
            id="unpublish_at"
            type="datetime-local"
            value={unpublishAt}
            onChange={(e) => onUnpublishAtChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <Switch checked={isActive} onCheckedChange={onIsActiveChange} />
        <Label>{t("campaign-posts.fields.active")}</Label>
      </div>

      <div className="flex flex-col gap-y-2 overflow-visible">
        <Label>{t("campaign-posts.fields.content")}</Label>
        <TiptapEditor
          editorKey={editorKey}
          value={content}
          onChange={onContentChange}
        />
      </div>

      <div className="flex justify-end">
        <Button isLoading={isSubmitting} type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default CampaignPostForm
