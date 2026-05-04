'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import QRCode from 'qrcode'
import type { CapturedShot, LayoutConfig } from '@/types'
import { FILTERS } from '@/lib/layouts'
import { SOLO_SHOT_BORDER } from '@/lib/borders'
import { FlowChrome } from '@/components/ui/FlowChrome'
import { ArcadePanel } from '@/components/ui/ArcadePanel'
import { ArcadeKeyboard } from '@/components/ui/ArcadeKeyboard'
import { PrintModal } from '@/components/ui/PrintModal'
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

type StickerPackId = (typeof STICKER_PACKS)[number]['id']
type SoloShotStyle = 'border' | 'default'

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
] as const

type UploadedUrl = string

function StickerOverlay({ pack }: { pack: StickerPackId }) {
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

function getStripSize(layout: LayoutConfig, useSoloShotBorder = false): { width: number; height: number } {
  if (layout.id === 'S' && useSoloShotBorder) {
    return { width: SOLO_SHOT_BORDER.width, height: SOLO_SHOT_BORDER.height }
  }

  if (layout.id === 'S') {
    return { width: 600, height: 420 }
  }

  if (layout.id === 'D') {
    return { width: 560, height: 720 }
  }

  return { width: 400, height: layout.count * 220 + 40 }
}

function loadCanvasImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Image failed to load: ${src}`))
    image.src = src
  })
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

function drawPixelPattern(
  ctx: CanvasRenderingContext2D,
  pattern: string,
  palette: Record<string, string>,
  x: number,
  y: number,
  scale: number
) {
  const rows = pattern.trim().split('\n')

  rows.forEach((row, rowIndex) => {
    Array.from(row).forEach((char, columnIndex) => {
      const color = palette[char]

      if (!color || color === 'transparent') {
        return
      }

      ctx.fillStyle = resolveCanvasColor(color)
      ctx.fillRect(x + columnIndex * scale, y + rowIndex * scale, scale, scale)
    })
  })
}

function drawCenteredPixelPattern(
  ctx: CanvasRenderingContext2D,
  pattern: string,
  palette: Record<string, string>,
  x: number,
  y: number,
  scale: number
) {
  const rows = pattern.trim().split('\n')
  const patternWidth = Math.max(...rows.map(row => row.length)) * scale
  const patternHeight = rows.length * scale

  drawPixelPattern(ctx, pattern, palette, x - patternWidth / 2, y - patternHeight / 2, scale)
}

function drawRotatedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  rotation = 0,
  alpha = 1
) {
  ctx.save()
  ctx.translate(x + width / 2, y + height / 2)
  ctx.rotate(rotation)
  ctx.globalAlpha = alpha
  ctx.fillStyle = resolveCanvasColor(color)
  ctx.fillRect(-width / 2, -height / 2, width, height)
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 2
  ctx.strokeRect(-width / 2, -height / 2, width, height)
  ctx.restore()
}

function drawStickerText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation = 0
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = resolveCanvasColor(color)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${size}px "Press Start 2P", monospace`
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function drawFilmPerfs(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, count: number, horizontal: boolean) {
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1

  for (let i = 0; i < count; i++) {
    const step = horizontal ? width / count : height / count
    const perfX = horizontal ? x + i * step + step / 2 - 7 : x + width / 2 - 6
    const perfY = horizontal ? y + height / 2 - 6 : y + i * step + step / 2 - 7
    const perfW = horizontal ? 14 : 12
    const perfH = horizontal ? 12 : 14

    ctx.fillRect(perfX, perfY, perfW, perfH)
    ctx.strokeRect(perfX, perfY, perfW, perfH)
  }
}

function drawCornerBrackets(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = resolveCanvasColor('var(--ink)')
  ctx.lineWidth = 10

  const size = 36
  const edge = 7
  const points = [
    [edge, edge, edge + size, edge, edge, edge + size],
    [width - edge, edge, width - edge - size, edge, width - edge, edge + size],
    [edge, height - edge, edge + size, height - edge, edge, height - edge - size],
    [width - edge, height - edge, width - edge - size, height - edge, width - edge, height - edge - size],
  ]

  points.forEach(([x1, y1, x2, y2, x3, y3]) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.moveTo(x1, y1)
    ctx.lineTo(x3, y3)
    ctx.stroke()
  })
}

