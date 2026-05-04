'use client'

import { useState } from 'react'
import type { LayoutConfig } from '@/types'

const QUANTITIES = [1, 2, 3, 4] as const
type Quantity = (typeof QUANTITIES)[number]

interface Props {
  stripUrl: string
  layout: LayoutConfig
  onClose: () => void
  onPrint: () => void
}

export function PrintModal({ stripUrl, layout, onClose, onPrint }: Props) {
  const [quantity, setQuantity] = useState<Quantity>(1)
  const [printing, setPrinting] = useState(false)

  const isSingle = layout.id === 'S'
  const perPage = isSingle ? 1 : 2
  const stripWidth = isSingle ? '4in' : '2in'
  const sheets = Math.ceil(quantity / perPage)

  function handlePrint() {
    setPrinting(true)
    onPrint()

    const frame = document.createElement('div')
    frame.className = 'print-frame'

    for (let i = 0; i < quantity; i++) {
      const img = document.createElement('img')
      img.src = stripUrl
      img.alt = `Photo strip copy ${i + 1}`
      img.className = 'print-strip'
      img.style.width = stripWidth
      img.style.height = '6in'
      img.style.objectFit = 'contain'
      frame.appendChild(img)
    }

    document.body.appendChild(frame)

    window.onafterprint = () => {
      document.body.removeChild(frame)
      window.onafterprint = null
      setPrinting(false)
      onClose()
    }

    window.print()
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,26,20,0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--ivory)',
          border: '6px solid var(--ink)',
          boxShadow: '10px 10px 0 var(--mustard)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          maxWidth: 560,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'var(--ink)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 12,
            color: 'var(--mustard)',
            letterSpacing: '0.15em',
          }}>
            ▶ PRINT YOUR STRIP
          </div>
          <div
            onClick={onClose}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: 'var(--ivory)',
              cursor: 'pointer',
              padding: '5px 9px',
              border: '2px solid rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
              opacity: 0.75,
            }}
          >
            ✕
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', gap: 24, padding: '22px 24px', alignItems: 'flex-start' }}>
          {/* Strip preview */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: 'var(--ink)',
              letterSpacing: '0.2em',
              opacity: 0.6,
              marginBottom: 8,
            }}>
              PREVIEW
            </div>
            <div style={{
              border: '3px solid var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
              overflow: 'hidden',
              background: 'white',
              width: isSingle ? 120 : 80,
              height: isSingle ? 183 : 240,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stripUrl}
                alt="Strip preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>

          {/* Settings */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: 'var(--ink)',
                letterSpacing: '0.2em',
                opacity: 0.65,
                marginBottom: 10,
              }}>
                COPIES
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {QUANTITIES.map(q => (
                  <div
                    key={q}
                    onClick={() => setQuantity(q)}
                    style={{
                      width: 42,
                      height: 42,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 14,
                      background: quantity === q ? 'var(--ink)' : 'var(--ivory)',
                      color: quantity === q ? 'var(--mustard)' : 'var(--ink)',
                      border: `3px solid ${quantity === q ? 'var(--mustard)' : 'var(--ink)'}`,
                      boxShadow: quantity === q ? '3px 3px 0 var(--mustard)' : '3px 3px 0 var(--ink)',
                      cursor: 'pointer',
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'var(--ink)',
              border: '2px solid var(--mustard)',
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--mustard)',
                letterSpacing: '0.15em',
              }}>
                {isSingle ? '4"×6" · 1 STRIP/SHEET' : '4"×6" · 2 STRIPS/SHEET'}
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: 'var(--ivory)',
                lineHeight: 1.2,
              }}>
                {quantity} {quantity === 1 ? 'copy' : 'copies'} → {sheets} {sheets === 1 ? 'sheet' : 'sheets'}
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 16,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.2,
              }}>
                layout: {layout.label}
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{
          display: 'flex',
          gap: 10,
          padding: '0 24px 22px',
        }}>
          <div
            onClick={printing ? undefined : onClose}
            style={{
              flex: 1,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--ink)',
              background: 'var(--ivory)',
              border: '3px solid var(--ink)',
              boxShadow: '3px 3px 0 var(--ink)',
              padding: '12px 0',
              textAlign: 'center',
              letterSpacing: '0.12em',
              cursor: printing ? 'wait' : 'pointer',
              opacity: printing ? 0.5 : 1,
            }}
          >
            CANCEL
          </div>
          <div
            onClick={printing ? undefined : handlePrint}
            style={{
              flex: 2,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--ink)',
              background: printing ? 'rgba(255,206,27,0.5)' : 'var(--mustard)',
              border: '3px solid var(--ink)',
              boxShadow: printing ? 'none' : '4px 4px 0 var(--ink)',
              padding: '12px 0',
              textAlign: 'center',
              letterSpacing: '0.12em',
              cursor: printing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 14 }}>⊙</span>
            {printing ? 'OPENING PRINT...' : 'CONFIRM PRINT'}
          </div>
        </div>
      </div>
    </div>
  )
}
