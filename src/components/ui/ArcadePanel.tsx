interface ArcadePanelProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function ArcadePanel({ children, style = {} }: ArcadePanelProps) {
  return (
    <div style={{
      background: 'var(--ivory)',
      border: '4px solid var(--ink)',
      boxShadow: '8px 8px 0 var(--ink)',
      padding: 28,
      ...style,
    }}>
      {children}
    </div>
  )
}