function drawCanvasStickers(ctx: CanvasRenderingContext2D, pack: StickerPackId, width: number, height: number) {
  if (pack === 'none') {
    return
  }

  if (pack === 'stars') {
    drawCenteredPixelPattern(ctx, STAR, { y: 'var(--mustard)', '.': 'transparent' }, 32, 30, 5)
    drawCenteredPixelPattern(ctx, STAR, { y: 'var(--burnt)', '.': 'transparent' }, width - 32, 30, 5)
    drawCenteredPixelPattern(ctx, STAR, { y: 'var(--mustard)', '.': 'transparent' }, 24, height - 24, 4)
    drawCenteredPixelPattern(ctx, STAR, { y: 'var(--olive)', '.': 'transparent' }, width - 24, height - 24, 4)
    drawCenteredPixelPattern(ctx, STAR, { y: 'var(--mustard)', '.': 'transparent' }, width / 2, 28, 6)
  }

  if (pack === 'hearts') {
    drawCenteredPixelPattern(ctx, HEART, { r: 'var(--burnt)', '.': 'transparent' }, 34, 30, 6)
    drawCenteredPixelPattern(ctx, HEART, { r: 'var(--burnt)', '.': 'transparent' }, width - 34, 30, 6)
    drawCenteredPixelPattern(ctx, HEART, { r: 'var(--mustard)', '.': 'transparent' }, 28, height - 28, 5)
    drawCenteredPixelPattern(ctx, HEART, { r: 'var(--mustard)', '.': 'transparent' }, width - 28, height - 28, 5)
    drawStickerText(ctx, 'XOXO', width / 2, height - 18, 10, 'var(--burnt)')
  }

  if (pack === 'confetti') {
    const pieces = [
      { x: 18, y: 12, w: 18, h: 18, c: 'var(--mustard)', r: 0.3 },
      { x: 54, y: 10, w: 13, h: 22, c: 'var(--burnt)', r: -0.4 },
      { x: 92, y: 14, w: 20, h: 13, c: 'var(--olive)', r: 0.5 },
      { x: width - 38, y: 12, w: 18, h: 18, c: 'var(--blue)', r: -0.2 },
      { x: width - 78, y: 10, w: 13, h: 22, c: 'var(--mustard)', r: 0.4 },
      { x: width - 118, y: 14, w: 20, h: 13, c: 'var(--burnt)', r: -0.5 },
      { x: 24, y: height - 30, w: 18, h: 18, c: 'var(--olive)', r: -0.3 },
      { x: 66, y: height - 30, w: 14, h: 22, c: 'var(--blue)', r: 0.35 },
      { x: width - 44, y: height - 30, w: 18, h: 18, c: 'var(--burnt)', r: 0.25 },
      { x: width - 90, y: height - 28, w: 22, h: 14, c: 'var(--mustard)', r: -0.45 },
      { x: 6, y: height * 0.25, w: 14, h: 14, c: 'var(--mustard)', r: 0.35 },
      { x: 8, y: height * 0.55, w: 18, h: 12, c: 'var(--blue)', r: -0.25 },
      { x: width - 22, y: height * 0.35, w: 14, h: 18, c: 'var(--burnt)', r: 0.2 },
      { x: width - 26, y: height * 0.68, w: 18, h: 12, c: 'var(--olive)', r: -0.35 },
    ]

    pieces.forEach(piece => drawRotatedRect(ctx, piece.x, piece.y, piece.w, piece.h, piece.c, piece.r))
  }

  if (pack === 'filmstrip') {
    ctx.fillStyle = resolveCanvasColor('var(--ink)')
    ctx.fillRect(0, 0, width, 24)
    ctx.fillRect(0, height - 24, width, 24)
    ctx.fillRect(0, 0, 24, height)
    ctx.fillRect(width - 24, 0, 24, height)
    drawFilmPerfs(ctx, 0, 0, width, 24, 12, true)
    drawFilmPerfs(ctx, 0, height - 24, width, 24, 12, true)
    drawFilmPerfs(ctx, 0, 0, 24, height, 12, false)
    drawFilmPerfs(ctx, width - 24, 0, 24, height, 12, false)
  }

  if (pack === 'gamer') {
    drawRotatedRect(ctx, width / 2 - 88, 8, 176, 28, 'var(--mustard)', 0, 1)
    drawStickerText(ctx, 'PLAYER 1', width / 2, 23, 11, 'var(--ink)')
    drawRotatedRect(ctx, width - 70, 16, 54, 36, 'var(--olive)', 0.12, 1)
    drawStickerText(ctx, '1UP', width - 43, 34, 13, 'var(--ivory)', 0.12)
    drawCenteredPixelPattern(ctx, MUSHROOM, { r: 'var(--burnt)', w: 'var(--ivory)', b: 'var(--ink)', '.': 'transparent' }, 36, height - 40, 5)
    drawStickerText(ctx, 'HI-SCORE', width / 2, height - 18, 10, 'var(--mustard)')
  }

  if (pack === 'retro') {
    drawCornerBrackets(ctx, width, height)
    drawStickerText(ctx, 'PIXEL PERFECT', width / 2, 18, 9, 'var(--burnt)', -0.03)
    drawStickerText(ctx, new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(), width / 2, height - 16, 8, 'var(--blue)', 0.03)
  }

  if (pack === 'bloom') {
    drawCenteredPixelPattern(ctx, FLOWER, { r: 'var(--burnt)', Y: 'var(--mustard)', '.': 'transparent' }, 32, 32, 7)
    drawCenteredPixelPattern(ctx, FLOWER, { r: 'var(--blue)', Y: 'var(--ivory)', '.': 'transparent' }, width - 32, 32, 7)
    drawCenteredPixelPattern(ctx, FLOWER, { r: 'var(--olive)', Y: 'var(--mustard)', '.': 'transparent' }, 32, height - 32, 7)
    drawCenteredPixelPattern(ctx, FLOWER, { r: 'var(--mustard)', Y: 'var(--ivory)', '.': 'transparent' }, width - 32, height - 32, 7)
    drawCenteredPixelPattern(ctx, FLOWER, { r: 'var(--burnt)', Y: 'var(--ivory)', '.': 'transparent' }, width / 2, 28, 6)
  }

  if (pack === 'tape') {
    drawRotatedRect(ctx, 20, 10, 78, 22, 'var(--mustard)', -0.12, 0.88)
    drawRotatedRect(ctx, width - 98, 12, 78, 22, 'var(--blue)', 0.1, 0.8)
    drawRotatedRect(ctx, 24, height - 34, 78, 22, 'var(--burnt)', 0.08, 0.82)
    drawRotatedRect(ctx, width - 102, height - 34, 78, 22, 'var(--olive)', -0.1, 0.8)
    drawRotatedRect(ctx, 0, height * 0.42, 46, 20, 'var(--mustard)', -0.04, 0.75)
    drawRotatedRect(ctx, width - 46, height * 0.42, 46, 20, 'var(--burnt)', 0.04, 0.75)
  }

  if (pack === 'glitter') {
    const sparks = [
      { x: 30, y: 22, c: 'var(--mustard)', s: 5 },
      { x: 78, y: 22, c: 'var(--ivory)', s: 4 },
      { x: width - 34, y: 24, c: 'var(--burnt)', s: 5 },
      { x: width - 82, y: 22, c: 'var(--blue)', s: 4 },
      { x: width / 2, y: 24, c: 'var(--mustard)', s: 6 },
      { x: 34, y: height - 24, c: 'var(--burnt)', s: 5 },
      { x: 86, y: height - 22, c: 'var(--mustard)', s: 4 },
      { x: width - 38, y: height - 24, c: 'var(--mustard)', s: 5 },
      { x: width - 88, y: height - 22, c: 'var(--ivory)', s: 4 },
      { x: 12, y: height * 0.2, c: 'var(--mustard)', s: 4 },
      { x: 12, y: height * 0.5, c: 'var(--blue)', s: 4 },
      { x: 12, y: height * 0.8, c: 'var(--burnt)', s: 4 },
      { x: width - 12, y: height * 0.2, c: 'var(--burnt)', s: 4 },
      { x: width - 12, y: height * 0.5, c: 'var(--mustard)', s: 4 },
      { x: width - 12, y: height * 0.8, c: 'var(--ivory)', s: 4 },
    ]

    sparks.forEach(spark => {
      drawCenteredPixelPattern(ctx, DIAMOND, { d: spark.c, '.': 'transparent' }, spark.x, spark.y, spark.s)
    })
  }
}

