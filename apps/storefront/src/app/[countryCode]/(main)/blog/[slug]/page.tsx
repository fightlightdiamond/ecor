import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getArticleBySlug } from "@lib/strapi"
import ArticleBlocksSection from "@modules/blog/components/article-blocks-section"
import { normalizeLandingBlocks } from "@modules/landing/lib/normalize-landing-blocks"

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string; countryCode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug).catch(() => null)

  if (!article) {
    return {
      title: "Bài viết không tồn tại | Thăng Long Chè Việt",
    }
  }

  return {
    title: `${article.title} | Thăng Long Chè Việt`,
    description: article.seoDescription || undefined,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug, countryCode } = await params
  const article = await getArticleBySlug(slug).catch(() => null)

  if (!article) {
    notFound()
  }

  const coverUrl = article.coverUrl
  const absoluteCoverUrl =
    coverUrl && coverUrl.startsWith("http")
      ? coverUrl
      : coverUrl
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverUrl}`
        : null

  const body = typeof article.content === "string" ? article.content : ""
  const blocks = normalizeLandingBlocks(article.blocks)

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="content-container max-w-4xl mx-auto">
        <Link
          href={`/${countryCode}/blog`}
          className="text-sm text-gray-500 hover:text-blue-600 mb-8 inline-block transition-colors"
        >
          &larr; Quay lại danh sách bài viết
        </Link>

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold mb-4 text-gray-900 leading-tight">
            {article.title}
          </h1>
          <div className="text-gray-500 flex items-center justify-center gap-4">
            <span>
              {new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString(
                "vi-VN"
              )}
            </span>
          </div>
        </header>

        {absoluteCoverUrl ? (
          <div className="aspect-[2/1] w-full bg-gray-100 rounded-2xl overflow-hidden mb-12 relative shadow-sm">
            <img
              src={absoluteCoverUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {body ? (
          <div
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : null}

        {blocks.length ? (
          <ArticleBlocksSection blocks={blocks} countryCode={countryCode} />
        ) : null}
      </div>
    </div>
  )
}
