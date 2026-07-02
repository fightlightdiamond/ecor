import type { CampaignPost } from "@lib/data/campaign-posts"
import CampaignPostContent from "@modules/campaign/components/campaign-post-content"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CampaignPostDetailTemplateProps = {
  post: CampaignPost
}

const formatDate = (value: string | null) => {
  if (!value) {
    return null
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function CampaignPostDetailTemplate({
  post,
}: CampaignPostDetailTemplateProps) {
  return (
    <article className="content-container py-12 max-w-3xl">
      <LocalizedClientLink
        href="/campaign-posts"
        className="text-small-regular text-ui-fg-interactive hover:underline"
      >
        ← Back to articles
      </LocalizedClientLink>

      <header className="mt-6 mb-10">
        <h1 className="text-3xl-semi">{post.title}</h1>
        {post.publish_at && (
          <p className="text-small-regular text-ui-fg-subtle mt-3">
            {formatDate(post.publish_at)}
          </p>
        )}
      </header>

      <CampaignPostContent
        content={post.content}
        className="campaign-post-content"
      />
    </article>
  )
}
