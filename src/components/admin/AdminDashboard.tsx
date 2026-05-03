import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div style={{
      background: 'var(--ivory)',
      border: '4px solid var(--ink)',
      padding: '20px 22px',
      boxShadow: `6px 6px 0 ${accent}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9,
        color: 'var(--ink)',
        letterSpacing: '0.2em',
        opacity: 0.7,
        marginBottom: 10,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 26,
        color: 'var(--ink)',
        textShadow: `3px 3px 0 ${accent}`,
        lineHeight: 1,
        marginBottom: 8,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'VT323', monospace",
        fontSize: 20,
        color: 'var(--ink)',
        opacity: 0.7,
      }}>
        {sub}
      </div>
    </div>
  )
}

const RECENT = [
  { id: '#10241', layout: 'Layout A',    filter: 'Vintage',   ts: '11:42 AM', price: '₱200' },
  { id: '#10240', layout: 'Single Shot', filter: 'B&W',       ts: '11:38 AM', price: '₱100' },
  { id: '#10239', layout: 'Layout D',    filter: 'Sepia',     ts: '11:31 AM', price: '₱280' },
  { id: '#10238', layout: 'Traditional', filter: 'No Filter', ts: '11:24 AM', price: '₱200' },
  { id: '#10237', layout: 'Layout B',    filter: 'Noir',      ts: '11:18 AM', price: '₱180' },
]

const PEAK_HOURS = [3, 5, 8, 12, 18, 24, 31, 28, 22, 17, 12, 9]

const POPULARITY = [
  { label: 'Layout A · 4 pose', pct: 62, color: 'var(--mustard)' },
  { label: 'Single Shot',       pct: 48, color: 'var(--burnt)' },
  { label: 'Traditional',       pct: 34, color: 'var(--olive)' },
  { label: 'Layout D · 6 pose', pct: 22, color: 'var(--blue)' },
  { label: 'Layout B · 3 pose', pct: 18, color: 'var(--ink)' },
  { label: 'Layout C · 2 pose', pct: 14, color: 'var(--burnt)' },
]

export function AdminDashboard() {
  const { isMobile } = useBreakpoint()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="SESSIONS TODAY"  value="187"      sub="+24 vs yesterday"     accent="var(--mustard)" />
        <StatCard label="REVENUE TODAY"   value="₱18,420"  sub="avg ₱220 / session"   accent="var(--burnt)" />
        <StatCard label="PHOTOS SHARED"   value="142"      sub="via link / QR / email" accent="var(--olive)" />
        <StatCard label="UPTIME"          value="99.7%"    sub="14 days running"       accent="var(--blue)" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 16 }}>
        {/* Hourly bar chart */}
        <AdminCard title="HOURLY SESSIONS · TODAY" accent="var(--mustard)">
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 0 }}>
            {PEAK_HOURS.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  color: 'var(--ink)',
                }}>
                  {h}
                </div>
                <div style={{
                  width: '100%',
                  height: `${(h / 35) * 100}%`,
                  background: i === 6 ? 'var(--burnt)' : 'var(--olive)',
                  border: '2px solid var(--ink)',
                }} />
              </div>
            ))}
          </div>
          <div style={{
            borderTop: '2px solid var(--ink)',
            marginTop: 8,
            paddingTop: 6,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--ink)',
            opacity: 0.7,
          }}>
            <span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span>
          </div>
        </AdminCard>

        {/* Layout popularity */}
        <AdminCard title="LAYOUT POPULARITY · 7 DAYS" accent="var(--burnt)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {POPULARITY.map(({ label, pct, color }) => (
              <div key={label}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: 'var(--ink)',
                  letterSpacing: '0.1em',
                  marginBottom: 4,
                }}>
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div style={{
                  height: 14,
                  background: 'rgba(0,0,0,0.08)',
                  border: '2px solid var(--ink)',
                }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color }} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Recent sessions */}
      <AdminCard title="RECENT SESSIONS" accent="var(--olive)">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'VT323', monospace", fontSize: 20, color: 'var(--ink)' }}>
          <thead>
            <tr style={{ background: 'var(--ink)' }}>
              {['SESSION', 'LAYOUT', 'FILTER', 'TIME', 'PAID', 'STATUS'].map((h, i) => (
                <th key={h} style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: 'var(--mustard)',
                  padding: '10px 12px',
                  letterSpacing: '0.2em',
                  textAlign: i >= 4 ? 'center' : 'left',
                  fontWeight: 'normal',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT.map((r, i) => (
              <tr key={r.id} style={{
                background: i % 2 ? 'rgba(85,130,3,0.07)' : 'transparent',
                borderBottom: '1px dashed rgba(0,0,0,0.18)',
              }}>
                <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{r.id}</td>
                <td style={{ padding: '10px 12px' }}>{r.layout}</td>
                <td style={{ padding: '10px 12px' }}>{r.filter}</td>
                <td style={{ padding: '10px 12px' }}>{r.ts}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--burnt)', fontWeight: 'bold' }}>{r.price}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: 'var(--ivory)',
                    background: 'var(--olive)',
                    padding: '3px 8px',
                    letterSpacing: '0.1em',
                  }}>
                    SHARED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
