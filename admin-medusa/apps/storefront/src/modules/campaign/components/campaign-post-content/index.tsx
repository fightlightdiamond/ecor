"use client"

import { generateHTML } from "@tiptap/html"
import type { JSONContent } from "@tiptap/core"
import { useMemo } from "react"

import { getCampaignEditorExtensions } from "@lib/tiptap/campaign-editor-extensions"

type LegacyEditorJsContent = {
  blocks?: Array<{
    type: string
    data?: Record<string, unknown>
  }>
}

type CampaignPostContentProps = {
  content: JSONContent | LegacyEditorJsContent | null | undefined
  className?: string
}

const extensions = getCampaignEditorExtensions()

const isTiptapContent = (
  content: JSONContent | LegacyEditorJsContent
): content is JSONContent => {
  return "type" in content && content.type === "doc"
}

const legacyToHtml = (content: LegacyEditorJsContent) => {
  if (!content.blocks?.length) {
    return ""
  }

  return content.blocks
    .map((block) => {
      const data = block.data ?? {}

      switch (block.type) {
        case "header": {
          const level = (data.level as number) ?? 2
          const text = (data.text as string) ?? ""
          return `<h${level}>${text}</h${level}>`
        }
        case "list": {
          const items = (data.items as string[]) ?? []
          const tag = data.style === "ordered" ? "ol" : "ul"
          const listItems = items.map((item) => `<li>${item}</li>`).join("")
          return `<${tag}>${listItems}</${tag}>`
        }
        case "image": {
          const file = data.file as { url?: string } | undefined
          const url = file?.url ?? (data.url as string | undefined)
          return url ? `<img src="${url}" alt="" />` : ""
        }
        case "paragraph":
        default: {
          const text = (data.text as string) ?? ""
          return `<p>${text}</p>`
        }
      }
    })
    .join("")
}

const CampaignPostContent = ({
  content,
  className,
}: CampaignPostContentProps) => {
  const html = useMemo(() => {
    if (!content) {
      return ""
    }

    if (isTiptapContent(content)) {
      if (!content.content?.length) {
        return ""
      }

      return generateHTML(content, extensions)
    }

    return legacyToHtml(content)
  }, [content])

  if (!html) {
    return null
  }

  return (
    <div
      className={`campaign-post-content text-base-regular text-ui-fg-base leading-7 [&_h1]:text-3xl-semi [&_h1]:mt-10 [&_h1]:mb-4 [&_h2]:text-2xl-semi [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl-semi [&_h3]:mt-6 [&_h3]:mb-3 [&_h4]:text-lg-semi [&_h4]:mt-5 [&_h4]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-ui-border-base [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-ui-bg-subtle [&_pre]:p-4 [&_code]:rounded [&_code]:bg-ui-bg-subtle [&_code]:px-1 [&_mark]:rounded [&_mark]:px-0.5 [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-ui-border-base [&_th]:bg-ui-bg-subtle [&_th]:p-2 [&_td]:border [&_td]:border-ui-border-base [&_td]:p-2 [&_img]:my-6 [&_img]:w-full [&_img]:rounded-lg [&_hr]:my-8 [&_hr]:border-ui-border-base ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default CampaignPostContent
