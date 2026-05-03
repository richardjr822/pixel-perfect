export type FilterId =
  | 'none'
  | 'bw'
  | 'traditional'
  | 'sepia'
  | 'vintage'
  | 'soft'
  | 'noir'
  | 'vivid'

export type LayoutId = 'S' | 'A' | 'B' | 'C' | 'D' | 'T'

export interface LayoutConfig {
  id: LayoutId
  label: string
  subtitle: string
  count: number
  columns: number
  single: boolean
  traditional: boolean
  price: number
  enabled: boolean
}

export interface CapturedShot {
  dataUrl: string
  filter: FilterId
  pose: number
}

export interface Session {
  id: string
  layout_id: LayoutId
  filter: FilterId
  photo_urls: string[]
  strip_url: string | null
  price: number
  status: 'completed' | 'abandoned'
  email: string | null
  created_at: string
}

export interface AdminStats {
  sessions_today: number
  revenue_today: number
  photos_shared: number
  uptime_percent: number
}

export interface BrandingConfig {
  marquee_text: string
  tagline: string
  logo_url: string | null
}

export interface SettingsRow {
  id: number
  layouts_config: Record<LayoutId, { enabled: boolean; price: number }>
  branding_config: BrandingConfig
  default_countdown: 3 | 5 | 10
  default_filter: FilterId
  auto_share: boolean
}

export type AppMode = 'user' | 'admin'
export type UserScreen = 'attract' | 'welcome' | 'chooseLayout' | 'camera' | 'strip'
export type AdminSection =
  | 'dashboard'
  | 'sessions'
  | 'layouts'
  | 'branding'
  | 'pricing'
  | 'system'
  | 'settings'
