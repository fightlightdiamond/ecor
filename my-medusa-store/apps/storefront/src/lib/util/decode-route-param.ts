/** Decode dynamic route params; Next may leave percent-encoding in [handle] for non-ASCII paths. */
export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value).normalize("NFC")
  } catch {
    return value.normalize("NFC")
  }
}
