'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CapturedShot, FilterId, LayoutConfig } from '@/types'
import { FILTERS } from '@/lib/layouts'
import { SOLO_SHOT_BORDER } from '@/lib/borders'
import { FlowChrome } from '@/components/ui/FlowChrome'
import { ArcadePanel } from '@/components/ui/ArcadePanel'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const FILTER_IDS = Object.keys(FILTERS) as FilterId[]
const SOLO_SHOT_PHOTO_ASPECT = SOLO_SHOT_BORDER.photo.width / SOLO_SHOT_BORDER.photo.height

interface Props {
  layout: LayoutConfig
  countdownSec: 3 | 5 | 10
  setCountdownSec: (val: 3 | 5 | 10) => void
  photoFilter: FilterId
  setPhotoFilter: (val: FilterId) => void
  onDone: (shots: CapturedShot[]) => void
  onBack: () => void
}

export function CameraScreen({
  layout,
  countdownSec,
  setCountdownSec,
  photoFilter,
  setPhotoFilter,
  onDone,
  onBack,
}: Props) {
  const { isMobile } = useBreakpoint()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shotsRef = useRef<CapturedShot[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const [started, setStarted] = useState(false)
  const [shotIdx, setShotIdx] = useState(0)
  const [count, setCount] = useState<number>(countdownSec)
  const [flashing, setFlashing] = useState(false)
  const [shots, setShots] = useState<CapturedShot[]>([])
  const [cameraError, setCameraError] = useState<string | null>(null)
  const showSoloShotScope = layout.id === 'S'

  useEffect(() => { shotsRef.current = shots }, [shots])

  useEffect(() => {
    let active = true
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          aspectRatio: { ideal: 4 / 3 },
          facingMode: { ideal: 'user' },
        },
      })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(() => { if (active) setCameraError('Camera access denied. Please allow camera permissions.') })
    return () => {
      active = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const captureFrame = useCallback((): string => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return ''
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')!
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL('image/png')
  }, [])

  useEffect(() => {
    if (!started) return
    if (shotIdx >= layout.count) {
      const t = setTimeout(() => onDone(shotsRef.current), 600)
      return () => clearTimeout(t)
    }
    if (count > 0) {
      const id = setTimeout(() => setCount(c => c - 1), 900)
      return () => clearTimeout(id)
    }
    const dataUrl = captureFrame()
    const t0 = setTimeout(() => {
      setFlashing(true)
    }, 0)
    const t1 = setTimeout(() => {
      setShots(prev => [...prev, { dataUrl, filter: photoFilter, pose: shotIdx % 4 }])
    }, 200)
    const t2 = setTimeout(() => {
      setFlashing(false)
      setShotIdx(i => i + 1)
      setCount(countdownSec)
    }, 700)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [started, count, shotIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  function startSession() {
    setShots([])
    setShotIdx(0)
    setCount(countdownSec)
    setStarted(true)
  }

  return (
    <FlowChrome step={3} total={4} title="CAMERA" onBack={onBack}>
      <div style={{
        padding: isMobile ? '12px' : 'min(3vw, 36px)',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px',
        gap: isMobile ? 12 : 28,
        maxWidth: 1280,
        margin: '0 auto',
      }}>
        {/* LEFT — viewfinder */}
        <div>
          <div style={{
            display: 'inline-block',
            background: 'var(--mustard)',
            color: 'var(--ink)',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            letterSpacing: '0.2em',
            padding: '6px 12px',
            border: '3px solid var(--ink)',
            marginBottom: 14,
          }}>
            SELECTED: {layout.label.toUpperCase()} ({layout.count} PHOTO{layout.count !== 1 ? 'S' : ''})
          </div>

          {/* CRT viewfinder */}
          <div style={{
            background: 'var(--ink)',
            border: '8px solid var(--ink)',
            boxShadow: '8px 8px 0 var(--mustard)',
            borderRadius: 14,
            position: 'relative',
            aspectRatio: '4/3',
            overflow: 'hidden',
          }}>
            {cameraError ? (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--ink)',
                padding: 32,
              }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: 'var(--burnt)',
                  textAlign: 'center',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  lineHeight: 2,
                }}>
                  {cameraError}
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: FILTERS[photoFilter].css,
                  transform: 'scaleX(-1)',
                }}
              />
            )}

            {showSoloShotScope && !cameraError && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div style={{
                  width: `${SOLO_SHOT_PHOTO_ASPECT * 75}%`,
                  height: '100%',
                  maxWidth: '100%',
                  boxShadow: '0 0 0 999px rgba(0,0,0,0.7)',
                  borderLeft: '3px dashed rgba(255,206,27,0.85)',
                  borderRight: '3px dashed rgba(255,206,27,0.85)',
                  outline: '2px solid rgba(232,230,216,0.5)',
                  outlineOffset: -2,
                }} />
              </div>
            )}

            {/* HUD */}
            <div style={{
              position: 'absolute',
              top: 14,
              left: 14,
              zIndex: 2,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--mustard)',
              letterSpacing: '0.2em',
              textShadow: '2px 2px 0 var(--ink)',
            }}>
              ● REC
            </div>
            <div style={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 2,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ivory)',
              letterSpacing: '0.2em',
              textShadow: '2px 2px 0 var(--ink)',
            }}>
              SHOT {Math.min(shotIdx + 1, layout.count)} / {layout.count}
            </div>

            {/* Countdown */}
            {started && shotIdx < layout.count && count > 0 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div
                  key={`${shotIdx}-${count}`}
                  className="animate-coin"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 'clamp(120px, 18vw, 240px)',
                    color: 'var(--ivory)',
                    textShadow: '8px 8px 0 var(--ink), 16px 16px 0 var(--mustard)',
                  }}
                >
                  {count}
                </div>
              </div>
            )}

            {/* SMILE */}
            {started && shotIdx < layout.count && count === 0 && !flashing && (
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(60px, 9vw, 120px)',
                  color: 'var(--mustard)',
                  textShadow: '6px 6px 0 var(--ink)',
                  letterSpacing: '0.15em',
                }}>
                  SMILE!
                </div>
              </div>
            )}

            {/* Idle overlay */}
            {!started && (
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 4,
                background: 'rgba(0,0,0,0.55)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 'clamp(20px, 2.4vw, 30px)',
                  color: 'var(--mustard)',
                  letterSpacing: '0.2em',
                  textShadow: '4px 4px 0 var(--ink)',
                }}>
                  GET READY
                </div>
                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 24,
                  color: 'var(--ivory)',
                }}>
                  press START CAPTURE when you are ready
                </div>
              </div>
            )}

            {/* Flash */}
            {flashing && <div style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'var(--ivory)' }} />}

            {/* Scanlines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              zIndex: 6,
              pointerEvents: 'none',
              backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.25) 0px, rgba(0,0,0,0.25) 1px, transparent 1px, transparent 3px)',
              mixBlendMode: 'multiply',
            }} />
          </div>

          {/* Hidden capture canvas */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Filter row */}
          <div style={{ marginTop: 22 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ivory)',
              letterSpacing: '0.2em',
              marginBottom: 10,
            }}>
              ▸ CHOOSE A FILTER
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FILTER_IDS.map(id => {
                const active = photoFilter === id
                return (
                  <div
                    key={id}
                    onClick={() => setPhotoFilter(id)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px 12px',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      background: active ? 'var(--mustard)' : 'var(--ivory)',
                      color: 'var(--ink)',
                      border: '3px solid var(--ink)',
                      boxShadow: active ? '3px 3px 0 var(--ink)' : '2px 2px 0 var(--ink)',
                      transform: active ? 'translate(-1px,-1px)' : 'none',
                    }}
                  >
                    {FILTERS[id].label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Countdown selector */}
          <ArcadePanel>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
              marginBottom: 12,
            }}>
              ▸ COUNTDOWN
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {([3, 5, 10] as const).map(n => {
                const active = countdownSec === n
                return (
                  <div
                    key={n}
                    onClick={() => { if (!started) setCountdownSec(n) }}
                    style={{
                      flex: 1,
                      cursor: started ? 'not-allowed' : 'pointer',
                      padding: '12px 0',
                      textAlign: 'center',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 14,
                      background: active ? 'var(--ink)' : 'var(--ivory)',
                      color: active ? 'var(--mustard)' : 'var(--ink)',
                      border: '3px solid var(--ink)',
                      boxShadow: active ? '3px 3px 0 var(--mustard)' : '3px 3px 0 var(--ink)',
                      opacity: started && !active ? 0.4 : 1,
                    }}
                  >
                    {n}s
                  </div>
                )
              })}
            </div>
          </ArcadePanel>

          {/* Progress */}
          <ArcadePanel>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
              marginBottom: 12,
            }}>
              ▸ PROGRESS
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(layout.count, 6)}, 1fr)`,
              gap: 6,
            }}>
              {Array.from({ length: layout.count }).map((_, i) => {
                const done = i < shots.length
                const cur = i === shotIdx && started
                return (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      background: done ? 'var(--mustard)' : cur ? 'var(--olive)' : 'var(--ivory)',
                      border: '3px solid var(--ink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 12,
                      color: 'var(--ink)',
                      animation: cur ? 'blink 0.6s infinite' : 'none',
                    }}
                  >
                    {done ? '✓' : i + 1}
                  </div>
                )
              })}
            </div>
            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 22,
              color: 'var(--ink)',
              marginTop: 10,
              opacity: 0.75,
            }}>
              {shots.length} of {layout.count} captured
            </div>
          </ArcadePanel>

          {/* Start / capturing */}
          {!started ? (
            <div
              onClick={startSession}
              className="animate-blink-slow"
              style={{
                cursor: 'pointer',
                padding: '20px 24px',
                textAlign: 'center',
                background: 'var(--ink)',
                color: 'var(--mustard)',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 16,
                letterSpacing: '0.2em',
                border: '4px solid var(--mustard)',
                boxShadow: '6px 6px 0 var(--mustard)',
              }}
            >
              ▶ START CAPTURE<br />
              <span style={{ fontSize: 11, opacity: 0.8, letterSpacing: '0.15em' }}>
                ({layout.count} PHOTO{layout.count !== 1 ? 'S' : ''})
              </span>
            </div>
          ) : (
            <div style={{
              padding: '16px 22px',
              textAlign: 'center',
              background: 'var(--mustard)',
              color: 'var(--ink)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              letterSpacing: '0.2em',
              border: '4px solid var(--ink)',
              boxShadow: '6px 6px 0 var(--ink)',
            }}>
              ● CAPTURING…<br />
              <span style={{ fontSize: 10, opacity: 0.7, letterSpacing: '0.15em' }}>
                HOLD STILL — NO RETAKES
              </span>
            </div>
          )}
        </div>
      </div>
    </FlowChrome>
  )
}
