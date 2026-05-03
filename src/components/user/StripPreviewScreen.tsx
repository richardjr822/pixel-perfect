'use client'

import { useState } from 'react'
import type { CapturedShot, LayoutConfig } from '@/types'
import { FILTERS } from '@/lib/layouts'
import { FlowChrome } from '@/components/ui/FlowChrome'
import { ArcadePanel } from '@/components/ui/ArcadePanel'
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

const FRAME_COLORS = [
  { id: 'ink',     label: 'BLACK',   value: 'var(--ink)',     fg: 'var(--ivory)' },
  { id: 'ivory',   label: 'IVORY',   value: 'var(--ivory)',   fg: 'var(--ink)' },
  { id: 'blue',    label: 'BLUE',    value: 'var(--blue)',    fg: 'var(--ivory)' },
  { id: 'olive',   label: 'OLIVE',   value: 'var(--olive)',   fg: 'var(--ivory)' },
  { id: 'burnt',   label: 'BURNT',   value: 'var(--burnt)',   fg: 'var(--ivory)' },
  { id: 'mustard', label: 'MUSTARD', value: 'var(--mustard)', fg: 'var(--ink)' },
]

const STICKER_PACKS = [
  { id: 'none',   label: 'NONE' },
  { id: 'stars',  label: 'STARS' },
  { id: 'hearts', label: 'HEARTS' },
  { id: 'arcade', label: 'ARCADE' },
  { id: '1up',    label: '1-UP' },
  { id: 'tape',   label: 'WASHI TAPE' },
]

function StickerOverlay({ pack }: { pack: string }) {
  if (pack === 'none') return null
  if (pack === 'stars') return (
    <>
      <div style={{ position: 'absolute', top: -10, left: -10, animation: 'star-twinkle 1.4s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{ position: 'absolute', top: -10, right: -10, animation: 'star-twinkle 1.4s 0.3s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--burnt)', '.': 'transparent' }} scale={3} />
      </div>
      <div style={{ position: 'absolute', bottom: -10, left: -10, animation: 'star-twinkle 1.4s 0.6s infinite' }}>
        <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={3} />
      </div>
    </>
  )
  if (pack === 'hearts') return (
    <>
      <div style={{ position: 'absolute', top: -8, right: -8 }}>
        <PixelArt pattern={HEART} palette={{ r: 'var(--burnt)', '.': 'transparent' }} scale={4} />
      </div>
      <div style={{ position: 'absolute', bottom: -8, left: -8 }}>
        <PixelArt pattern={HEART} palette={{ r: 'var(--burnt)', '.': 'transparent' }} scale={4} />
      </div>
    </>
  )
  if (pack === 'arcade') return (
    <div style={{
      position: 'absolute',
      top: -16,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--ink)',
      color: 'var(--mustard)',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: 9,
      padding: '4px 10px',
      border: '2px solid var(--mustard)',
      letterSpacing: '0.2em',
      whiteSpace: 'nowrap',
    }}>
      ★ KEEPSAKE ★
    </div>
  )
  if (pack === '1up') return (
    <div style={{
      position: 'absolute',
      top: -14,
      right: -14,
      background: 'var(--olive)',
      color: 'var(--ivory)',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: 10,
      padding: '6px 8px',
      border: '3px solid var(--ink)',
      boxShadow: '3px 3px 0 var(--ink)',
      transform: 'rotate(8deg)',
    }}>
      1UP
    </div>
  )
  if (pack === 'tape') return (
    <>
      <div style={{
        position: 'absolute',
        top: -10,
        left: 20,
        width: 60,
        height: 18,
        background: 'var(--mustard)',
        opacity: 0.85,
        transform: 'rotate(-4deg)',
        border: '1px dashed rgba(0,0,0,0.3)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -10,
        right: 20,
        width: 60,
        height: 18,
        background: 'var(--burnt)',
        opacity: 0.85,
        transform: 'rotate(3deg)',
        border: '1px dashed rgba(0,0,0,0.3)',
      }} />
    </>
  )
  return null
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
  const { isMobile } = useBreakpoint()

  const frame = FRAME_COLORS.find(f => f.id === frameColorId) ?? FRAME_COLORS[0]

  const cols = layout.columns
  const slotW = isMobile
    ? (layout.single ? 220 : cols === 2 ? 80 : 140)
    : (layout.single ? 360 : cols === 2 ? 110 : 200)
  const slotH = isMobile
    ? (layout.single ? 160 : layout.count <= 2 ? 120 : layout.count >= 6 ? 80 : 100)
    : (layout.single ? 260 : layout.count <= 2 ? 180 : layout.count >= 6 ? 110 : 150)

  return (
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

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '⎙', label: 'PRINT',   accent: 'var(--mustard)', onClick: () => window.print() },
              { icon: '◊', label: 'QR CODE', accent: 'var(--burnt)',   onClick: undefined },
              { icon: '↻', label: 'RETAKE',  accent: 'var(--ivory)',   onClick: onRetake },
            ].map(btn => (
              <div
                key={btn.label}
                onClick={btn.onClick}
                style={{
                  cursor: 'pointer',
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
                }}
              >
                <span style={{ color: btn.accent === 'var(--ivory)' ? 'var(--ink)' : btn.accent, fontSize: 12 }}>
                  {btn.icon}
                </span>
                {btn.label}
              </div>
            ))}
          </div>
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
  )
}
