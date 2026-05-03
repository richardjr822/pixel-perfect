import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const TIERS = [
  { name: 'SINGLE SHOT',  price: 100 },
  { name: 'LAYOUT A · 4', price: 200 },
  { name: 'LAYOUT B · 3', price: 180 },
  { name: 'LAYOUT C · 2', price: 150 },
  { name: 'LAYOUT D · 6', price: 280 },
  { name: 'TRADITIONAL',  price: 200 },
]

const PAYMENT_METHODS = [
  { name: 'GCASH',      status: 'ON',  sub: 'scan QR · instant' },
  { name: 'CARD',       status: 'ON',  sub: 'Visa / MC / Apple Pay' },
  { name: 'PAYMAYA',    status: 'ON',  sub: 'scan QR · instant' },
  { name: 'PROMO CODE', status: 'OFF', sub: 'discount events' },
]

export function AdminPricing() {
  const { isMobile } = useBreakpoint()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
      <AdminCard title="PRICE PER LAYOUT" accent="var(--mustard)">
        {TIERS.map((t, i) => (
          <div key={t.name} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto auto',
            gap: 14,
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: i < TIERS.length - 1 ? '1px dashed rgba(0,0,0,0.2)' : 'none',
          }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--ink)',
              letterSpacing: '0.1em',
            }}>
              {t.name}
            </div>
            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 20,
              color: 'var(--ink)',
              opacity: 0.65,
            }}>
              1× digital + share
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 16,
              color: 'var(--burnt)',
              background: 'var(--ivory)',
              border: '3px solid var(--ink)',
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: 90,
              boxShadow: '3px 3px 0 var(--mustard)',
            }}>
              ₱{t.price}
            </div>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              color: 'var(--burnt)',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}>
              EDIT ▸
            </span>
          </div>
        ))}
      </AdminCard>

      <AdminCard title="PAYMENT METHODS" accent="var(--olive)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PAYMENT_METHODS.map(m => (
            <div key={m.name}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                letterSpacing: '0.1em',
                border: '3px solid var(--ink)',
                padding: '8px 12px',
                background: m.status === 'ON' ? 'var(--mustard)' : 'var(--ivory)',
                color: 'var(--ink)',
                boxShadow: '3px 3px 0 var(--ink)',
              }}>
                <span>{m.name}</span>
                <span style={{ color: m.status === 'ON' ? 'var(--olive)' : 'var(--burnt)' }}>
                  ● {m.status}
                </span>
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 18,
                color: 'var(--ink)',
                opacity: 0.6,
                marginTop: 3,
                paddingLeft: 4,
              }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  )
}
