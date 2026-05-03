'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { CapturedShot, LayoutConfig } from '@/types'
import { FILTERS } from '@/lib/layouts'
import { FlowChrome } from '@/components/ui/FlowChrome'
import { ArcadePanel } from '@/components/ui/ArcadePanel'
import { ArcadeKeyboard } from '@/components/ui/ArcadeKeyboard'
import { PixelArt } from '@/components/ui/PixelArt'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const STAR = `
...y...
...y...
.y.y.y.
.yyyyy.
yyyyyyy
.yyyyy.
.y.y.y.
y..y..y
`

const HEART = `
.rr.rr.
rrrrrrr
rrrrrrr
.rrrrr.
..rrr..
...r...
`

const FLOWER = `
r.r.r
.rrr.
rrYrr
.rrr.
r.r.r
`

const MUSHROOM = `
.rrrrr.
rrwwrrr
rrrrrrr
rrrrrrr
.rrrrr.
..bbb..
.bbbbb.
`

const DIAMOND = `
..d..
.ddd.
ddddd
.ddd.
..d..
`

const FRAME_COLORS = [
  { id: 'ink',     label: 'BLACK',   value: 'var(--ink)',     fg: 'var(--ivory)' },
  { id: 'ivory',   label: 'IVORY',   value: 'var(--ivory)',   fg: 'var(--ink)' },
  { id: 'blue',    label: 'BLUE',    value: 'var(--blue)',    fg: 'var(--ivory)' },
  { id: 'olive',   label: 'OLIVE',   value: 'var(--olive)',   fg: 'var(--ivory)' },
  { id: 'burnt',   label: 'BURNT',   value: 'var(--burnt)',   fg: 'var(--ivory)' },
  { id: 'mustard', label: 'MUSTARD', value: 'var(--mustard)', fg: 'var(--ink)' },
]

const STICKER_PACKS = [
  { id: 'none',      label: 'NONE' },
  { id: 'stars',     label: 'STARS' },
  { id: 'hearts',    label: 'HEARTS' },
  { id: 'confetti',  label: 'CONFETTI' },
  { id: 'filmstrip', label: 'FILM' },
  { id: 'gamer',     label: 'GAMER' },
  { id: 'retro',     label: 'RETRO' },
  { id: 'bloom',     label: 'BLOOM' },
  { id: 'tape',      label: 'TAPE' },
  { id: 'glitter',   label: 'GLITTER' },
]

