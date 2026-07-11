import { Metadata } from "next"
import Link from "next/link"
import { getArticles } from "@lib/strapi"

export const metadata: Metadata = {
  title: "Blog | Thăng Long Chè Việt",
  description: "Khám phá các bài viết về văn hóa trà Việt, bí quyết pha trà và kiến thức chuyên sâu.",
}

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export default async function BlogPage() {
  // Fetch articles from Strapi
  const response = await getArticles().catch(() => null)
  const articles = response?.data || []

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="content-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4 text-gray-900">
            Văn hóa Trà Việt
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Góc chia sẻ những câu chuyện về trà, nghệ thuật thưởng trà và những kiến thức bổ ích.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Hiện tại chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => {
              // Strapi 5 returns flat objects, not nested under attributes
              const coverUrl = article.coverUrl || article.cover?.url;
              const absoluteCoverUrl = coverUrl && coverUrl.startsWith('http') 
                ? coverUrl 
                : (coverUrl ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${coverUrl}` : null);

              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col"
                >
                  <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden relative">
                    {absoluteCoverUrl ? (
                      <img
                        src={absoluteCoverUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4 text-sm flex-1">
                      {article.seoDescription || 'Đọc thêm để biết chi tiết...'}
                    </p>
                    <div className="text-sm text-gray-400 font-medium pt-4 border-t border-gray-50">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
