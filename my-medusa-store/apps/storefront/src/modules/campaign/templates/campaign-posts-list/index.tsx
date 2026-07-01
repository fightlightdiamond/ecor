import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { CampaignPost } from "@lib/data/campaign-posts"

type CampaignPostsListTemplateProps = {
  posts: CampaignPost[]
  count: number
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

export default function CampaignPostsListTemplate({
  posts,
  count,
}: CampaignPostsListTemplateProps) {
  return (
    <div className="content-container py-12">
      <div className="mb-10">
        <h1 className="text-3xl-semi">Articles</h1>
        <p className="text-ui-fg-subtle mt-2">
          {count} published {count === 1 ? "article" : "articles"}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-ui-fg-subtle">No articles published yet.</p>
      ) : (
        <ul className="flex flex-col gap-y-8">
          {posts.map((post) => (
            <li
              key={post.id}
              className="border-b border-ui-border-base pb-8 last:border-b-0"
            >
              <LocalizedClientLink
                href={`/campaign-posts/${post.slug}`}
                className="group"
              >
                <h2 className="text-2xl-semi group-hover:text-ui-fg-interactive transition-colors">
                  {post.title}
                </h2>
              </LocalizedClientLink>
              {post.publish_at && (
                <p className="text-small-regular text-ui-fg-subtle mt-2">
                  {formatDate(post.publish_at)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
