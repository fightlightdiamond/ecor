import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getArticleBySlug } from "@lib/strapi"

export const revalidate = 60 // ISR

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const response = await getArticleBySlug(params.slug).catch(() => null)
  const article = response?.data?.[0]

  if (!article) {
    return {
      title: "Bài viết không tồn tại | Thăng Long Chè Việt",
    }
  }

  return {
    title: `${article.title} | Thăng Long Chè Việt`,
    description: article.description,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = params
  
  // Fetch article from Strapi
  const response = await getArticleBySlug(slug).catch(() => null)
  const article = response?.data?.[0]

  if (!article) {
    notFound()
  }

  const coverUrl = article.coverUrl || article.cover?.url;
  const absoluteCoverUrl = coverUrl && coverUrl.startsWith('http') 
    ? coverUrl 
    : (coverUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverUrl}` : null);

  // In Strapi 5, rich text is often an array of blocks, but if it's markdown/string, render it.
  const content = typeof article.content === 'string' 
    ? article.content 
    : JSON.stringify(article.content, null, 2); // Simple fallback for block format

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="content-container max-w-4xl mx-auto">
        <Link 
          href="/blog"
          className="text-sm text-gray-500 hover:text-blue-600 mb-8 inline-block transition-colors"
        >
          &larr; Quay lại danh sách bài viết
        </Link>
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-semibold mb-4 text-gray-900 leading-tight">
            {article.title}
          </h1>
          <div className="text-gray-500 flex items-center justify-center gap-4">
            <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </header>

        {absoluteCoverUrl && (
          <div className="aspect-[2/1] w-full bg-gray-100 rounded-2xl overflow-hidden mb-12 relative shadow-sm">
            <img
              src={absoluteCoverUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700">
              )
            }
            if (block.type === 'paragraph') {
               // simplified block handling for Strapi 5 rich text blocks
               return <p key={idx}>{block.children?.[0]?.text}</p>
            }
            return null
          })}
        </div>
      </div>
    </article>
  )
}