function StickerOverlay({ pack }: { pack: string }) {
  if (pack === 'none') return null

  if (pack === 'stars') return (
    <>
      <div style={{ position: 'absolute', top: -14, left: -14, animation: 'star-twinkle 1.4s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{ position: 'absolute', top: -14, right: -14, animation: 'star-twinkle 1.4s 0.4s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--burnt)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{ position: 'absolute', bottom: -14, left: -14, animation: 'star-twinkle 1.4s 0.8s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={2} />
      </div>
      <div style={{ position: 'absolute', bottom: -14, right: -14, animation: 'star-twinkle 1.4s 0.2s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--olive)', '.': 'transparent' }} scale={2} />
      </div>
      <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', animation: 'star-twinkle 1.4s 0.6s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={4} />
      </div>
    </>
  )

  if (pack === 'hearts') return (
    <>
      <div style={{ position: 'absolute', top: -14, left: -12 }}>
        <PixelArt pattern={HEART} palette={{ r: 'var(--burnt)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', top: -14, right: -12 }}>
        <PixelArt pattern={HEART} palette={{ r: 'var(--burnt)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', bottom: -12, left: -8 }}>
        <PixelArt pattern={HEART} palette={{ r: 'var(--mustard)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{ position: 'absolute', bottom: -12, right: -8 }}>
        <PixelArt pattern={HEART} palette={{ r: 'var(--mustard)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{
        position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
        color: 'var(--burnt)', letterSpacing: '0.2em', whiteSpace: 'nowrap',
      }}>
        xoxo ♥
      </div>
    </>
  )

  if (pack === 'confetti') return (
    <>
      {/* Top edge */}
      <div style={{ position: 'absolute', top: -10, left: 10,  width: 10, height: 10, background: 'var(--mustard)', transform: 'rotate(15deg)' }} />
      <div style={{ position: 'absolute', top: -9,  left: 28,  width: 7,  height: 12, background: 'var(--burnt)',   transform: 'rotate(-22deg)' }} />
      <div style={{ position: 'absolute', top: -11, left: 52,  width: 12, height: 7,  background: 'var(--olive)',   transform: 'rotate(30deg)' }} />
      <div style={{ position: 'absolute', top: -10, right: 10, width: 10, height: 10, background: 'var(--blue)',    transform: 'rotate(-10deg)' }} />
      <div style={{ position: 'absolute', top: -9,  right: 32, width: 7,  height: 12, background: 'var(--mustard)',transform: 'rotate(25deg)' }} />
      <div style={{ position: 'absolute', top: -11, right: 56, width: 12, height: 7,  background: 'var(--burnt)',   transform: 'rotate(-30deg)' }} />
      {/* Bottom edge */}
      <div style={{ position: 'absolute', bottom: -10, left: 14,  width: 10, height: 10, background: 'var(--olive)',   transform: 'rotate(-15deg)' }} />
      <div style={{ position: 'absolute', bottom: -9,  left: 36,  width: 8,  height: 12, background: 'var(--blue)',    transform: 'rotate(20deg)' }} />
      <div style={{ position: 'absolute', bottom: -11, left: 62,  width: 10, height: 7,  background: 'var(--mustard)', transform: 'rotate(-8deg)' }} />
      <div style={{ position: 'absolute', bottom: -10, right: 16, width: 10, height: 10, background: 'var(--burnt)',   transform: 'rotate(10deg)' }} />
      <div style={{ position: 'absolute', bottom: -9,  right: 40, width: 12, height: 7,  background: 'var(--mustard)', transform: 'rotate(-25deg)' }} />
      {/* Sides */}
      <div style={{ position: 'absolute', top: '20%', left: -10, width: 8, height: 8,  background: 'var(--mustard)', transform: 'rotate(20deg)' }} />
      <div style={{ position: 'absolute', top: '55%', left: -9,  width: 10, height: 7, background: 'var(--blue)',    transform: 'rotate(-15deg)' }} />
      <div style={{ position: 'absolute', top: '35%', right: -10, width: 8, height: 10, background: 'var(--burnt)',  transform: 'rotate(12deg)' }} />
      <div style={{ position: 'absolute', top: '68%', right: -9,  width: 10, height: 7, background: 'var(--olive)',  transform: 'rotate(-20deg)' }} />
    </>
  )

  if (pack === 'filmstrip') return (
    <>
      <div style={{
        position: 'absolute', top: -22, left: -6, right: -6, height: 20,
        background: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 6px',
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ width: 13, height: 11, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 1 }} />
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: -22, left: -6, right: -6, height: 20,
        background: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 6px',
      }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ width: 13, height: 11, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 1 }} />
        ))}
      </div>
      <div style={{
        position: 'absolute', top: -6, bottom: -6, left: -22,
        width: 20, background: 'var(--ink)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '6px 0',
      }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ width: 11, height: 13, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 1 }} />
        ))}
      </div>
      <div style={{
        position: 'absolute', top: -6, bottom: -6, right: -22,
        width: 20, background: 'var(--ink)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '6px 0',
      }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} style={{ width: 11, height: 13, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 1 }} />
        ))}
      </div>
    </>
  )

  if (pack === 'gamer') return (
    <>
      <div style={{
        position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
        background: 'var(--mustard)', color: 'var(--ink)',
        fontFamily: "'Press Start 2P', monospace", fontSize: 8,
        padding: '4px 14px', border: '2px solid var(--ink)', boxShadow: '2px 2px 0 var(--ink)',
        letterSpacing: '0.15em', whiteSpace: 'nowrap',
      }}>
        ▶ PLAYER 1
      </div>
      <div style={{
        position: 'absolute', top: -14, right: -14, transform: 'rotate(6deg)',
        background: 'var(--olive)', color: 'var(--ivory)',
        fontFamily: "'Press Start 2P', monospace", fontSize: 9,
        padding: '5px 7px', border: '3px solid var(--ink)', boxShadow: '2px 2px 0 var(--ink)',
      }}>
        1UP
      </div>
      <div style={{ position: 'absolute', bottom: -14, left: -12, animation: 'star-twinkle 1.4s 0.5s infinite' }}>
        <PixelArt pattern={MUSHROOM} palette={{ r: 'var(--burnt)', w: 'var(--ivory)', b: 'var(--ink)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{
        position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Press Start 2P', monospace", fontSize: 7,
        color: 'var(--mustard)', letterSpacing: '0.15em', whiteSpace: 'nowrap',
      }}>
        ★ HI-SCORE ★
      </div>
    </>
  )

  if (pack === 'retro') return (
    <>
      {/* Corner L-brackets */}
      <div style={{ position: 'absolute', top: -5, left: -5, width: 22, height: 22, borderTop: '4px solid var(--ink)', borderLeft: '4px solid var(--ink)' }} />
      <div style={{ position: 'absolute', top: -5, right: -5, width: 22, height: 22, borderTop: '4px solid var(--ink)', borderRight: '4px solid var(--ink)' }} />
      <div style={{ position: 'absolute', bottom: -5, left: -5, width: 22, height: 22, borderBottom: '4px solid var(--ink)', borderLeft: '4px solid var(--ink)' }} />
      <div style={{ position: 'absolute', bottom: -5, right: -5, width: 22, height: 22, borderBottom: '4px solid var(--ink)', borderRight: '4px solid var(--ink)' }} />
      {/* Vintage stamp */}
      <div style={{
        position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%) rotate(-2deg)',
        color: 'var(--burnt)', fontFamily: "'Press Start 2P', monospace", fontSize: 7,
        border: '2px solid var(--burnt)', padding: '3px 10px',
        letterSpacing: '0.2em', whiteSpace: 'nowrap', opacity: 0.85,
      }}>
        ★ PIXEL PERFECT ★
      </div>
      <div style={{
        position: 'absolute', bottom: -18, left: '50%', transform: 'translateX(-50%) rotate(1.5deg)',
        color: 'var(--blue)', fontFamily: "'Press Start 2P', monospace", fontSize: 6,
        letterSpacing: '0.15em', whiteSpace: 'nowrap', opacity: 0.7,
      }}>
        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
      </div>
    </>
  )

  if (pack === 'bloom') return (
    <>
      <div style={{ position: 'absolute', top: -14, left: -12 }}>
        <PixelArt pattern={FLOWER} palette={{ r: 'var(--burnt)', Y: 'var(--mustard)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', top: -14, right: -12 }}>
        <PixelArt pattern={FLOWER} palette={{ r: 'var(--blue)', Y: 'var(--ivory)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', bottom: -14, left: -12 }}>
        <PixelArt pattern={FLOWER} palette={{ r: 'var(--olive)', Y: 'var(--mustard)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', bottom: -14, right: -12 }}>
        <PixelArt pattern={FLOWER} palette={{ r: 'var(--mustard)', Y: 'var(--ivory)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}>
        <PixelArt pattern={FLOWER} palette={{ r: 'var(--burnt)', Y: 'var(--ivory)', '.': 'transparent' }} scale={3} />
      </div>
    </>
  )

  if (pack === 'tape') return (
    <>
      <div style={{ position: 'absolute', top: -9,  left: 8,   width: 54, height: 16, background: 'var(--mustard)', opacity: 0.88, transform: 'rotate(-6deg)',  border: '1px dashed rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', top: -8,  right: 10, width: 54, height: 16, background: 'var(--blue)',    opacity: 0.80, transform: 'rotate(5deg)',   border: '1px dashed rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', bottom: -9,  left: 14,  width: 54, height: 16, background: 'var(--burnt)', opacity: 0.82, transform: 'rotate(4deg)',  border: '1px dashed rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', bottom: -8,  right: 8,  width: 54, height: 16, background: 'var(--olive)', opacity: 0.80, transform: 'rotate(-5deg)', border: '1px dashed rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', top: '42%', left: -15,  width: 30, height: 14, background: 'var(--mustard)', opacity: 0.75, transform: 'rotate(-2deg)', border: '1px dashed rgba(0,0,0,0.25)' }} />
      <div style={{ position: 'absolute', top: '42%', right: -15, width: 30, height: 14, background: 'var(--burnt)',   opacity: 0.75, transform: 'rotate(2deg)',  border: '1px dashed rgba(0,0,0,0.25)' }} />
    </>
  )

  if (pack === 'glitter') return (
    <>
      {([
        { top: -13, left: 12,  color: 'var(--mustard)', scale: 3, delay: '0s' },
        { top: -11, left: 48,  color: 'var(--ivory)',   scale: 2, delay: '0.25s' },
        { top: -13, right: 14, color: 'var(--burnt)',   scale: 3, delay: '0.5s' },
        { top: -11, right: 50, color: 'var(--blue)',    scale: 2, delay: '0.1s' },
        { top: -12, left: '50%', transform: 'translateX(-50%)', color: 'var(--mustard)', scale: 4, delay: '0.35s' },
        { bottom: -13, left: 16,  color: 'var(--burnt)',   scale: 3, delay: '0.6s' },
        { bottom: -11, left: 55,  color: 'var(--mustard)', scale: 2, delay: '0.2s' },
        { bottom: -13, right: 18, color: 'var(--mustard)', scale: 3, delay: '0.45s' },
        { bottom: -11, right: 56, color: 'var(--ivory)',   scale: 2, delay: '0.7s' },
        { top: '18%', left: -13, color: 'var(--mustard)', scale: 2, delay: '0.15s' },
        { top: '50%', left: -11, color: 'var(--blue)',    scale: 2, delay: '0.55s' },
        { top: '80%', left: -13, color: 'var(--burnt)',   scale: 2, delay: '0.3s' },
        { top: '18%', right: -13, color: 'var(--burnt)',   scale: 2, delay: '0.4s' },
        { top: '50%', right: -11, color: 'var(--mustard)', scale: 2, delay: '0.65s' },
        { top: '80%', right: -13, color: 'var(--ivory)',   scale: 2, delay: '0.08s' },
      ] as Array<{ color: string; scale: number; delay: string } & React.CSSProperties>).map(({ color, scale, delay, ...pos }, i) => (
        <div key={i} style={{ position: 'absolute', animation: `star-twinkle 1.3s ${delay} infinite`, ...pos }}>
          <PixelArt pattern={DIAMOND} palette={{ d: color, '.': 'transparent' }} scale={scale} />
        </div>
      ))}
    </>
  )

  return null
}

function resolveCanvasColor(cssValue: string): string {
  const match = cssValue.match(/var\((--.+?)\)/)

  if (!match) {
    return cssValue
  }

  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim()
}

function getStripSize(layout: LayoutConfig): { width: number; height: number } {
  if (layout.id === 'S') {
    return { width: 600, height: 420 }
  }

  if (layout.id === 'D') {
    return { width: 560, height: 720 }
  }

  return { width: 400, height: layout.count * 220 + 40 }
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const imageRatio = image.width / image.height
  const slotRatio = width / height
  let sourceX = 0
  let sourceY = 0
  let sourceWidth = image.width
  let sourceHeight = image.height

  if (imageRatio > slotRatio) {
    sourceWidth = image.height * slotRatio
    sourceX = (image.width - sourceWidth) / 2
  } else {
    sourceHeight = image.width / slotRatio
    sourceY = (image.height - sourceHeight) / 2
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height)
}

function isUploadResponse(value: unknown): value is { url: string } {
  return typeof value === 'object' && value !== null && 'url' in value && typeof value.url === 'string'
}

function isErrorResponse(value: unknown): value is { error: string } {
  return typeof value === 'object' && value !== null && 'error' in value && typeof value.error === 'string'
}

function getDownloadUrl(url: string): string {
  if (!url.includes('/upload/')) {
    return url
  }

  return url.replace('/upload/', '/upload/fl_attachment:pixel-perfect-strip/')
}

export async function composeStrip(shots: CapturedShot[], layout: LayoutConfig, frameColor: string): Promise<string> {
  const { width, height } = getStripSize(layout)
  const padding = layout.id === 'S' ? 30 : 20
  const gap = layout.id === 'D' ? 16 : 20
  const footerHeight = layout.id === 'S' ? 44 : 40
  const columns = layout.columns
  const rows = Math.ceil(layout.count / columns)
  const slotWidth = (width - padding * 2 - gap * (columns - 1)) / columns
  const slotHeight = (height - padding * 2 - footerHeight - gap * (rows - 1)) / rows
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context unavailable')
  }

  canvas.width = width
  canvas.height = height
  ctx.fillStyle = resolveCanvasColor(frameColor)
  ctx.fillRect(0, 0, width, height)

  await Promise.all(shots.map((shot, index) => new Promise<void>((resolve) => {
    if (!shot.dataUrl) {
      resolve()
      return
    }

    const image = new Image()

    image.onload = () => {
      const column = index % columns
      const row = Math.floor(index / columns)
      const x = padding + column * (slotWidth + gap)
      const y = padding + row * (slotHeight + gap)

      ctx.save()
      ctx.filter = FILTERS[shot.filter].css
      drawImageCover(ctx, image, x, y, slotWidth, slotHeight)
      ctx.restore()
      ctx.strokeStyle = resolveCanvasColor('var(--ink)')
      ctx.lineWidth = 4
      ctx.strokeRect(x, y, slotWidth, slotHeight)
      resolve()
    }

    image.onerror = () => resolve()
    image.src = shot.dataUrl
  })))

  ctx.textAlign = 'center'
  ctx.fillStyle = resolveCanvasColor('var(--ivory)')
  ctx.font = '14px "Press Start 2P", monospace'
  ctx.fillText('PIXEL PERFECT', width / 2, height - 22)

  return canvas.toDataURL('image/jpeg', 0.9)
}

