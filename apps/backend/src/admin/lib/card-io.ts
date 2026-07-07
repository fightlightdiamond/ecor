import type { Card } from "../types/card"

export interface ImportRow {
  id?: string
  title_vi?: string
  title_en?: string
  image?: string | null
  path?: string | null
  is_active?: boolean
}

const EXPORT_COLUMNS = ["id", "type", "title_vi", "title_en", "image", "path", "rank", "is_active", "locked"] as const

function cardToRecord(card: Card): Record<(typeof EXPORT_COLUMNS)[number], string> {
  return {
    id: card.id,
    type: card.type,
    title_vi: card.title?.vi ?? "",
    title_en: card.title?.en ?? "",
    image: card.image ?? "",
    path: card.path ?? "",
    rank: String(card.rank),
    is_active: String(card.is_active),
    locked: String(card.locked),
  }
}

export function cardsToJson(cards: Card[]): string {
  return JSON.stringify(cards.map(cardToRecord), null, 2)
}

function escapeDelimited(value: string, delimiter: string): string {
  if (value.includes(delimiter) || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function cardsToDelimited(cards: Card[], delimiter: string): string {
  const lines = [EXPORT_COLUMNS.join(delimiter)]
  for (const card of cards) {
    const record = cardToRecord(card)
    lines.push(EXPORT_COLUMNS.map((col) => escapeDelimited(record[col], delimiter)).join(delimiter))
  }
  return lines.join("\n")
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Minimal RFC4180-ish line splitter: handles quoted fields with "" escaping. */
function splitDelimitedLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      result.push(current)
      current = ""
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

function parseBoolCell(value: string | undefined): boolean | undefined {
  if (value === undefined || value === "") return undefined
  return /^(true|1|yes|có|x)$/i.test(value.trim())
}

export function parseDelimited(text: string, delimiter: string): ImportRow[] {
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0)
  if (!lines.length) return []

  const headers = splitDelimitedLine(lines[0], delimiter).map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const cells = splitDelimitedLine(line, delimiter)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = (cells[i] ?? "").trim() })

    return {
      id: row.id || undefined,
      title_vi: row.title_vi || undefined,
      title_en: row.title_en || undefined,
      image: row.image || undefined,
      path: row.path || undefined,
      is_active: parseBoolCell(row.is_active),
    }
  })
}

export function parseJsonImport(text: string): ImportRow[] {
  const data = JSON.parse(text)
  if (!Array.isArray(data)) {
    throw new Error("JSON phải là một mảng (array) các card")
  }
  return data.map((row: Record<string, unknown>) => ({
    id: typeof row.id === "string" ? row.id : undefined,
    title_vi: typeof row.title_vi === "string" ? row.title_vi
      : typeof (row.title as any)?.vi === "string" ? (row.title as any).vi : undefined,
    title_en: typeof row.title_en === "string" ? row.title_en
      : typeof (row.title as any)?.en === "string" ? (row.title as any).en : undefined,
    image: typeof row.image === "string" ? row.image : undefined,
    path: typeof row.path === "string" ? row.path : undefined,
    is_active: typeof row.is_active === "boolean" ? row.is_active : undefined,
  }))
}

/** Detects format from the file extension: .json / .csv / anything else (.txt) = TSV. */
export async function parseImportFile(file: File): Promise<ImportRow[]> {
  const text = await file.text()
  const name = file.name.toLowerCase()

  if (name.endsWith(".json")) return parseJsonImport(text)
  if (name.endsWith(".csv")) return parseDelimited(text, ",")
  return parseDelimited(text, "\t")
}
