'use client'

import { useEffect, useRef, useState } from 'react'
import { PixelArt } from '@/components/ui/PixelArt'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const MARQUEE_TEXT =
  'BOOK A SESSION • 4 PHOTOS FOR ₱200 • SMILE BIG • PIXEL PERFECT • SHARE INSTANTLY • SCAN TO START • '

const FLOATING_STRIPS: Array<{
  left: string
  delay: string
  dur: string
  rot: string
  colors: string[]
}> = [
  { left: '6%',  delay: '0s',   dur: '13s', rot: '-8deg', colors: ['var(--mustard)', 'var(--blue)',    'var(--burnt)',   'var(--olive)'] },
  { left: '20%', delay: '-5s',  dur: '16s', rot: '6deg',  colors: ['var(--blue)',    'var(--mustard)', 'var(--ink)',     'var(--burnt)'] },
  { left: '76%', delay: '-3s',  dur: '11s', rot: '-5deg', colors: ['var(--burnt)',   'var(--ivory)',   'var(--mustard)', 'var(--blue)']  },
  { left: '89%', delay: '-8s',  dur: '15s', rot: '7deg',  colors: ['var(--olive)',   'var(--burnt)',   'var(--mustard)', 'var(--ink)']   },
  { left: '52%', delay: '-10s', dur: '19s', rot: '-3deg', colors: ['var(--mustard)', 'var(--ink)',     'var(--blue)',    'var(--olive)'] },
]

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

const CAMERA = `
.....bbbbbbbb.....
....b........b....
...byyyyyyyyyy.b..
..b.bbbbbbbbb.b...
.bb..........bb...
.b.bb..www..bb.b..
.b.b..wwwww..b.b..
.b.b..wwwww..b.b..
.b.b...www...b.b..
.b.bb........bb.b.
.bb..........bb.b.
.b............b.b.
.bbbbbbbbbbbbbbbb.
..................
`

function PhotoStripMini({ frame = 0 }: { frame?: number }) {
  const colors = [
    { bg: 'var(--mustard)' },
    { bg: 'var(--blue)' },
    { bg: 'var(--burnt)' },
    { bg: 'var(--olive)' },
  ]
  return (
    <div style={{
      background: 'var(--ivory)',
      padding: '10px 8px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      transform: 'rotate(-8deg)',
      boxShadow: '4px 4px 0 var(--ink)',
      border: '2px solid var(--ink)',
    }}>
      {colors.map((c, i) => (
        <div key={i} style={{
          width: 56,
          height: 40,
          background: c.bg,
          border: '2px solid var(--ink)',
          outline: i === frame ? '2px solid var(--mustard)' : 'none',
          outlineOffset: 2,
        }} />
      ))}
      <div style={{
        marginTop: 4,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 6,
        color: 'var(--ink)',
        textAlign: 'center',
        letterSpacing: '0.15em',
      }}>
        ★ PIXEL PERFECT ★
      </div>
    </div>
  )
}

interface AttractScreenProps {
  onStart: () => void
  onAdminUnlock: () => void
}

