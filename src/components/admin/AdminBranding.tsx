import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'

function Field({ label, value, toggle, multiline }: { label: string; value: string; toggle?: boolean; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: 'var(--ink)',
        letterSpacing: '0.2em',
        opacity: 0.65,
        marginBottom: 5,
      }}>
        {label}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        border: '2px solid var(--ink)',
        padding: multiline ? '10px 12px' : '8px 12px',
        background: 'var(--ivory)',
        boxShadow: '2px 2px 0 var(--ink)',
        fontFamily: "'VT323', monospace",
        fontSize: 20,
        color: 'var(--ink)',
      }}>
        <span>{value}</span>
        {toggle ? (
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--ivory)',
            background: value === 'ON' ? 'var(--olive)' : 'var(--ink)',
            padding: '3px 8px',
            letterSpacing: '0.1em',
          }}>
            {value}
          </span>
        ) : (
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--burnt)',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}>
            EDIT ▸
          </span>
        )}
      </div>
    </div>
  )
}

const PALETTE = [
  { name: 'IVORY',   color: '#e8e6d8' },
  { name: 'BLUE',    color: '#5a82aa' },
  { name: 'OLIVE',   color: '#558203' },
  { name: 'BURNT',   color: '#c85500' },
  { name: 'MUSTARD', color: '#ffce1b' },
]

export function AdminBranding() {
  const { isMobile } = useBreakpoint()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
      <AdminCard title="STRIP BRANDING" accent="var(--mustard)">
        <Field label="HEADER TEXT"       value="★ PIXEL PERFECT ★" />
        <Field label="FOOTER TEXT"       value="pixelperfect.ph" />
        <Field label="SHOW DATE STAMP"   value="ON" toggle />
        <Field label="SHOW QR CODE"      value="ON" toggle />
        <Field label="WATERMARK OPACITY" value="70%" />
      </AdminCard>

      <AdminCard title="ACCENT PALETTE" accent="var(--burnt)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 18 }}>
          {PALETTE.map(({ name, color }) => (
            <div key={name} style={{
              padding: '10px 4px',
              border: '3px solid var(--ink)',
              background: color,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              letterSpacing: '0.1em',
              textAlign: 'center',
              color: color === '#ffce1b' || color === '#e8e6d8' ? 'var(--ink)' : 'var(--ivory)',
              lineHeight: 1.5,
            }}>
              {name}<br />
              <span style={{ opacity: 0.75 }}>{color}</span>
            </div>
          ))}
        </div>
        <Field label="DEFAULT FRAME"        value="INK" />
        <Field label="DEFAULT STICKER PACK" value="STARS" />
      </AdminCard>

      <AdminCard title="ATTRACT MARQUEE" accent="var(--olive)">
        <Field label="MARQUEE TEXT"   value="BOOK A SESSION • 4 PHOTOS FOR ₱200 • SMILE BIG" multiline />
        <Field label="TAGLINE"        value="GET YOUR FACE IN THE FRAME" />
        <Field label="ATTRACT LAYOUT" value="CABINET" />
      </AdminCard>

      <AdminCard title="LOGO & ASSETS" accent="var(--blue)">
        <div style={{
          height: 130,
          background: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid var(--ink)',
          marginBottom: 14,
        }}>
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 26,
              color: 'var(--ivory)',
              textShadow: '3px 3px 0 var(--mustard)',
            }}>
              PIXEL
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 20,
              color: 'var(--mustard)',
              marginTop: 4,
            }}>
              PERFECT
            </div>
          </div>
        </div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: 'var(--ink)',
          background: 'var(--mustard)',
          border: '3px solid var(--ink)',
          padding: '10px 0',
          textAlign: 'center',
          letterSpacing: '0.15em',
          cursor: 'pointer',
        }}>
          ▲ UPLOAD NEW LOGO
        </div>
      </AdminCard>
    </div>
  )
}
