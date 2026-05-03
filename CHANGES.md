# Pixel Perfect — Changes Summary

## Overview

Full implementation of the Pixel Perfect retro arcade photobooth app from scratch, covering the complete user flow, admin dashboard, shared UI primitives, and supporting infrastructure.

---

## New Files Created

### `src/app/page.tsx`
- Root `PhotoboothApp` component
- 5-click secret admin toggle (invisible button top-left, 2s reset window)
- Renders `<UserApp />` or `<AdminApp />` based on mode
- EXIT ADMIN button visible in admin mode

### `src/app/globals.css`
- CSS custom properties: `--ivory`, `--blue`, `--olive`, `--burnt`, `--mustard`, `--ink`
- Google Fonts import: Press Start 2P + VT323
- Custom utility classes: `.font-arcade`, `.font-crt`, `.scanlines`
- Keyframe animations: `marquee`, `blink`, `blink-slow`, `star-twinkle`, `flash`, `strip-drop`, `arrow-pulse`, `coin-bob`, `screen-static`
- Animation classes: `.animate-marquee`, `.animate-blink`, `.animate-blink-slow`, `.animate-coin`, `.animate-strip-drop`, `.animate-arrow`, `.animate-star`, `.animate-flash`

---

## User Flow Components

### `src/components/user/UserApp.tsx`
- Screen state machine: `attract → welcome → chooseLayout → camera → strip`
- Owns all shared state: `chosenLayoutId`, `capturedShots`, `countdownSec`, `photoFilter`
- Passes only needed props down to each screen

### `src/components/user/AttractScreen.tsx`
- 3-row CSS grid layout: marquee / center stage / control deck
- Animated scrolling marquee (ink bg, mustard text)
- Center CRT screen: olive bg, rounded corners, glass highlight overlay, scanlines
- PIXEL PERFECT logo with layered text shadows
- TAP TO START button with `animate-blink-slow`
- Animated `PhotoStripMini` cycling through 4 colored slots every 1.8s
- Left panel: HOW TO PLAY steps (01–04) + pixel art camera
- Right panel: RECENT BOOKINGS list
- Bottom control deck: decorative joystick + arcade buttons
- Full-screen scanlines overlay

### `src/components/user/WelcomeScreen.tsx`
- Uses `FlowChrome` (step 1/4)
- Decorative checker corners (absolute positioned)
- `ArcadePanel` with ★ READY TO PLAY ★ badge floating at -22px top
- WELCOME! heading with mustard + blue text shadows
- Copy shows countdown seconds and photo count from props
- START button with `animate-blink-slow`

### `src/components/user/ChooseLayoutScreen.tsx`
- Uses `FlowChrome` (step 2/4)
- `LayoutCard` subcomponent: renders mini strip preview grid sized by `layout.columns` and `layout.count`
- Selected card lifts -6px with mustard border + shadow ring
- Price shown in ₱ pesos
- CONTINUE button with animated arrow

### `src/components/user/CameraScreen.tsx`
- Uses `FlowChrome` (step 3/4)
- Real webcam via `getUserMedia` (1280×960, facingMode: user)
- Horizontally mirrored video preview (`scaleX(-1)`)
- Canvas capture with `ctx.scale(-1, 1)` mirror + `toDataURL('image/jpeg', 0.85)`
- Countdown timer effect driven by `useEffect` on `[started, count, shotIdx]`
- SMILE! overlay when count reaches 0
- Flash overlay on capture
- CRT scanlines on viewfinder
- REC indicator + SHOT N/N HUD
- Filter row using all `FILTERS` from `@/lib/layouts`
- Countdown selector (3s / 5s / 10s) — locked during capture
- Progress grid (mustard = done, olive = current, ivory = pending)
- START CAPTURE / CAPTURING states

### `src/components/user/StripPreviewScreen.tsx`
- Uses `FlowChrome` (step 4/4)
- `animate-strip-drop` entrance animation on the strip
- Renders real captured `<img>` elements with CSS filter applied
- Photo slot sizing adapts to layout (single / 2-col / multi)
- Numbered overlays (01, 02…) on each shot
- 6 frame color options: BLACK, IVORY, BLUE, OLIVE, BURNT, MUSTARD
- 6 sticker packs: NONE, STARS, HEARTS, ARCADE, 1-UP, WASHI TAPE
- `StickerOverlay` subcomponent renders `PixelArt` stars/hearts or CSS decorations
- PRINT (window.print()), QR CODE, RETAKE action buttons
- PLAY AGAIN button resets full flow

---

## Admin Components

### `src/components/admin/AdminApp.tsx`
- 2-column grid: 260px sidebar + scrollable main area
- Sidebar: ink bg, mustard border, 7 nav items with active state
- Admin header: section title + ● LIVE badge + OPERATOR label
- System online footer in sidebar

