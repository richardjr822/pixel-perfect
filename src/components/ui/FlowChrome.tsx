'use client'

interface FlowChromeProps {
  children: React.ReactNode
  step: number
  total: number
  title: string
  onBack: () => void
  accent?: string
}

export function FlowChrome({ children, step, total, title, onBack, accent = 'var(--mustard)' }: FlowChromeProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--blue)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'VT323', monospace",
    }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--ink)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `4px solid ${accent}`,
        flexShrink: 0,
      }}>
        <div
          onClick={onBack}
          style={{
            cursor: 'pointer',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            color: 'var(--ivory)',
            letterSpacing: '0.2em',
          }}
        >
          ◀ BACK
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12,
          color: accent,
          letterSpacing: '0.3em',
        }}>
          {title}
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 11,
          color: 'var(--ivory)',
          letterSpacing: '0.2em',
        }}>
          STEP {step}/{total}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
