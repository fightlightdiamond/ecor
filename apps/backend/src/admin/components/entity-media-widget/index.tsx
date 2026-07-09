import { Container, Heading, Text, toast } from "@medusajs/ui"
import { useState } from "react"
import ImagePicker from "../image-picker"

type EntityMediaWidgetProps = {
  title: string
  hint: string
  value: string
  onSave: (url: string) => Promise<void>
  savedMessage: string
  errorMessage: string
}

/**
 * Thumbnail picker for core Medusa entities (categories, collections) that
 * have no native image field — persists to `metadata.thumbnail` via the
 * caller's `onSave`, sourced from the same media library as every other
 * ImagePicker in this codebase.
 */
const EntityMediaWidget = ({
  title,
  hint,
  value,
  onSave,
  savedMessage,
  errorMessage,
}: EntityMediaWidgetProps) => {
  const [current, setCurrent] = useState(value)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = async (url: string) => {
    setIsSaving(true)
    try {
      await onSave(url)
      setCurrent(url)
      toast.success(savedMessage)
    } catch {
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{title}</Heading>
      </div>
      <div className="flex flex-col gap-y-2 px-6 py-4">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {hint}
        </Text>
        <ImagePicker value={current} onChange={handleChange} />
        {isSaving && (
          <Text size="xsmall" leading="compact" className="text-ui-fg-muted">
            …
          </Text>
        )}
      </div>
    </Container>
  )
}

export default EntityMediaWidget
