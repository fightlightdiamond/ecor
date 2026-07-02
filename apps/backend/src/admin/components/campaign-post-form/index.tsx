import {
  Button,
  Input,
  Label,
  Switch,
} from "@medusajs/ui"
import type { JSONContent } from "@tiptap/core"
import TiptapEditor from "../tiptap-editor"
import { slugify } from "../../lib/campaign-post"

type CampaignPostFormProps = {
  title: string
  slug: string
  isActive: boolean
  publishAt: string
  unpublishAt: string
  content: JSONContent | null
  editorKey?: string
  isSubmitting?: boolean
  submitLabel: string
  onTitleChange: (value: string) => void
  onSlugChange: (value: string) => void
  onIsActiveChange: (value: boolean) => void
  onPublishAtChange: (value: string) => void
  onUnpublishAtChange: (value: string) => void
  onContentChange: (value: JSONContent) => void
  onSubmit: (event: React.FormEvent) => void
}

const CampaignPostForm = ({
  title,
  slug,
  isActive,
  publishAt,
  unpublishAt,
  content,
  editorKey,
  isSubmitting = false,
  submitLabel,
  onTitleChange,
  onSlugChange,
  onIsActiveChange,
  onPublishAtChange,
  onUnpublishAtChange,
  onContentChange,
  onSubmit,
}: CampaignPostFormProps) => {
  return (
    <form className="flex flex-col gap-6 px-6 py-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          required={!!slug}
          placeholder={slugify(title) || "auto-generated-from-title"}
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="publish_at">Publish at</Label>
          <Input
            id="publish_at"
            type="datetime-local"
            value={publishAt}
            onChange={(e) => onPublishAtChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="unpublish_at">Unpublish at</Label>
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
        <Label>Active</Label>
      </div>

      <div className="flex flex-col gap-y-2 overflow-visible">
        <Label>Content</Label>
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
