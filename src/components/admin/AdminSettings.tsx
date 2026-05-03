import { AdminCard } from '@/components/ui/AdminCard'

function Field({ label, value, toggle }: { label: string; value: string; toggle?: boolean }) {
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
        padding: '8px 12px',
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

const HOURS = [
  ['MON–THU', '10:00 — 22:00'],
  ['FRI',     '10:00 — 02:00'],
  ['SAT',     '11:00 — 02:00'],
  ['SUN',     '11:00 — 21:00'],
]

const DANGER_ACTIONS = ['CLEAR BOOKING HISTORY', 'WIPE PHOTO ARCHIVE', 'FACTORY RESET']

export function AdminSettings() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <AdminCard title="SESSION DEFAULTS" accent="var(--mustard)">
        <Field label="DEFAULT COUNTDOWN"   value="3 SECONDS" />
        <Field label="DEFAULT FILTER"      value="NO FILTER" />
        <Field label="MAX RETRIES"         value="0 (no retakes)" />
        <Field label="AUTO SHARE"          value="ON" toggle />
        <Field label="DELETE PHOTOS AFTER" value="30 DAYS" />
      </AdminCard>

      <AdminCard title="ACCESS & SECURITY" accent="var(--burnt)">
        <Field label="ADMIN PIN"         value="••••" />
        <Field label="LOCK SCREEN AFTER" value="60s IDLE" />
        <Field label="REMOTE ACCESS"     value="ON" toggle />
        <Field label="USAGE TELEMETRY"   value="ON" toggle />
      </AdminCard>

      <AdminCard title="OPENING HOURS" accent="var(--olive)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HOURS.map(([day, hours]) => (
            <div key={day} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid var(--ink)',
              background: 'var(--ivory)',
              padding: '8px 12px',
            }}>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: 'var(--ink)',
                letterSpacing: '0.1em',
              }}>
                {day}
              </span>
              <span style={{
                fontFamily: "'VT323', monospace",
                fontSize: 22,
                color: 'var(--ink)',
              }}>
                {hours}
              </span>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="DANGER ZONE" accent="var(--burnt)">
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 20,
          color: 'var(--ink)',
          opacity: 0.75,
          marginBottom: 16,
        }}>
          actions here cannot be undone — proceed with caution.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DANGER_ACTIONS.map(a => (
            <div key={a} style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 9,
              color: 'var(--burnt)',
              background: 'var(--ink)',
              border: '3px solid var(--burnt)',
              padding: '10px 14px',
              textAlign: 'center',
              letterSpacing: '0.1em',
              cursor: 'pointer',
            }}>
              ▲ {a}
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  )
}
