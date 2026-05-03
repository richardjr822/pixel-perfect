import type {
  BrandingConfig,
  FilterId,
  LayoutConfig,
  LayoutId,
  SettingsRow,
} from '@/types'

export const LAYOUTS = {
  S: {
    id: 'S',
    label: 'Single Shot',
    subtitle: '1 photo',
    count: 1,
    columns: 1,
    single: true,
    traditional: false,
    price: 100,
    enabled: true,
  },
  A: {
    id: 'A',
    label: 'Layout A',
    subtitle: '4 photos',
    count: 4,
    columns: 1,
    single: false,
    traditional: false,
    price: 200,
    enabled: true,
  },
  B: {
    id: 'B',
    label: 'Layout B',
    subtitle: '3 photos',
    count: 3,
    columns: 1,
    single: false,
    traditional: false,
    price: 180,
    enabled: true,
  },
  C: {
    id: 'C',
    label: 'Layout C',
    subtitle: '2 photos',
    count: 2,
    columns: 1,
    single: false,
    traditional: false,
    price: 150,
    enabled: false,
  },
  D: {
    id: 'D',
    label: 'Layout D',
    subtitle: '6 photos',
    count: 6,
    columns: 2,
    single: false,
    traditional: false,
    price: 280,
    enabled: true,
  },
  T: {
    id: 'T',
    label: 'Traditional',
    subtitle: '4 photos · dark frame',
    count: 4,
    columns: 1,
    single: false,
    traditional: true,
    price: 200,
    enabled: true,
  },
} satisfies Record<LayoutId, LayoutConfig>

export const FILTERS = {
  none: {
    label: 'NO FILTER',
    css: 'none',
  },
  bw: {
    label: 'B&W',
    css: 'grayscale(1) contrast(1.05)',
  },
  traditional: {
    label: 'TRADITIONAL',
    css: 'saturate(0.85) contrast(0.95) sepia(0.1)',
  },
  sepia: {
    label: 'SEPIA',
    css: 'sepia(0.85) saturate(1.1) hue-rotate(-15deg)',
  },
  vintage: {
    label: 'VINTAGE',
    css: 'sepia(0.4) saturate(1.3) contrast(1.1) brightness(0.95)',
  },
  soft: {
    label: 'SOFT',
    css: 'saturate(0.85) contrast(0.9) brightness(1.08) blur(0.3px)',
  },
  noir: {
    label: 'NOIR',
    css: 'grayscale(1) contrast(1.4) brightness(0.85)',
  },
  vivid: {
    label: 'VIVID',
    css: 'saturate(1.6) contrast(1.15)',
  },
} as const satisfies Record<FilterId, { label: string; css: string }>

export const COUNTDOWN_OPTIONS = [3, 5, 10] as const

export const DEFAULT_BRANDING = {
  marquee_text:
    'BOOK A SESSION • SMILE BIG • PIXEL PERFECT • SHARE INSTANTLY • SCAN TO START',
  tagline: 'GET YOUR FACE IN THE FRAME',
  logo_url: null,
  header_text: '★ PIXEL PERFECT ★',
  footer_text: 'pixelperfect.ph',
  show_date_stamp: true,
  show_qr_code: true,
} satisfies BrandingConfig

export const DEFAULT_SETTINGS = {
  id: 1,
  layouts_config: {
    S: { enabled: LAYOUTS.S.enabled, price: LAYOUTS.S.price },
    A: { enabled: LAYOUTS.A.enabled, price: LAYOUTS.A.price },
    B: { enabled: LAYOUTS.B.enabled, price: LAYOUTS.B.price },
    C: { enabled: LAYOUTS.C.enabled, price: LAYOUTS.C.price },
    D: { enabled: LAYOUTS.D.enabled, price: LAYOUTS.D.price },
    T: { enabled: LAYOUTS.T.enabled, price: LAYOUTS.T.price },
  },
  branding_config: DEFAULT_BRANDING,
  default_countdown: 3,
  default_filter: 'none',
  auto_share: true,
} satisfies SettingsRow
