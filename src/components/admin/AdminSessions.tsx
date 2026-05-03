import { AdminCard } from '@/components/ui/AdminCard'

const SESSIONS = [
  { id: '#10241', layout: 'Layout A',    filter: 'Vintage',   ts: '11:42 AM', price: '₱200', status: 'SHARED' },
  { id: '#10240', layout: 'Single Shot', filter: 'B&W',       ts: '11:38 AM', price: '₱100', status: 'SHARED' },
  { id: '#10239', layout: 'Layout D',    filter: 'Sepia',     ts: '11:31 AM', price: '₱280', status: 'SHARED' },
  { id: '#10238', layout: 'Traditional', filter: 'No Filter', ts: '11:24 AM', price: '₱200', status: 'SHARED' },
  { id: '#10237', layout: 'Layout B',    filter: 'Noir',      ts: '11:18 AM', price: '₱180', status: 'ABANDONED' },
  { id: '#10236', layout: 'Layout A',    filter: 'Vivid',     ts: '11:05 AM', price: '₱200', status: 'SHARED' },
  { id: '#10235', layout: 'Single Shot', filter: 'Sepia',     ts: '10:59 AM', price: '₱100', status: 'SHARED' },
]

const DATE_FILTERS = ['TODAY', 'WEEK', 'MONTH', 'ALL TIME']

export function AdminSessions() {
  return (
    <AdminCard title="ALL SESSIONS · FILTERS" accent="var(--mustard)">
      {/* Date filter buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {DATE_FILTERS.map((f, i) => (
          <div key={f} style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            letterSpacing: '0.15em',
            padding: '8px 14px',
            border: '3px solid var(--ink)',
            cursor: 'pointer',
            background: i === 0 ? 'var(--ink)' : 'var(--ivory)',
            color: i === 0 ? 'var(--mustard)' : 'var(--ink)',
          }}>
            {f}
          </div>
        ))}
      </div>

      <div style={{
        fontFamily: "'VT323', monospace",
        fontSize: 22,
        color: 'var(--ink)',
        marginBottom: 16,
        opacity: 0.8,
      }}>
        Showing 187 sessions · ₱18,420 in revenue · avg duration 0:48s
      </div>

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
          {SESSIONS.map((r, i) => (
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
                  background: r.status === 'SHARED' ? 'var(--olive)' : 'var(--burnt)',
                  padding: '3px 8px',
                  letterSpacing: '0.1em',
                }}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminCard>
  )
}
