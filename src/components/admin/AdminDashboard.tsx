'use client'

import { useEffect, useState } from 'react'
import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { LAYOUTS } from '@/lib/layouts'
import type { LayoutId, Session } from '@/types'

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

const POPULARITY_COLORS = [
  'var(--mustard)',
  'var(--burnt)',
  'var(--olive)',
  'var(--blue)',
  'var(--ink)',
  'var(--burnt)',
]

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSessionsResponse(v: unknown): v is { sessions: Session[] } {
  return (
    typeof v === 'object' &&
    v !== null &&
    'sessions' in v &&
    Array.isArray((v as Record<string, unknown>).sessions)
  )
}

export function AdminDashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions?limit=200')
        const data: unknown = await res.json()

        if (!res.ok || !isSessionsResponse(data)) {
          return
        }

        setSessions(data.sessions)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    void fetchSessions()
  }, [])

  const now = new Date()
  const todaySessions = sessions.filter(s => isSameDay(new Date(s.created_at), now))
  const revenueToday = todaySessions.reduce((acc, s) => acc + s.price, 0)
  const sharedCount = sessions.filter(s => s.email !== null).length
  const completedCount = sessions.filter(s => s.status === 'completed').length
  const completionRate = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0
  const recent = sessions.slice(0, 5)
  const hourlyCounts = Array.from({ length: 12 }, (_, index) => {
    const hour = index + 9

    return todaySessions.filter(s => new Date(s.created_at).getHours() === hour).length
  })
  const maxHourlyCount = Math.max(1, ...hourlyCounts)

  const layoutCounts = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.layout_id] = (acc[s.layout_id] ?? 0) + 1
    return acc
  }, {})
  const popularity = Object.entries(layoutCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  const maxCount = Math.max(1, popularity[0]?.[1] ?? 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard
          label="SESSIONS TODAY"
          value={loading ? '...' : String(todaySessions.length)}
          sub={loading ? '—' : `${sessions.length} total all-time`}
          accent="var(--mustard)"
        />
        <StatCard
          label="REVENUE TODAY"
          value={loading ? '...' : `₱${revenueToday.toLocaleString()}`}
          sub={loading ? '—' : todaySessions.length > 0 ? `avg ₱${Math.round(revenueToday / todaySessions.length)} / session` : 'no sessions yet'}
          accent="var(--burnt)"
        />
        <StatCard
          label="PHOTOS SHARED"
          value={loading ? '...' : String(sharedCount)}
          sub="via email"
          accent="var(--olive)"
        />
        <StatCard
          label="COMPLETION RATE"
          value={loading ? '...' : `${completionRate}%`}
          sub={loading ? 'â€”' : `${completedCount} completed sessions`}
          accent="var(--blue)"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: 16 }}>
        <AdminCard title="HOURLY SESSIONS · TODAY" accent="var(--mustard)">
          <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 6, paddingBottom: 0 }}>
            {hourlyCounts.map((count, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--ink)' }}>
                  {loading ? '...' : count}
                </div>
                <div style={{
                  width: '100%',
                  height: `${(count / maxHourlyCount) * 100}%`,
                  background: count === maxHourlyCount && count > 0 ? 'var(--burnt)' : 'var(--olive)',
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

        <AdminCard title="LAYOUT POPULARITY" accent="var(--burnt)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading && (
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, opacity: 0.5 }}>LOADING...</div>
            )}
            {!loading && popularity.length === 0 && (
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, opacity: 0.5 }}>NO DATA YET</div>
            )}
            {popularity.map(([layoutId, count], i) => {
              const label = LAYOUTS[layoutId as LayoutId]?.label ?? layoutId
              const pct = Math.round((count / maxCount) * 100)
              return (
                <div key={layoutId}>
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
                    <span>{count}</span>
                  </div>
                  <div style={{ height: 14, background: 'rgba(0,0,0,0.08)', border: '2px solid var(--ink)' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: POPULARITY_COLORS[i] ?? 'var(--ink)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </AdminCard>
      </div>

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
            {recent.map((s, i) => (
              <tr key={s.id} style={{
                background: i % 2 ? 'rgba(85,130,3,0.07)' : 'transparent',
                borderBottom: '1px dashed rgba(0,0,0,0.18)',
              }}>
                <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{s.id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: '10px 12px' }}>{LAYOUTS[s.layout_id as LayoutId]?.label ?? s.layout_id}</td>
                <td style={{ padding: '10px 12px' }}>{s.filter}</td>
                <td style={{ padding: '10px 12px' }}>{new Date(s.created_at).toLocaleTimeString()}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--burnt)', fontWeight: 'bold' }}>₱{s.price}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 8,
                    color: 'var(--ivory)',
                    background: s.status === 'completed' ? 'var(--olive)' : 'var(--burnt)',
                    padding: '3px 8px',
                    letterSpacing: '0.1em',
                  }}>
                    {s.status === 'completed' ? 'DONE' : 'ABANDONED'}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && recent.length === 0 && (
              <tr>
                <td colSpan={6} style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  padding: '24px 12px',
                  textAlign: 'center',
                  opacity: 0.5,
                }}>
                  NO SESSIONS YET
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  padding: '24px 12px',
                  textAlign: 'center',
                  opacity: 0.5,
                }}>
                  LOADING...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminCard>
    </div>
  )
}
