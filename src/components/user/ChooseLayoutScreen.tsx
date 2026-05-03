'use client'

import type { LayoutConfig, LayoutId } from '@/types'
import { LAYOUTS } from '@/lib/layouts'
import { FlowChrome } from '@/components/ui/FlowChrome'

function LayoutCard({ layout, selected, onClick }: { layout: LayoutConfig; selected: boolean; onClick: () => void }) {
  const slots = Array.from({ length: layout.count })
  const stripBg = layout.traditional ? 'var(--ink)' : 'var(--ivory)'
  const slotBg = layout.traditional ? 'var(--ink)' : '#0a0a08'
  const accent = 'var(--mustard)'
  const slotW = layout.single ? 130 : layout.columns === 2 ? 36 : 76
  const slotH = layout.single ? 90 : layout.count <= 2 ? 60 : layout.count >= 6 ? 36 : 44

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        transform: selected ? 'translateY(-6px)' : 'none',
        transition: 'transform 120ms',
      }}
    >
      <div style={{
        background: stripBg,
        padding: 10,
        border: `4px solid ${selected ? accent : 'var(--ink)'}`,
        boxShadow: selected
          ? `6px 6px 0 var(--ink), 0 0 0 4px ${accent}`
          : '6px 6px 0 var(--ink)',
        display: 'grid',
        gridTemplateColumns: `repeat(${layout.columns}, ${slotW}px)`,
        gap: 6,
        position: 'relative',
      }}>
        {slots.map((_, i) => (
          <div key={i} style={{
            width: slotW,
            height: slotH,
            background: slotBg,
            border: layout.traditional ? '1px solid var(--mustard)' : '1px solid var(--ink)',
          }} />
        ))}
        <div style={{
          gridColumn: `span ${layout.columns}`,
          textAlign: 'center',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 6,
          color: layout.traditional ? 'var(--mustard)' : 'var(--ink)',
          letterSpacing: '0.15em',
          marginTop: 4,
        }}>
          ★ PIXEL PERFECT ★
        </div>
      </div>

      <div style={{
        background: selected ? accent : 'var(--ivory)',
        border: '3px solid var(--ink)',
        padding: '8px 14px',
        textAlign: 'center',
        boxShadow: '3px 3px 0 var(--ink)',
        minWidth: 120,
      }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 11,
          color: 'var(--ink)',
          letterSpacing: '0.1em',
        }}>
          {layout.label.toUpperCase()}
        </div>
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 18,
          color: 'var(--ink)',
          opacity: 0.8,
          marginTop: 2,
        }}>
          {layout.subtitle}
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: 'var(--burnt)',
          marginTop: 4,
        }}>
          ₱{layout.price}
        </div>
      </div>
    </div>
  )
}

interface Props {
  chosen: LayoutId
  onChoose: (id: LayoutId) => void
  onContinue: () => void
  onBack: () => void
}

export function ChooseLayoutScreen({ chosen, onChoose, onContinue, onBack }: Props) {
  return (
    <FlowChrome step={2} total={4} title="CHOOSE LAYOUT" onBack={onBack}>
      <div style={{
        padding: 'min(3vw, 36px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(22px, 3vw, 36px)',
            color: 'var(--ivory)',
            textShadow: '3px 3px 0 var(--ink), 6px 6px 0 var(--mustard)',
          }}>
            CHOOSE YOUR LAYOUT
          </div>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 24,
            color: 'var(--ivory)',
            marginTop: 10,
            opacity: 0.9,
          }}>
            select a strip style — different counts, different vibes.
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: 22,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-end',
          maxWidth: 1200,
        }}>
          {Object.values(LAYOUTS).map(L => (
            <LayoutCard
              key={L.id}
              layout={L}
              selected={chosen === L.id}
              onClick={() => onChoose(L.id)}
            />
          ))}
        </div>

        <div
          onClick={onContinue}
          style={{
            marginTop: 6,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 28px',
            background: 'var(--ink)',
            color: 'var(--mustard)',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 16,
            letterSpacing: '0.2em',
            boxShadow: '6px 6px 0 var(--mustard)',
            border: '3px solid var(--mustard)',
          }}
        >
          CONTINUE <span style={{ animation: 'arrow-pulse 0.8s infinite' }}>▶</span>
        </div>
      </div>
    </FlowChrome>
  )
}
