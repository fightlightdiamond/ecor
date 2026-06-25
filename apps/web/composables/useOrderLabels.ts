export function useOrderLabels() {
  const { t } = useAppI18n()

  const orderStatusLabel = (status: string) =>
    t(`orderStatus.${status}`, status)

  const paymentStatusLabel = (status: string) =>
    t(`paymentStatus.${status}`, status)

  const paymentMethodLabel = (method: string) =>
    t(`paymentMethod.${method}`, method)

  return { orderStatusLabel, paymentStatusLabel, paymentMethodLabel }
}
