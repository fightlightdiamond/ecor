export type MediaItem = {
  id: string
  url: string
  filename: string | null
  folder_id: string | null
  created_at?: string
}

export type MediaFolderItem = {
  id: string
  name: string
}

export type UsageEntry = {
  kind: "card" | "campaign_post"
  id: string
  label: string
}