function isUploadResponse(value: unknown): value is { url: string } {
  return typeof value === 'object' && value !== null && 'url' in value && typeof value.url === 'string'
}

function isErrorResponse(value: unknown): value is { error: string } {
  return typeof value === 'object' && value !== null && 'error' in value && typeof value.error === 'string'
}

async function uploadBase64Asset(base64: string, folder: string): Promise<UploadedUrl> {
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, folder }),
  })
  const uploadData: unknown = await uploadResponse.json()

  if (!uploadResponse.ok || !isUploadResponse(uploadData)) {
    throw new Error('Upload failed')
  }

  return uploadData.url
}

function getDownloadUrl(url: string): string {
  if (!url.includes('/upload/')) {
    return url
  }

  return url.replace('/upload/', '/upload/fl_attachment:pixel-perfect-strip/')
}

async function drawSoloShotStrip(
  ctx: CanvasRenderingContext2D,
  shots: CapturedShot[],
  frameColor: string
) {
  const shot = shots[0]

  ctx.fillStyle = resolveCanvasColor(frameColor)
  ctx.fillRect(0, 0, SOLO_SHOT_BORDER.width, SOLO_SHOT_BORDER.height)

  if (shot?.dataUrl) {
    const image = await loadCanvasImage(shot.dataUrl)

    ctx.save()
    ctx.filter = FILTERS[shot.filter].css
    drawImageCover(
      ctx,
      image,
      SOLO_SHOT_BORDER.photo.x,
      SOLO_SHOT_BORDER.photo.y,
      SOLO_SHOT_BORDER.photo.width,
      SOLO_SHOT_BORDER.photo.height
    )
    ctx.restore()
  }

  const border = await loadCanvasImage(SOLO_SHOT_BORDER.src)
  ctx.drawImage(border, 0, 0, SOLO_SHOT_BORDER.width, SOLO_SHOT_BORDER.height)
}

