interface AdminCardProps {
  title: string
  children: React.ReactNode
  accent?: string
}

export function AdminCard({ title, children, accent = 'var(--mustard)' }: AdminCardProps) {
  return (
    <div style={{
      background: 'var(--ivory)',
      border: '4px solid var(--ink)',
      boxShadow: `6px 6px 0 ${accent}`,
      padding: '20px 22px',
    }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 11,
        color: 'var(--ink)',
        letterSpacing: '0.2em',
        paddingBottom: 12,
        marginBottom: 16,
        borderBottom: '2px dashed var(--ink)',
      }}>
        ▸ {title}
      </div>
      {children}
    </div>
  )
}
