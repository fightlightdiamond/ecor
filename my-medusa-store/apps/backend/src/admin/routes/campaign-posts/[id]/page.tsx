import {
  Button,
  Container,
  Heading,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import type { JSONContent } from "@tiptap/core"
import { EMPTY_TIPTAP_DOC } from "../../../components/tiptap-editor/extensions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
  LoaderFunctionArgs,
  UIMatch,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom"
import { useTranslation } from "react-i18next"
import CampaignPostForm from "../../../components/campaign-post-form"
import { toDatetimeLocal, toIsoDateTime } from "../../../lib/campaign-post"
import { sdk } from "../../../lib/sdk"
import type {
  CampaignPost,
  CampaignPostResponse,
} from "../../../types/campaign-post"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params

  const data = await sdk.client.fetch<CampaignPostResponse>(
    `/admin/campaign-posts/${id}`
  )

  return {
    campaign_post: data.campaign_post,
  }
}

export const handle = {
  breadcrumb: (match: UIMatch<{ campaign_post: CampaignPost }>) => {
    return match.data?.campaign_post?.title ?? "Edit post"
  },
}

const EditCampaignPostPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const prompt = usePrompt()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { campaign_post } = useLoaderData() as Awaited<ReturnType<typeof loader>>

  const [title, setTitle] = useState(campaign_post.title)
  const [slug, setSlug] = useState(campaign_post.slug)
  const [isActive, setIsActive] = useState(campaign_post.is_active)
  const [publishAt, setPublishAt] = useState(
    toDatetimeLocal(campaign_post.publish_at)
  )
  const [unpublishAt, setUnpublishAt] = useState(
    toDatetimeLocal(campaign_post.unpublish_at)
  )
  const [content, setContent] = useState<JSONContent | null>(
    campaign_post.content
  )

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      sdk.client.fetch(`/admin/campaign-posts/${id}`, {
        method: "PATCH",
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-posts"] })
    },
  })

  const { mutateAsync: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      sdk.client.fetch(`/admin/campaign-posts/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign-posts"] })
      toast.success(t("campaign-posts.messages.deleted"))
      navigate("..")
    },
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      await mutateAsync({
        title,
        slug,
        content: content || EMPTY_TIPTAP_DOC,
        is_active: isActive,
        publish_at: toIsoDateTime(publishAt),
        unpublish_at: toIsoDateTime(unpublishAt),
      })

      toast.success(t("campaign-posts.messages.updated"))
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("campaign-posts.messages.updateFailed")
      )
    }
  }

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: t("campaign-posts.messages.deleteConfirmTitle"),
      description: t("campaign-posts.messages.deleteConfirmDesc", { title }),
      confirmText: t("campaign-posts.messages.confirmDelete"),
      cancelText: t("campaign-posts.messages.cancelDelete"),
    })

    if (!confirmed) {
      return
    }

    try {
      await deletePost()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("campaign-posts.messages.deleteFailed")
      )
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">{t("campaign-posts.edit")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {title}
          </Text>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
            {t("campaign-posts.actions.delete")}
          </Button>
          <Button variant="secondary" onClick={() => navigate("..")}>
            {t("campaign-posts.actions.backToList")}
          </Button>
        </div>
      </div>

      <CampaignPostForm
        title={title}
        slug={slug}
        isActive={isActive}
        publishAt={publishAt}
        unpublishAt={unpublishAt}
        content={content}
        isSubmitting={isPending}
        submitLabel={t("campaign-posts.actions.save")}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
        onIsActiveChange={setIsActive}
        onPublishAtChange={setPublishAt}
        onUnpublishAtChange={setUnpublishAt}
        onContentChange={setContent}
        onSubmit={handleSubmit}
        editorKey={id}
      />
    </Container>
  )
}

export default EditCampaignPostPage