interface Props {
  shots: CapturedShot[]
  layout: LayoutConfig
  onRetake: () => void
  onPlayAgain: () => void
}

export function StripPreviewScreen({ shots, layout, onRetake, onPlayAgain }: Props) {
  const [frameColorId, setFrameColorId] = useState('ink')
  const [stickers, setStickers] = useState('stars')
  const [isUploading, setIsUploading] = useState(true)
  const [stripUrl, setStripUrl] = useState<string | null>(null)
  const [sessionSaved, setSessionSaved] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const { isMobile } = useBreakpoint()

  const frame = FRAME_COLORS.find(f => f.id === frameColorId) ?? FRAME_COLORS[0]
  const emailStatus: 'idle' | 'sending' | 'sent' | 'error' = emailSent ? 'sent' : emailSending ? 'sending' : emailError ? 'error' : 'idle'
  const cols = layout.columns
  const slotW = isMobile
    ? (layout.single ? 220 : cols === 2 ? 80 : 140)
    : (layout.single ? 360 : cols === 2 ? 110 : 200)
  const slotH = isMobile
    ? (layout.single ? 160 : layout.count <= 2 ? 120 : layout.count >= 6 ? 80 : 100)
    : (layout.single ? 260 : layout.count <= 2 ? 180 : layout.count >= 6 ? 110 : 150)

  useEffect(() => {
    async function saveStrip() {
      setIsUploading(true)
      setSessionSaved(false)

      try {
        const dataUrl = await composeStrip(shots, layout, frame.value)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64: dataUrl, folder: 'pixel-perfect/strips' }),
        })
        const uploadData: unknown = await uploadResponse.json()

        if (!uploadResponse.ok || !isUploadResponse(uploadData)) {
          throw new Error('Upload failed')
        }

        setStripUrl(uploadData.url)

        const sessionResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            layout_id: layout.id,
            filter: shots[0]?.filter ?? 'none',
            photo_urls: [],
            strip_url: uploadData.url,
            price: layout.price,
            status: 'completed',
            email: null,
          }),
        })

        if (!sessionResponse.ok) {
          throw new Error('Session save failed')
        }

        setSessionSaved(true)
      } catch (error) {
        console.error(error)
      } finally {
        setIsUploading(false)
      }
    }

    void saveStrip()
  }, [])

  useEffect(() => {
    async function createQrCode() {
      if (!stripUrl) {
        setQrCodeUrl(null)
        return
      }

      try {
        const url = await QRCode.toDataURL(getDownloadUrl(stripUrl), {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 360,
          color: {
            dark: '#1a1a14',
            light: '#e8e6d8',
          },
        })

        setQrCodeUrl(url)
        setQrError(null)
      } catch (error) {
        console.error(error)
        setQrError('QR failed')
      }
    }

    void createQrCode()
  }, [stripUrl])

  function handlePrint() {
    if (isUploading) {
      return
    }

    window.print()
  }

  function handleQrCode() {
    if (!stripUrl) {
      window.alert('Still uploading...')
      return
    }

    setQrOpen(true)
  }

  function handleQrClose() {
    setQrOpen(false)
  }

  function handleEmailButton() {
    if (!emailSent) {
      setKeyboardOpen(true)
    }
  }

  function handleEmailInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmailInput(event.target.value)
    setEmailError(null)
  }

  async function handleSendEmail(): Promise<boolean> {
    const trimmed = emailInput.trim()

    if (emailSent || emailSending) {
      return false
    }

    if (!stripUrl) {
      setEmailError('Still uploading...')
      return false
    }

    if (!trimmed || !trimmed.includes('@')) {
      setEmailError('Enter a valid email')
      return false
    }

    setEmailSending(true)
    setEmailError(null)

    try {
      const emailResponse = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: trimmed, stripUrl, layoutLabel: layout.label }),
      })
      const emailData: unknown = await emailResponse.json().catch(() => null)

      if (!emailResponse.ok) {
        throw new Error(isErrorResponse(emailData) ? emailData.error : 'Email failed')
      }

      setEmailInput(trimmed)
      setEmailSent(true)
      return true
    } catch (error) {
      console.error(error)
      setEmailError(error instanceof Error ? error.message : 'Email failed')
      return false
    } finally {
      setEmailSending(false)
    }
  }

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void handleSendEmail()
  }

  function handleKeyboardClose() {
    setKeyboardOpen(false)
  }

  function handleKeyboardSend() {
    void handleSendEmail().then((sent) => {
      if (sent) {
        setKeyboardOpen(false)
      }
    })
  }
  return (
    <>
    {keyboardOpen && (
      <ArcadeKeyboard
        value={emailInput}
        onChange={setEmailInput}
        onClose={handleKeyboardClose}
        onSend={handleKeyboardSend}
        status={emailStatus}
      />
    )}
    {qrOpen && (
      <div
        onClick={handleQrClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(26,26,20,0.88)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 210,
          padding: 24,
        }}
      >
        <div
          onClick={event => event.stopPropagation()}
          style={{
            background: 'var(--ivory)',
            border: '6px solid var(--ink)',
            boxShadow: '10px 10px 0 var(--mustard)',
            padding: isMobile ? 18 : 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            maxWidth: 460,
            width: '100%',
          }}
        >
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: isMobile ? 12 : 15,
            color: 'var(--ink)',
            letterSpacing: '0.12em',
            textAlign: 'center',
            lineHeight: 1.5,
          }}>
            SCAN TO DOWNLOAD
          </div>
          {qrCodeUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCodeUrl}
              alt="QR code for photo strip"
              style={{
                width: 'min(100%, 360px)',
                aspectRatio: '1 / 1',
                imageRendering: 'pixelated',
                border: '4px solid var(--ink)',
                background: 'var(--ivory)',
              }}
            />
          ) : (
            <div className="animate-blink" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: qrError ? 'var(--burnt)' : 'var(--mustard)',
              letterSpacing: '0.1em',
              padding: 40,
            }}>
              {qrError ?? 'MAKING QR...'}
            </div>
          )}
          <div
            onClick={handleQrClose}
            style={{
              cursor: 'pointer',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--mustard)',
              background: 'var(--ink)',
              border: '3px solid var(--mustard)',
              padding: '10px 18px',
              letterSpacing: '0.15em',
            }}
          >
            CLOSE
          </div>
        </div>
      </div>
    )}
    <FlowChrome step={4} total={4} title="YOUR STRIP" onBack={onRetake}>
      <div style={{
        padding: isMobile ? '12px' : 'min(3vw, 36px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
        gap: isMobile ? 16 : 36,
        maxWidth: 1280,
        margin: '0 auto',
        alignItems: 'flex-start',
      }}>
        {/* LEFT — strip */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 13,
            color: 'var(--ivory)',
            letterSpacing: '0.25em',
            textShadow: '2px 2px 0 var(--ink)',
          }}>
            ★ PHOTO STRIP PREVIEW ★
          </div>

          <div style={{
            background: 'var(--mustard)',
            color: 'var(--ink)',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            padding: '6px 12px',
            border: '3px solid var(--ink)',
            letterSpacing: '0.15em',
          }}>
            LAYOUT: {layout.label.toUpperCase()} ({layout.count} PHOTO{layout.count !== 1 ? 'S' : ''})
          </div>

          {/* Animated strip */}
          <div className="animate-strip-drop">
            <div style={{
              background: frame.value,
              padding: 18,
              border: '4px solid var(--ink)',
              boxShadow: '10px 10px 0 var(--ink)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              position: 'relative',
            }}>
              <StickerOverlay pack={stickers} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, ${slotW}px)`,
                gap: 10,
              }}>
                {shots.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      width: slotW,
                      height: slotH,
                      border: '3px solid var(--ink)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      filter: FILTERS[s.filter].css,
                    }}
                  >
                    {s.dataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.dataUrl}
                        alt={`Shot ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'var(--olive)' }} />
                    )}
                    <div style={{
                      position: 'absolute',
                      top: 4,
                      left: 6,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 7,
                      color: 'var(--ink)',
                      opacity: 0.7,
                    }}>
                      0{i + 1}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                textAlign: 'center',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 11,
                color: frame.fg,
                letterSpacing: '0.25em',
                padding: '6px 0 2px',
              }}>
                ★ PIXEL PERFECT ★
              </div>
              <div style={{
                textAlign: 'center',
                fontFamily: "'VT323', monospace",
                fontSize: 16,
                color: frame.fg,
                opacity: 0.75,
                letterSpacing: '0.15em',
              }}>
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: 'PRINT', label: 'PRINT', accent: 'var(--mustard)', onClick: handlePrint, disabled: isUploading },
              { icon: 'QR', label: 'QR CODE', accent: 'var(--burnt)', onClick: handleQrCode, disabled: false },
              { icon: 'MAIL', label: 'EMAIL', accent: 'var(--blue)', onClick: handleEmailButton, disabled: emailSent },
              { icon: 'AGAIN', label: 'RETAKE', accent: 'var(--ivory)', onClick: onRetake, disabled: false },
            ].map(btn => (
              <div
                key={btn.label}
                onClick={btn.disabled ? undefined : btn.onClick}
                style={{
                  cursor: btn.disabled ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'var(--ivory)',
                  color: 'var(--ink)',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  letterSpacing: '0.15em',
                  border: '3px solid var(--ink)',
                  boxShadow: `3px 3px 0 ${btn.accent}`,
                  opacity: btn.disabled ? 0.55 : 1,
                }}
              >
                <span style={{ color: btn.accent === 'var(--ivory)' ? 'var(--ink)' : btn.accent, fontSize: 12 }}>
                  {btn.icon}
                </span>
                {btn.label}
              </div>
            ))}
          </div>

          {isUploading && (
            <div className="animate-blink" style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--mustard)',
              letterSpacing: '0.15em',
            }}>
              SAVING YOUR STRIP...
            </div>
          )}

          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={emailInput}
              onChange={handleEmailInputChange}
              className="font-crt text-xl border-2 border-[var(--ink)] px-3 py-2 bg-[var(--ivory)]"
              disabled={emailSent}
            />
            <button
              type="submit"
              className="font-arcade text-[10px] bg-[var(--ink)] text-[var(--mustard)] px-4 py-2"
              disabled={emailSent || emailSending}
            >
              SEND
            </button>
            {emailSent && (
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--olive)', alignSelf: 'center' }}>
                ✓ SENT!
              </span>
            )}
            {emailError && (
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--burnt)', alignSelf: 'center' }}>
                {emailError}
              </span>
            )}
          </form>

        </div>

        {/* RIGHT — customize */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <ArcadePanel>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 12,
              color: 'var(--ink)',
              letterSpacing: '0.25em',
            }}>
              CUSTOMIZE YOUR STRIP
            </div>
            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 22,
              color: 'var(--ink)',
              opacity: 0.7,
              marginTop: 4,
            }}>
              pick a frame & sticker pack — then take it home.
            </div>
          </ArcadePanel>

          {/* Frame color */}
          <ArcadePanel>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
              marginBottom: 12,
            }}>
              ▸ FRAME COLOR
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: 8 }}>
              {FRAME_COLORS.map(c => {
                const active = frameColorId === c.id
                return (
                  <div
                    key={c.id}
                    onClick={() => setFrameColorId(c.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 8px',
                      background: c.value,
                      color: c.fg,
                      border: `3px solid ${active ? 'var(--mustard)' : 'var(--ink)'}`,
                      boxShadow: active ? '3px 3px 0 var(--mustard)' : '3px 3px 0 var(--ink)',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textAlign: 'center',
                    }}
                  >
                    {c.label}
                  </div>
                )
              })}
            </div>
          </ArcadePanel>

          {/* Stickers */}
          <ArcadePanel>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
              marginBottom: 12,
            }}>
              ▸ STICKERS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: 8 }}>
              {STICKER_PACKS.map(s => {
                const active = stickers === s.id
                return (
                  <div
                    key={s.id}
                    onClick={() => setStickers(s.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px 6px',
                      background: active ? 'var(--ink)' : 'var(--ivory)',
                      color: active ? 'var(--mustard)' : 'var(--ink)',
                      border: '3px solid var(--ink)',
                      boxShadow: active ? '3px 3px 0 var(--mustard)' : '3px 3px 0 var(--ink)',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      textAlign: 'center',
                    }}
                  >
                    {s.label}
                  </div>
                )
              })}
            </div>
          </ArcadePanel>

          <ArcadePanel>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
              marginBottom: 12,
            }}>
              SEND TO EMAIL
            </div>
            {emailSent ? (
              <div style={{
                background: 'var(--olive)',
                color: 'var(--ivory)',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                padding: '14px 16px',
                border: '3px solid var(--ink)',
                letterSpacing: '0.1em',
                textAlign: 'center',
                lineHeight: 1.6,
              }}>
                STRIP SENT!<br />CHECK YOUR INBOX
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  onClick={handleEmailButton}
                  style={{
                    background: 'var(--ink)',
                    border: '3px solid var(--mustard)',
                    padding: '12px 14px',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 10,
                    color: emailInput ? 'var(--mustard)' : 'rgba(255,206,27,0.35)',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minHeight: 46,
                  }}
                >
                  <span style={{ opacity: 0.6, fontSize: 12 }}>MAIL</span>
                  <span style={{ wordBreak: 'break-all', flex: 1 }}>
                    {emailInput || 'TAP TO ENTER EMAIL'}
                  </span>
                </div>
                <div
                  onClick={handleEmailButton}
                  style={{
                    cursor: 'pointer',
                    padding: '12px',
                    textAlign: 'center',
                    background: emailError ? 'var(--burnt)' : 'var(--mustard)',
                    color: 'var(--ink)',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 10,
                    border: '3px solid var(--ink)',
                    boxShadow: '3px 3px 0 var(--ink)',
                    letterSpacing: '0.12em',
                  }}
                >
                  {emailError ? 'FAILED - TAP TO RETRY' : 'OPEN KEYBOARD'}
                </div>
              </div>
            )}
          </ArcadePanel>

          <div
            onClick={onPlayAgain}
            style={{
              cursor: 'pointer',
              padding: '16px 22px',
              textAlign: 'center',
              background: 'var(--ink)',
              color: 'var(--mustard)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              letterSpacing: '0.2em',
              border: '3px solid var(--mustard)',
              boxShadow: '6px 6px 0 var(--mustard)',
            }}
          >
            ▶ PLAY AGAIN
          </div>
        </div>
      </div>
    </FlowChrome>
    </>
  )
}
