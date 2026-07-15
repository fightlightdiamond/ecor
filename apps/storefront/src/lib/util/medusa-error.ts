type MedusaError = {
  response?: {
    data: { message?: string } | string
    status: number
    headers: unknown
  }
  request?: unknown
  message?: string
  status?: number
  statusText?: string
  config?: { url: string; baseURL: string }
}

/**
 * Normalize Medusa JS SDK / axios-style errors into a thrown Error.
 * `@medusajs/js-sdk` uses `FetchError` with `{ message, status, statusText }`
 * (no `response`), which the axios-oriented handler previously mislabeled.
 */
export default function medusaError(error: unknown): never {
  const err = error as MedusaError

  if (err.response) {
    const u = new URL(err.config?.url ?? "", err.config?.baseURL ?? "")
    console.error("Resource:", u.toString())
    console.error("Response data:", err.response.data)
    console.error("Status code:", err.response.status)

    const data = err.response.data
    const message =
      typeof data === "object" && data !== null
        ? data.message || String(data)
        : data

    throw new Error(message.charAt(0).toUpperCase() + message.slice(1) + ".")
  }

  // FetchError from @medusajs/js-sdk
  if (typeof err.status === "number") {
    const message = err.message || err.statusText || `HTTP ${err.status}`
    console.error("Medusa FetchError:", err.status, message)
    throw new Error(
      message.charAt(0).toUpperCase() +
        message.slice(1) +
        (message.endsWith(".") ? "" : ".")
    )
  }

  if (err.request) {
    throw new Error("No response received: " + String(err.request))
  }

  throw new Error(
    "Error setting up the request: " + (err.message || "unknown error")
  )
}
