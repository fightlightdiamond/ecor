import { clx } from "@modules/common/components/ui"
import type { RichTextBlock } from "@types/strapi-blocks"

type RichTextBlockProps = {
  block: RichTextBlock
}

export default function RichTextBlock({ block }: RichTextBlockProps) {
  if (!block.content?.trim()) {
    return null
  }

  const isFull = block.container_width === "Full"

  return (
    <section className={clx("py-8 sm:py-12", isFull ? "px-0" : "content-container")}>
      <div
        className={clx(
          "prose prose-neutral max-w-none",
          isFull ? "px-4 sm:px-8" : "mx-auto max-w-3xl px-4"
        )}
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </section>
  )
}