export function AttractScreen({ onStart, onAdminUnlock }: AttractScreenProps) {
  const [demoFrame, setDemoFrame] = useState(0)
  const { isMobile } = useBreakpoint()
  const seqRef = useRef(0)
  const seqTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleArcadeButton(idx: number) {
    if (idx !== seqRef.current) {
      seqRef.current = idx === 0 ? 1 : 0
    } else {
      seqRef.current += 1
    }
    if (seqTimerRef.current) clearTimeout(seqTimerRef.current)
    seqTimerRef.current = setTimeout(() => { seqRef.current = 0 }, 3000)
    if (seqRef.current === 3) {
      seqRef.current = 0
      onAdminUnlock()
    }
  }

  useEffect(() => {
    const id = setInterval(() => setDemoFrame(f => (f + 1) % 4), 1800)
    return () => clearInterval(id)
  }, [])

  const repeated = (MARQUEE_TEXT + ' ★ ').repeat(6)

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 30%, #6e94b8 0%, var(--blue) 40%, #2f4d6c 100%)',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: 0,
      padding: 'min(3vw, 40px)',
    }}>

      {/* ── FLOATING BACKGROUND STRIPS ── */}
      {FLOATING_STRIPS.map((s, i) => (
        <div
          key={i}
          className="animate-float-up"
          style={{
            position: 'absolute',
            bottom: '-140px',
            left: s.left,
            background: 'var(--ivory)',
            padding: '6px 5px 10px',
            border: '2px solid rgba(26,26,20,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            zIndex: 0,
            pointerEvents: 'none',
            '--float-rot': s.rot,
            '--float-delay': s.delay,
            '--float-dur': s.dur,
          } as React.CSSProperties}
        >
          {s.colors.map((c, j) => (
            <div key={j} style={{ width: 30, height: 22, background: c }} />
          ))}
          <div style={{
            marginTop: 3,
            width: 30,
            textAlign: 'center',
            fontFamily: 'monospace',
            fontSize: 7,
            color: 'rgba(26,26,20,0.5)',
          }}>★</div>
        </div>
      ))}

      {/* ── TOP MARQUEE ── */}
      <div style={{
        background: 'var(--ink)',
        borderTop: '4px solid var(--ink)',
        borderBottom: '4px solid var(--mustard)',
        padding: '10px 0',
        overflow: 'hidden',
      }}>
        <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(11px, 1.1vw, 16px)',
            color: 'var(--mustard)',
            letterSpacing: '0.25em',
            paddingRight: 32,
          }}>
            {repeated}
          </span>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(11px, 1.1vw, 16px)',
            color: 'var(--mustard)',
            letterSpacing: '0.25em',
            paddingRight: 32,
          }}>
            {repeated}
          </span>
        </div>
      </div>

      {/* ── CENTER STAGE ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr minmax(420px, 720px) 1fr',
        alignItems: 'center',
        gap: isMobile ? 0 : 'min(3vw, 40px)',
        padding: isMobile ? '8px 0' : 'min(2vw, 24px) 0',
      }}>

        {/* Left side panel */}
        {isMobile ? null : <div style={{
          height: 'min(72vh, 640px)',
          background: 'var(--ivory)',
          border: '4px solid var(--ink)',
          boxShadow: '-6px 6px 0 var(--ink)',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            color: 'var(--ink)',
            letterSpacing: '0.2em',
            borderBottom: '2px dashed var(--ink)',
            paddingBottom: 10,
          }}>
            ▶ HOW TO PLAY
          </div>

          {[['01', 'TAP TO START'], ['02', 'PICK A LAYOUT'], ['03', 'SMILE & POSE'], ['04', 'GET YOUR STRIP']].map(([n, label]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: 'var(--mustard)',
                color: 'var(--ink)',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 12,
                padding: '8px',
                border: '2px solid var(--ink)',
              }}>
                {n}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 11,
                color: 'var(--ink)',
                letterSpacing: '0.15em',
              }}>
                {label}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 'auto',
            background: 'var(--blue)',
            color: 'var(--ivory)',
            padding: '10px 12px',
            fontFamily: "'VT323', monospace",
            fontSize: 22,
            lineHeight: 1.05,
            border: '3px solid var(--ink)',
          }}>
            ★ smile big ★<br />
            no retakes here
          </div>

          <div style={{ position: 'absolute', bottom: 8, right: 8, opacity: 0.85 }}>
            <PixelArt
              pattern={CAMERA}
              palette={{ b: 'var(--ink)', y: 'var(--mustard)', w: 'var(--ivory)', '.': 'transparent' }}
              scale={3}
            />
          </div>
        </div>}

        {/* Center CRT screen */}
        <div style={{
          background: 'var(--olive)',
          border: '8px solid var(--ink)',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.5), 10px 10px 0 var(--ink)',
          borderRadius: 18,
          position: 'relative',
          minHeight: isMobile ? 'calc(100vh - 200px)' : 460,
          overflow: 'hidden',
        }}>
          {/* Glass highlight */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.18), transparent 55%)',
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: 'min(3vw, 36px)',
            position: 'relative',
          }}>
            {/* Corner stars */}
            <div style={{ position: 'absolute', top: 16, left: 16, animation: 'star-twinkle 1.4s infinite' }}>
              <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={3} />
            </div>
            <div style={{ position: 'absolute', top: 16, right: 16, animation: 'star-twinkle 1.4s 0.5s infinite' }}>
              <PixelArt pattern={STAR} palette={{ y: 'var(--mustard)', '.': 'transparent' }} scale={3} />
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 24, animation: 'star-twinkle 1.4s 0.8s infinite' }}>
              <PixelArt pattern={STAR} palette={{ y: 'var(--burnt)', '.': 'transparent' }} scale={2} />
            </div>
            <div style={{ position: 'absolute', bottom: 16, right: 24, animation: 'star-twinkle 1.4s 0.2s infinite' }}>
              <PixelArt pattern={STAR} palette={{ y: 'var(--burnt)', '.': 'transparent' }} scale={2} />
            </div>

            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 'clamp(14px, 1.5vw, 22px)',
              color: 'var(--mustard)',
              letterSpacing: '0.4em',
              marginBottom: 8,
            }}>
              ★ PRESS START ★
            </div>

            {/* Big logo */}
            <div style={{ lineHeight: 1, position: 'relative' }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(28px, 4vw, 64px)',
                color: 'var(--ivory)',
                textShadow: '4px 4px 0 var(--ink), 8px 8px 0 var(--mustard)',
                letterSpacing: '0.04em',
              }}>
                PIXEL
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(20px, 3vw, 48px)',
                color: 'var(--mustard)',
                textShadow: '3px 3px 0 var(--ink)',
                letterSpacing: '0.04em',
                marginTop: 6,
              }}>
                PERFECT
              </div>
              <div style={{ height: 5, background: 'var(--ivory)', marginTop: 10, width: '100%' }} />
            </div>

            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 'clamp(10px, 1vw, 14px)',
              color: 'var(--ivory)',
              letterSpacing: '0.15em',
              marginTop: 18,
              opacity: 0.85,
            }}>
              GET YOUR FACE IN THE FRAME
            </div>

            {/* Demo strip */}
            <div style={{ marginTop: 28, display: 'flex', gap: 14, alignItems: 'center' }}>
              <PhotoStripMini frame={demoFrame} />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--mustard)', letterSpacing: '0.1em' }}>
                  4 PHOTOS
                </div>
                <div style={{ fontFamily: "'VT323', monospace", fontSize: 28, color: 'var(--ivory)', lineHeight: 1 }}>
                  one strip
                </div>
                <div style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: 'var(--ivory)', opacity: 0.8 }}>
                  every time
                </div>
              </div>
            </div>

            {/* TAP TO START */}
            <div
              onClick={onStart}
              className="animate-pulse-glow"
              style={{
                marginTop: 28,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 24px',
                background: 'var(--ink)',
                border: '3px solid var(--mustard)',
                boxShadow: '6px 6px 0 var(--mustard)',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--mustard)',
                border: '3px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'var(--ink)',
                boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.25)',
              }}>▶</div>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(12px, 1.3vw, 18px)',
                color: 'var(--mustard)',
                letterSpacing: '0.2em',
              }}>
                TAP TO START
              </span>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 'clamp(10px, 1vw, 14px)',
                color: 'var(--ivory)',
                opacity: 0.7,
              }}>
                ₱100–₱280
              </span>
            </div>
          </div>

          {/* Scanlines on CRT */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
            mixBlendMode: 'multiply',
            zIndex: 10,
          }} />
        </div>

        {/* Right side panel */}
        {isMobile ? null : <div style={{
          height: 'min(72vh, 640px)',
          background: 'var(--ivory)',
          border: '4px solid var(--ink)',
          boxShadow: '6px 6px 0 var(--ink)',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            color: 'var(--ink)',
            letterSpacing: '0.2em',
            borderBottom: '2px dashed var(--ink)',
            paddingBottom: 10,
          }}>
            ▶ RECENT BOOKINGS
          </div>

          {[
            ['Layout A',    '4 photos',  'var(--mustard)'],
            ['Traditional', '4 photos',  'var(--burnt)'],
            ['Layout D',    '6 photos',  'var(--olive)'],
            ['Single Shot', '1 photo',   'var(--blue)'],
            ['Layout B',    '3 photos',  'var(--ink)'],
          ].map(([name, sub, c], i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 10,
              alignItems: 'center',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              padding: '6px 0',
              borderBottom: '1px dashed rgba(0,0,0,0.2)',
            }}>
              <span style={{ color: c, fontWeight: 700 }}>{i + 1}.</span>
              <span>{name}</span>
              <span style={{ fontSize: 9, opacity: 0.65 }}>{sub}</span>
            </div>
          ))}

          <div style={{
            marginTop: 'auto',
            fontFamily: "'VT323', monospace",
            fontSize: 22,
            color: 'var(--ink)',
            opacity: 0.7,
            textAlign: 'center',
          }}>
            best smiles always
          </div>
        </div>}
      </div>

      {/* ── CONTROL DECK ── */}
      <div style={{
        background: 'var(--ink)',
        padding: isMobile ? '12px 16px' : '18px 28px',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'auto 1fr' : 'auto 1fr auto',
        alignItems: 'center',
        gap: isMobile ? 16 : 32,
        borderTop: '4px solid var(--mustard)',
      }}>
        {/* Joystick + buttons */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#0a0a08',
            border: '4px solid var(--mustard)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: 8,
              height: 32,
              background: 'var(--ivory)',
              position: 'absolute',
              top: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              border: '2px solid var(--ink)',
            }} />
            <div style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'var(--burnt)',
              border: '2px solid var(--ink)',
              position: 'absolute',
              top: -22,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3)',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['var(--burnt)', 'var(--mustard)', 'var(--olive)'] as const).map((c, i) => (
              <div key={i} onClick={() => handleArcadeButton(i)} style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: c,
                border: '3px solid var(--ink)',
                boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.3), 2px 2px 0 var(--mustard)',
                cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>

        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12,
          color: 'var(--mustard)',
          letterSpacing: '0.3em',
          textAlign: 'center',
        }}>
          ◀ ◀ ◀ &nbsp; SELECT YOUR LAYOUT &nbsp; ▶ ▶ ▶
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Power LED */}
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'var(--olive)',
            border: '2px solid var(--ink)',
            boxShadow: '0 0 8px var(--olive), 0 0 18px rgba(85,130,3,0.45)',
            flexShrink: 0,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: 'var(--mustard)',
              letterSpacing: '0.2em',
              opacity: 0.65,
            }}>
              CREDITS 01
            </div>
            <div
              className="animate-blink"
              onClick={onStart}
              style={{
                cursor: 'pointer',
                background: 'var(--burnt)',
                color: 'var(--ivory)',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                padding: '8px 14px',
                border: '3px solid var(--ivory)',
                letterSpacing: '0.12em',
                boxShadow: '3px 3px 0 var(--ink)',
              }}
            >
              ⊙ INSERT COIN
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen scanlines */}
      <div className="scanlines" />
    </div>
  )
}
