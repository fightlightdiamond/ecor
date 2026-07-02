export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const toDatetimeLocal = (value: string | null) => {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)

  return local.toISOString().slice(0, 16)
}

export const toIsoDateTime = (value: string) => {
  if (!value) {
    return null
  }

  return new Date(value).toISOString()
}
