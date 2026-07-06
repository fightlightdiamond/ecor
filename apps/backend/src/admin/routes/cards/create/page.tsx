import { Button, Container, Heading, toast } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import CardForm from "../../../components/card-form"
import { sdk } from "../../../lib/sdk"
import type { CardResponse } from "../../../types/card"

const CreateCardPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [titleVi, setTitleVi] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [image, setImage] = useState("")
  const [path, setPath] = useState("")
  const [isActive, setIsActive] = useState(true)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      sdk.client.fetch("/admin/cards", {
        method: "POST",
        body,
      }),
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const response = (await mutateAsync({
        title: { vi: titleVi, en: titleEn || titleVi },
        image: image || null,
        path: path || null,
        is_active: isActive,
      })) as CardResponse

      toast.success(t("cards.messages.created"))
      navigate(`../${response.card.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("cards.messages.createFailed"))
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">{t("cards.create")}</Heading>
        <Button variant="secondary" onClick={() => navigate("..")}>
          {t("cards.actions.backToList")}
        </Button>
      </div>

      <CardForm
        titleVi={titleVi}
        titleEn={titleEn}
        image={image}
        path={path}
        isActive={isActive}
        isSubmitting={isPending}
        submitLabel={t("cards.actions.create")}
        onTitleViChange={setTitleVi}
        onTitleEnChange={setTitleEn}
        onImageChange={setImage}
        onPathChange={setPath}
        onIsActiveChange={setIsActive}
        onSubmit={handleSubmit}
      />
    </Container>
  )
}

export default CreateCardPage