export async function composeStrip(
  shots: CapturedShot[],
  layout: LayoutConfig,
  frameColor: string,
  stickerPack: StickerPackId,
  useSoloShotBorder = false
): Promise<string> {
  const { width, height } = getStripSize(layout, useSoloShotBorder)
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

  if (layout.id === 'S' && useSoloShotBorder) {
    await drawSoloShotStrip(ctx, shots, frameColor)
    return canvas.toDataURL('image/png')
  }

  ctx.fillStyle = resolveCanvasColor(frameColor)
  ctx.fillRect(0, 0, width, height)

  await Promise.all(shots.map((shot, index) => new Promise<void>((resolve) => {
    if (!shot.dataUrl) {
      resolve()
      return
    }

    loadCanvasImage(shot.dataUrl).then((image) => {
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
    }).catch(() => resolve())
  })))

  ctx.textAlign = 'center'
  ctx.fillStyle = resolveCanvasColor('var(--ivory)')
  ctx.font = '14px "Press Start 2P", monospace'
  ctx.fillText('PIXEL PERFECT', width / 2, height - 22)
  drawCanvasStickers(ctx, stickerPack, width, height)

  return canvas.toDataURL('image/png')
}

interface Props {
  shots: CapturedShot[]
  layout: LayoutConfig
  onRetake: () => void
  onPlayAgain: () => void
}