### `src/components/admin/AdminDashboard.tsx`
- 4 stat cards: SESSIONS TODAY, REVENUE TODAY, PHOTOS SHARED, UPTIME
- Pixel bar chart: hourly session counts
- Layout popularity horizontal bars
- Recent sessions table with SHARED badge

### `src/components/admin/AdminSessions.tsx`
- Date filter buttons: TODAY / WEEK / MONTH / ALL TIME
- Sessions table with SHARED (olive) and ABANDONED (burnt) status badges

### `src/components/admin/AdminLayouts.tsx`
- 3-column grid of layout cards
- ● ENABLED / ○ OFF toggle per layout
- EDIT button per layout

### `src/components/admin/AdminBranding.tsx`
- Strip Branding: header/footer text, date stamp, QR, watermark opacity
- Accent Palette: 5 color swatches
- Attract Marquee: marquee text + tagline + attract layout fields
- Logo & Assets: logo preview + upload button

### `src/components/admin/AdminPricing.tsx`
- Price per layout table: ₱100–₱280 with EDIT links
- Payment methods: GCash, Card, PayMaya, Promo Code with ON/OFF status

### `src/components/admin/AdminSystemStatus.tsx`
- 2-column grid of system cards: Web Camera, Photo Storage, CDN, Payments API, Database, Email
- Color-coded shadow per status (olive = ONLINE, burnt = ATTN)

### `src/components/admin/AdminSettings.tsx`
- Session Defaults: countdown, filter, retries, auto share, delete after
- Access & Security: PIN, lock screen, remote access, telemetry
- Opening Hours: Mon–Thu / Fri / Sat / Sun
- Danger Zone: CLEAR BOOKING HISTORY, WIPE PHOTO ARCHIVE, FACTORY RESET

---

## Shared UI Primitives

### `src/components/ui/FlowChrome.tsx`
- `position: absolute; inset: 0; display: flex; flexDirection: column`
- Ink top bar: ◀ BACK / TITLE / STEP N/4, with configurable accent border
- Scrollable content area (`flex: 1; overflow: auto`)

### `src/components/ui/ArcadePanel.tsx`
- Ivory background, 4px ink border, 8px ink box-shadow
- Accepts `style` prop for overrides

### `src/components/ui/PixelArt.tsx`
- Renders a multiline ASCII pattern into a CSS grid of colored divs
- Props: `pattern` (string), `palette` (char → CSS color), `scale` (px per pixel)

### `src/components/ui/AdminCard.tsx`
- Ivory panel with dashed title row
- Accepts `title`, `children`, and `accent` (shadow color) props

---

## Library & Types

### `src/lib/layouts.ts`
- `LAYOUTS` constant: 6 layout configs (S, A, B, C, D, T) with id, label, count, columns, single, traditional, price, enabled
- `FILTERS` constant: 8 filter configs (none, bw, traditional, sepia, vintage, soft, noir, vivid) with label and CSS filter string
- `DEFAULT_BRANDING` and `DEFAULT_SETTINGS` for Supabase initialization

### `src/types/index.ts`
- `FilterId`, `LayoutId`, `LayoutConfig`, `CapturedShot`, `Session`
- `AdminStats`, `BrandingConfig`, `SettingsRow`
- `AppMode`, `UserScreen`, `AdminSection`

---

## Design System Applied

| Token | Value | Usage |
|-------|-------|-------|
| `--ivory` | `#e8e6d8` | Panels, light backgrounds |
| `--blue` | `#5a82aa` | Flow screen background |
| `--olive` | `#558203` | Accent green, enabled state |
| `--burnt` | `#c85500` | Accent orange, prices |
| `--mustard` | `#ffce1b` | Primary CTA, active state |
| `--ink` | `#1a1a14` | Text, borders, dark backgrounds |

- All box shadows use pixel offsets: `6px 6px 0 var(--ink)`
- No border-radius except CRT screen (18px) and joystick/buttons (50%)
- All screens use inline `style={{}}` objects for layout precision
- Scanlines overlay on all user-facing screens

---

## Key Implementation Decisions

- **Inline styles over Tailwind** for all user flow screens — Tailwind arbitrary `min()` values (`h-[min(68vh,560px)]`) were not applying correctly; switched to `style={{ height: 'min(72vh, 640px)' }}`
- **No Redux/Zustand** — `useState` + prop drilling in `UserApp.tsx`
- **Camera mirror** — both video preview (`transform: scaleX(-1)`) and canvas capture (`ctx.scale(-1, 1)`) are mirrored so the captured image is not flipped
- **Countdown state** typed as `number` internally in `CameraScreen` (not `3 | 5 | 10`) to allow `count - 1` without type errors
- **Admin uses Tailwind** with `font-arcade`/`font-crt` custom classes from globals.css and arbitrary value classes like `bg-[var(--ink)]`
