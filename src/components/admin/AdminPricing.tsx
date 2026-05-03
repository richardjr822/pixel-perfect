'use client'

import { useEffect, useState } from 'react'
import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { DEFAULT_SETTINGS, LAYOUTS } from '@/lib/layouts'
import type { AdminSection, LayoutId, Session, SettingsRow } from '@/types'

const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[]

function isSettingsResponse(v: unknown): v is { settings: SettingsRow } {
  return typeof v === 'object' && v !== null && 'settings' in v
}

function isSessionsResponse(v: unknown): v is { sessions: Session[] } {
  return typeof v === 'object' && v !== null && 'sessions' in v && Array.isArray((v as Record<string, unknown>).sessions)
}

interface Props {
  onNavigate: (section: AdminSection) => void
}

export function AdminPricing({ onNavigate }: Props) {
  const [prices, setPrices] = useState<Record<LayoutId, number>>(() => {
    const init = {} as Record<LayoutId, number>

    for (const id of LAYOUT_IDS) {
      init[id] = DEFAULT_SETTINGS.layouts_config[id].price
    }

    return init
  })
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, sessionsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/sessions?limit=200'),
        ])
        const settingsData: unknown = await settingsRes.json()
        const sessionsData: unknown = await sessionsRes.json()

        if (settingsRes.ok && isSettingsResponse(settingsData) && settingsData.settings.layouts_config) {
          const updated = {} as Record<LayoutId, number>

          for (const id of LAYOUT_IDS) {
            updated[id] = settingsData.settings.layouts_config[id]?.price ?? LAYOUTS[id].price
          }

          setPrices(updated)
        }

        if (sessionsRes.ok && isSessionsResponse(sessionsData)) {
          setSessions(sessionsData.sessions)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  const revenueByLayout = LAYOUT_IDS.map(id => {
    const matchingSessions = sessions.filter(session => session.layout_id === id)
    const revenue = matchingSessions.reduce((sum, session) => sum + session.price, 0)

    return {
      id,
      label: LAYOUTS[id].label.toUpperCase(),
      sessions: matchingSessions.length,
      revenue,
    }
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
      <AdminCard title="PRICE PER LAYOUT" accent="var(--mustard)">
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 20,
          color: 'var(--ink)',
          opacity: 0.7,
          marginBottom: 16,
        }}>
          prices are managed in the Layouts tab and saved to Supabase.
        </div>
        {LAYOUT_IDS.map((id, i) => {
          const layout = LAYOUTS[id]
          return (
            <div key={id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 14,
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < LAYOUT_IDS.length - 1 ? '1px dashed rgba(0,0,0,0.2)' : 'none',
            }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'var(--ink)',
                letterSpacing: '0.1em',
              }}>
                {layout.label.toUpperCase()}
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: 'var(--ink)',
                opacity: 0.65,
              }}>
                {layout.count} photo{layout.count !== 1 ? 's' : ''} · digital + share
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
                opacity: loading ? 0.5 : 1,
              }}>
                ₱{prices[id] ?? '—'}
              </div>
            </div>
          )
        })}
        <div
          onClick={() => onNavigate('layouts')}
          style={{
            marginTop: 18,
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: 'var(--ivory)',
            background: 'var(--ink)',
            border: '3px solid var(--mustard)',
            padding: '10px 0',
            textAlign: 'center',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            boxShadow: '3px 3px 0 var(--mustard)',
          }}
        >
          EDIT PRICES IN LAYOUTS
        </div>
      </AdminCard>

      <AdminCard title="REVENUE BY LAYOUT" accent="var(--olive)">
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 20,
          color: 'var(--ink)',
          opacity: 0.7,
          marginBottom: 14,
        }}>
          calculated from saved sessions in Supabase.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {revenueByLayout.map(layout => (
            <div key={layout.id}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                letterSpacing: '0.1em',
                border: '3px solid var(--ink)',
                padding: '8px 12px',
                background: layout.sessions > 0 ? 'var(--mustard)' : 'var(--ivory)',
                color: 'var(--ink)',
                boxShadow: '3px 3px 0 var(--ink)',
              }}>
                <span>{layout.label}</span>
                <span style={{ color: layout.sessions > 0 ? 'var(--olive)' : 'var(--burnt)' }}>
                  ₱{layout.revenue.toLocaleString()}
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
                {loading ? 'loading...' : `${layout.sessions} session${layout.sessions === 1 ? '' : 's'} saved`}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  )
}