export function StripPreviewScreen({ shots, layout, onRetake, onPlayAgain }: Props) {
  const [soloShotStyle, setSoloShotStyle] = useState<SoloShotStyle>(layout.id === 'S' ? 'border' : 'default')
  const [frameColorId, setFrameColorId] = useState('ink')
  const [stickers, setStickers] = useState<StickerPackId>('stars')
  const [isUploading, setIsUploading] = useState(true)
  const [stripUrl, setStripUrl] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [printOpen, setPrintOpen] = useState(false)
  const [exportSelected, setExportSelected] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrError, setQrError] = useState<string | null>(null)
  const sessionSavedRef = useRef(false)
  const uploadRunRef = useRef(0)
  const photoUrlsRef = useRef<string[] | null>(null)
  const photoUploadPromiseRef = useRef<Promise<string[]> | null>(null)
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
  const usesSoloShotBorder = layout.id === 'S' && soloShotStyle === 'border'
  const soloPreviewWidth = isMobile ? 230 : 330
  const soloPreviewHeight = Math.round(soloPreviewWidth * SOLO_SHOT_BORDER.height / SOLO_SHOT_BORDER.width)
  const soloPhotoStyle = {
    position: 'absolute',
    left: `${(SOLO_SHOT_BORDER.photo.x / SOLO_SHOT_BORDER.width) * 100}%`,
    top: `${(SOLO_SHOT_BORDER.photo.y / SOLO_SHOT_BORDER.height) * 100}%`,
    width: `${(SOLO_SHOT_BORDER.photo.width / SOLO_SHOT_BORDER.width) * 100}%`,
    height: `${(SOLO_SHOT_BORDER.photo.height / SOLO_SHOT_BORDER.height) * 100}%`,
    overflow: 'hidden',
    background: 'var(--ink)',
  } satisfies CSSProperties

  const getUploadedPhotoUrls = useCallback((): Promise<string[]> => {
    if (photoUrlsRef.current) {
      return Promise.resolve(photoUrlsRef.current)
    }

    if (!photoUploadPromiseRef.current) {
      photoUploadPromiseRef.current = Promise.all(
        shots.map((shot, index) => (
          shot.dataUrl
            ? uploadBase64Asset(shot.dataUrl, `pixel-perfect/photos/${layout.id.toLowerCase()}`).then(url => ({ index, url }))
            : Promise.resolve(null)
        ))
      ).then((uploaded) => {
        const urls = uploaded
          .filter((item): item is { index: number; url: string } => item !== null)
          .sort((left, right) => left.index - right.index)
          .map(item => item.url)

        photoUrlsRef.current = urls
        return urls
      })
    }

    return photoUploadPromiseRef.current
  }, [layout.id, shots])

  useEffect(() => {
    const uploadRun = uploadRunRef.current + 1
    uploadRunRef.current = uploadRun

    async function saveStrip() {
      setIsUploading(true)
      setStripUrl(null)

      try {
        const dataUrl = await composeStrip(shots, layout, frame.value, stickers, usesSoloShotBorder)
        const [stripUrl, photoUrls] = await Promise.all([
          uploadBase64Asset(dataUrl, 'pixel-perfect/strips'),
          getUploadedPhotoUrls(),
        ])

        if (uploadRunRef.current !== uploadRun) {
          return
        }

        setStripUrl(stripUrl)

        if (!sessionSavedRef.current) {
          const sessionResponse = await fetch('/api/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              layout_id: layout.id,
              filter: shots[0]?.filter ?? 'none',
              photo_urls: photoUrls,
              strip_url: stripUrl,
              price: layout.price,
              status: 'completed',
              email: null,
            }),
          })

          if (!sessionResponse.ok) {
            throw new Error('Session save failed')
          }

          sessionSavedRef.current = true
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (uploadRunRef.current === uploadRun) {
          setIsUploading(false)
        }
      }
    }

    void saveStrip()
  }, [frame.value, getUploadedPhotoUrls, layout, shots, stickers, usesSoloShotBorder])

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
    if (isUploading || !stripUrl) {
      return
    }

    setPrintOpen(true)
  }

  function handlePrintClose() {
    setPrintOpen(false)
  }

  function handlePrintConfirmed() {
    setExportSelected(true)
  }

  function handleQrCode() {
    if (!stripUrl) {
      window.alert('Still uploading...')
      return
    }

    setQrOpen(true)
    setExportSelected(true)
  }

  function handleQrClose() {
    setQrOpen(false)
  }

  function handleEmailButton() {
    if (!emailSent) {
      setKeyboardOpen(true)
    }
  }

  function handleEmailChange(value: string) {
    setEmailInput(value)
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
      setExportSelected(true)
      return true
    } catch (error) {
      console.error(error)
      setEmailError(error instanceof Error ? error.message : 'Email failed')
      return false
    } finally {
      setEmailSending(false)
    }
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

  function handlePlayAgain() {
    if (exportSelected) {
      onPlayAgain()
    }
  }

  function getFrameColorClickHandler(id: string) {
    return function handleFrameColorClick() {
      setFrameColorId(id)
      setExportSelected(false)
    }
  }

  function getStickerClickHandler(id: StickerPackId) {
    return function handleStickerClick() {
      setStickers(id)
      setExportSelected(false)
    }
  }

  function getSoloShotStyleClickHandler(style: SoloShotStyle) {
    return function handleSoloShotStyleClick() {
      setSoloShotStyle(style)
      setExportSelected(false)
    }
  }
  return (
    <>
    {printOpen && stripUrl && (
      <PrintModal
        stripUrl={stripUrl}
        layout={layout}
        onClose={handlePrintClose}
        onPrint={handlePrintConfirmed}
      />
    )}
    {keyboardOpen && (
      <ArcadeKeyboard
        value={emailInput}
        onChange={handleEmailChange}
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
            {usesSoloShotBorder ? (
              <div style={{
                width: soloPreviewWidth,
                height: soloPreviewHeight,
                border: '4px solid var(--ink)',
                boxShadow: '10px 10px 0 var(--ink)',
                position: 'relative',
                overflow: 'hidden',
                background: frame.value,
              }}>
                <div style={soloPhotoStyle}>
                  {shots[0]?.dataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={shots[0].dataUrl}
                      alt="Solo shot"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        filter: FILTERS[shots[0].filter].css,
                      }}
                    />
                  ) : null}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SOLO_SHOT_BORDER.src}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            ) : (
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
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'PRINT', accent: 'var(--mustard)', onClick: handlePrint, disabled: isUploading || !stripUrl },
              { label: 'QR CODE', accent: 'var(--burnt)', onClick: handleQrCode, disabled: isUploading || !stripUrl },
              { label: 'EMAIL', accent: 'var(--blue)', onClick: handleEmailButton, disabled: emailSent },
              { label: 'RETAKE', accent: 'var(--ivory)', onClick: onRetake, disabled: false },
            ].map(btn => (
              <div
                key={btn.label}
                onClick={btn.disabled ? undefined : btn.onClick}
                style={{
                  cursor: btn.disabled ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
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
              {usesSoloShotBorder ? 'solo shot border ready — then take it home.' : 'pick a frame & sticker pack — then take it home.'}
            </div>
          </ArcadePanel>

          {layout.id === 'S' && (
            <ArcadePanel>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 11,
                color: 'var(--ink)',
                letterSpacing: '0.2em',
                marginBottom: 12,
              }}>
                ▸ STYLE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {([
                  { id: 'border', label: 'EXPO 2026 SPECIAL' },
                  { id: 'default', label: 'CUSTOMIZE' },
                ] satisfies Array<{ id: SoloShotStyle; label: string }>).map(option => {
                  const active = soloShotStyle === option.id
                  return (
                    <div
                      key={option.id}
                      onClick={getSoloShotStyleClickHandler(option.id)}
                      style={{
                        cursor: 'pointer',
                        padding: '10px 8px',
                        background: active ? 'var(--ink)' : 'var(--ivory)',
                        color: active ? 'var(--mustard)' : 'var(--ink)',
                        border: `3px solid ${active ? 'var(--mustard)' : 'var(--ink)'}`,
                        boxShadow: active ? '3px 3px 0 var(--mustard)' : '3px 3px 0 var(--ink)',
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        lineHeight: 1.5,
                      }}
                    >
                      {option.label}
                    </div>
                  )
                })}
              </div>
            </ArcadePanel>
          )}

          {!usesSoloShotBorder && (
            <>
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
                    onClick={getFrameColorClickHandler(c.id)}
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
                    onClick={getStickerClickHandler(s.id)}
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
            </>
          )}

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
            onClick={handlePlayAgain}
            style={{
              cursor: exportSelected ? 'pointer' : 'not-allowed',
              padding: '16px 22px',
              textAlign: 'center',
              background: 'var(--ink)',
              color: exportSelected ? 'var(--mustard)' : 'rgba(255,206,27,0.45)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              letterSpacing: '0.2em',
              border: '3px solid var(--mustard)',
              boxShadow: exportSelected ? '6px 6px 0 var(--mustard)' : '3px 3px 0 rgba(255,206,27,0.45)',
              opacity: exportSelected ? 1 : 0.65,
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
