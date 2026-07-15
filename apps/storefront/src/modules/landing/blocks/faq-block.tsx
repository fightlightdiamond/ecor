import { Heading, Text } from "@modules/common/components/ui"
import Accordion from "@modules/products/components/product-tabs/accordion"
import type { FaqBlock } from "@types/strapi-blocks"

type FaqBlockProps = {
  block: FaqBlock
}

export default function FaqBlock({ block }: FaqBlockProps) {
  const questions = block.questions ?? []

  if (questions.length === 0) {
    return null
  }

  return (
    <section className="content-container py-12 small:py-16 max-w-3xl">
      {block.title ? (
        <Heading level="h2" className="text-2xl sm:text-3xl mb-8">
          {block.title}
        </Heading>
      ) : null}

      <Accordion type="single" collapsible>
        {questions.map((item, index) => (
          <Accordion.Item
            key={item.id ?? index}
            value={`faq-${item.id ?? index}`}
            title={item.question}
            headingSize="medium"
          >
            <div
              className="prose prose-neutral max-w-none text-ui-fg-subtle py-2"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  )
}
