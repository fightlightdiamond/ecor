import {
  Button,
  Container,
  Heading,
  Text,
  toast,
} from "@medusajs/ui"
import type { JSONContent } from "@tiptap/core"
import { EMPTY_TIPTAP_DOC } from "../../../components/tiptap-editor/extensions"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CampaignPostForm from "../../../components/campaign-post-form"
import { slugify, toIsoDateTime } from "../../../lib/campaign-post"
import { sdk } from "../../../lib/sdk"
import type { CampaignPostResponse } from "../../../types/campaign-post"

const CreateCampaignPostPage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [publishAt, setPublishAt] = useState("")
  const [unpublishAt, setUnpublishAt] = useState("")
  const [content, setContent] = useState<JSONContent | null>(null)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      sdk.client.fetch("/admin/campaign-posts", {
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
        is_active: isActive,
        publish_at: toIsoDateTime(publishAt),
        unpublish_at: toIsoDateTime(unpublishAt),
      }) as CampaignPostResponse

      toast.success("Campaign post created")
      navigate(`../${response.campaign_post.id}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post"
      )
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Create Campaign Post</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Schedule publish and unpublish times for auto-publish
          </Text>
        </div>
        <Button variant="secondary" onClick={() => navigate("..")}>
          Back to list
        </Button>
      </div>

      <CampaignPostForm
        title={title}
        slug={slug}
        isActive={isActive}
        publishAt={publishAt}
        unpublishAt={unpublishAt}
        content={content}
        isSubmitting={isPending}
        submitLabel="Create post"
        onTitleChange={setTitle}
        onSlugChange={setSlug}
        onIsActiveChange={setIsActive}
        onPublishAtChange={setPublishAt}
        onUnpublishAtChange={setUnpublishAt}
        onContentChange={setContent}
        onSubmit={handleSubmit}
        editorKey="create"
      />
    </Container>
  )
}

export default CreateCampaignPostPage
