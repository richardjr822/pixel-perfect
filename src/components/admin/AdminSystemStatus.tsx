import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const SYSTEMS = [
  { n: 'WEB CAMERA',    s: 'ONLINE', d: 'getUserMedia · 1080p · 30fps',           c: 'var(--olive)' },
  { n: 'PHOTO STORAGE', s: 'ONLINE', d: 'Cloudinary · 64% used · auto-prune 30d', c: 'var(--olive)' },
  { n: 'CDN',           s: 'ONLINE', d: 'global · 42ms avg · 99.99% uptime',       c: 'var(--olive)' },
  { n: 'PAYMENTS API',  s: 'ATTN',   d: 'GCash · 1 pending webhook retry',         c: 'var(--burnt)' },
  { n: 'DATABASE',      s: 'ONLINE', d: 'Supabase Postgres · 18ms p95 · 2.4GB',    c: 'var(--olive)' },
  { n: 'EMAIL / SMS',   s: 'ONLINE', d: 'Gmail · share links · 187 sent today',    c: 'var(--olive)' },
]

export function AdminSystemStatus() {
  const { isMobile } = useBreakpoint()
  return (
    <AdminCard title="SYSTEM STATUS" accent="var(--burnt)">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        {SYSTEMS.map(it => (
          <div key={it.n} style={{
            padding: '16px',
            background: 'var(--ivory)',
            border: '3px solid var(--ink)',
            boxShadow: `4px 4px 0 ${it.c}`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'var(--ink)',
                letterSpacing: '0.1em',
              }}>
                {it.n}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--ivory)',
                background: it.c,
                padding: '4px 8px',
                letterSpacing: '0.1em',
              }}>
                ● {it.s}
              </div>
            </div>
            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 20,
              color: 'var(--ink)',
              opacity: 0.75,
              lineHeight: 1.3,
            }}>
              {it.d}
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}
