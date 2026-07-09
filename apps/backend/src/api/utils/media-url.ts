/**
 * Our own uploads are always served from /static regardless of domain/port,
 * so stripping everything before that segment gives a host-independent path
 * that survives a MEDUSA_BACKEND_URL/DOMAIN change untouched. Anything else
 * (a pasted external URL, e.g. Unsplash, or a bare bundled-asset filename)
 * has no "/static/" segment and is left exactly as given.
 */
export function toRelativeMediaUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null
  const marker = "/static/"
  const idx = url.indexOf(marker)
  return idx === -1 ? url : url.slice(idx)
}

type TiptapNode = {
  type?: string
  attrs?: Record<string, unknown>
  content?: TiptapNode[]
}

/**
 * Walks a TipTap JSON document and rewrites every image node's `src` with
 * toRelativeMediaUrl, in place. Used on write so campaign post content never
 * bakes in the domain the editor happened to be uploaded through.
 */
export function normalizeTiptapImageUrls(
  doc: Record<string, unknown>
): Record<string, unknown> {
  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return
    const n = node as TiptapNode
    if (n.type === "image" && n.attrs && typeof n.attrs.src === "string") {
      n.attrs.src = toRelativeMediaUrl(n.attrs.src)
    }
    n.content?.forEach(walk)
  }
  walk(doc)
  return doc
}
