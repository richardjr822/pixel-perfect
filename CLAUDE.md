@AGENTS.md

## CLAUDE.md

```markdown
# Pixel Perfect — Photobooth App

## Project Overview
A retro arcade-themed web photobooth app built for a physical booth event.
Users tap to start, choose a layout, take photos via webcam, and receive a
composed photo strip they can print, share via QR, or receive by email.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + CSS custom properties
- **Database**: Supabase (PostgreSQL)
- **Media Storage**: Cloudinary
- **Email**: Nodemailer via Gmail
- **Package Manager**: Bun
- **Runtime**: Node.js (API routes), Browser (webcam, canvas)

## Commands
```bash
bun dev          # Start dev server (Turbopack)
bun build        # Production build
bun lint         # ESLint
bun typecheck    # tsc --noEmit
```

## Project Structure
```
src/
├── app/
│   ├── page.tsx                  # Root — PhotoboothApp (mode toggle)
│   ├── layout.tsx                # Metadata + body class
│   ├── globals.css               # CSS vars, keyframes, utility classes
│   └── api/
│       ├── sessions/route.ts     # POST/GET sessions
│       ├── upload/route.ts       # POST base64 → Cloudinary
│       └── email/route.ts        # POST → Nodemailer
├── components/
│   ├── user/                     # User-facing photobooth flow
│   │   ├── UserApp.tsx           # Screen state machine
│   │   ├── AttractScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── ChooseLayoutScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   └── StripPreviewScreen.tsx
│   ├── admin/                    # Admin dashboard
│   │   ├── AdminApp.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminSessions.tsx
│   │   ├── AdminLayouts.tsx
│   │   ├── AdminBranding.tsx
│   │   ├── AdminPricing.tsx
│   │   ├── AdminSystemStatus.tsx
│   │   └── AdminSettings.tsx
│   └── ui/                       # Shared primitives
│       ├── ArcadeButton.tsx
│       ├── CRTFrame.tsx
│       ├── LayoutCard.tsx
│       └── FlowChrome.tsx
├── lib/
│   ├── layouts.ts                # LAYOUTS and FILTERS constants
│   ├── supabase.ts               # Browser Supabase client
│   ├── supabase-server.ts        # Server-only Supabase client
│   ├── cloudinary.ts             # uploadBase64() helper
│   └── mailer.ts                 # sendStripEmail() helper
└── types/
    └── index.ts                  # All shared TypeScript types
```

## Architecture Decisions

### State Management
- No Redux or Zustand. Use useState + prop drilling within each flow.
- UserApp.tsx owns all user flow state and passes down only what each screen needs.
- AdminApp.tsx owns admin section routing state.

### Client vs Server Components
- All screen components are 'use client' — they use webcam, canvas, and state.
- API routes handle all server-side logic (Supabase writes, Cloudinary, email).
- lib/supabase-server.ts and lib/cloudinary.ts and lib/mailer.ts are server-only.
- Never import server-only libs into client components.

### Photo Capture Flow
1. CameraScreen uses getUserMedia() to access webcam
2. Each shot is captured via canvas.drawImage(videoElement)
3. canvas.toDataURL('image/jpeg', 0.85) produces base64
4. Base64 is sent to /api/upload → Cloudinary → returns secure_url
5. All URLs collected → passed to StripPreviewScreen
6. Strip is composed on a second canvas → uploaded → strip_url saved

### Strip Composition
- Done entirely on the client using the Canvas API
- No server-side image processing
- Canvas draws each photo frame in layout order with correct grid
- Final canvas.toDataURL() → /api/upload → strip_url

## Design System

### Color Palette
```css
--ivory:  #e8e6d8   /* background, light text */
--blue:   #5a82aa   /* primary background */
--olive:  #558203   /* accent green */
--burnt:  #c85500   /* accent orange */
--mustard:#ffce1b   /* primary accent, CTAs */
--ink:    #1a1a14   /* near-black, text, borders */
```

### Typography
- **Headings / CTAs**: `font-arcade` → 'Press Start 2P', monospace
- **Body / subtitles**: `font-crt` → 'VT323', monospace
- Loaded via Google Fonts @import in globals.css (not next/font)

### Aesthetic Rules
- Retro arcade. Pixel-sharp. No border-radius except where intentional.
- Box shadows always use pixel offsets: `6px 6px 0 var(--ink)`
- No drop shadows, no blur (except as a photo filter effect)
- Scanlines overlay on all user-facing screens (`.scanlines` class)
- Blinking text uses `.animate-blink` for CTAs

## TypeScript Rules
- All types live in src/types/index.ts — import from there
- No `any`. Use `unknown` and narrow if needed.
- Props interfaces are defined in the same file as the component
- API route request/response bodies must be typed

## Component Rules
- One component per file
- Props interface defined at top of file, above the component
- 'use client' only when the component uses: useState, useEffect,
  useRef, event handlers, browser APIs (webcam, canvas, window)
- Server Components are the default for layout wrappers with no interactivity
- No inline anonymous arrow functions as event handlers inside JSX —
  define handler functions above the return statement

## API Routes
All routes live in src/app/api/*/route.ts

### POST /api/upload
Request:  { base64: string; folder?: string }
Response: { url: string } | { error: string }

### POST /api/sessions
Request:  Omit<Session, 'id' | 'created_at'>
Response: { session: Session } | { error: string }

### GET /api/sessions
Response: { sessions: Session[] } | { error: string }

### POST /api/email
Request:  { to: string; stripUrl: string; layoutLabel: string }
Response: { success: true } | { error: string }

## Database

### Supabase Tables

**sessions**
| column      | type        | notes                    |
|-------------|-------------|--------------------------|
| id          | uuid        | PK, default gen_random_uuid() |
| layout_id   | text        | 'S','A','B','C','D','T'  |
| filter      | text        | FilterId                 |
| photo_urls  | text[]      | Cloudinary URLs          |
| strip_url   | text        | nullable                 |
| price       | int         | in pesos                 |
| status      | text        | 'completed'|'abandoned'  |
| email       | text        | nullable                 |
| created_at  | timestamptz | default now()            |

**settings**
| column           | type  | notes              |
|------------------|-------|--------------------|
| id               | int   | PK, always 1       |
| layouts_config   | jsonb |                    |
| branding_config  | jsonb |                    |
| default_countdown| int   |                    |
| default_filter   | text  |                    |
| auto_share       | bool  |                    |

RLS is disabled — this is a booth app, not a multi-tenant SaaS.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GMAIL_USER=
GMAIL_APP_PASSWORD=
```
Never expose SUPABASE_SERVICE_ROLE_KEY, CLOUDINARY_API_SECRET,
or GMAIL_APP_PASSWORD to the client. They are server-only.

## Known Limitations / Out of Scope
- No authentication on admin (5-click secret toggle only)
- No real-time updates in admin dashboard (manual refresh)
- No payment processing (pricing is display-only for the booth)
- No print driver integration (browser window.print() only)
- Photos are stored as individual Cloudinary uploads before strip composition
- Strip composition does not support custom sticker overlays in v1

## What Done Looks Like
- [ ] bun dev starts with no TypeScript or build errors
- [ ] Attract screen visible at localhost:3000
- [ ] Full user flow: Attract → Welcome → Layout → Camera → Strip
- [ ] Strip composes correctly for all 6 layout types
- [ ] Session saved to Supabase on strip completion
- [ ] Email delivery works with a real Gmail app password
- [ ] Admin dashboard shows real session data from Supabase
- [ ] Admin layout toggles persist to Supabase settings table
- [ ] App runs fullscreen on a 1920×1080 display without scroll
```