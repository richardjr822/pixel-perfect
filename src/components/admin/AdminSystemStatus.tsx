'use client'

import { useEffect, useState } from 'react'
import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import type { Session, SettingsRow } from '@/types'

interface StatusItem {
  name: string
  status: 'ONLINE' | 'ATTN'
  detail: string
}

function isSettingsResponse(v: unknown): v is { settings: SettingsRow } {
  return typeof v === 'object' && v !== null && 'settings' in v
}

function isSessionsResponse(v: unknown): v is { sessions: Session[] } {
  return typeof v === 'object' && v !== null && 'sessions' in v && Array.isArray((v as Record<string, unknown>).sessions)
}

export function AdminSystemStatus() {
  const [settings, setSettings] = useState<SettingsRow | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [settingsOnline, setSettingsOnline] = useState(false)
  const [sessionsOnline, setSessionsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    async function fetchStatus() {
      try {
        const [settingsRes, sessionsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/sessions?limit=200'),
        ])
        const settingsData: unknown = await settingsRes.json()
        const sessionsData: unknown = await sessionsRes.json()

        if (settingsRes.ok && isSettingsResponse(settingsData)) {
          setSettings(settingsData.settings)
          setSettingsOnline(true)
        }

        if (sessionsRes.ok && isSessionsResponse(sessionsData)) {
          setSessions(sessionsData.sessions)
          setSessionsOnline(true)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    void fetchStatus()
  }, [])

  const completed = sessions.filter(session => session.status === 'completed').length
  const abandoned = sessions.filter(session => session.status === 'abandoned').length
  const shared = sessions.filter(session => session.email !== null).length
  const storedStrips = sessions.filter(session => session.strip_url !== null).length
  const enabledLayouts = settings ? Object.values(settings.layouts_config).filter(layout => layout.enabled).length : 0
  const totalRevenue = sessions.reduce((sum, session) => sum + session.price, 0)
  const items: StatusItem[] = [
    {
      name: 'DATABASE',
      status: sessionsOnline ? 'ONLINE' : 'ATTN',
      detail: loading ? 'checking sessions table...' : `${sessions.length} sessions loaded`,
    },
    {
      name: 'SETTINGS',
      status: settingsOnline ? 'ONLINE' : 'ATTN',
      detail: loading ? 'checking settings row...' : settings ? `${enabledLayouts} layouts enabled` : 'settings unavailable',
    },
    {
      name: 'SESSION FLOW',
      status: completed > 0 || sessions.length === 0 ? 'ONLINE' : 'ATTN',
      detail: `${completed} completed · ${abandoned} abandoned`,
    },
    {
      name: 'PHOTO STORAGE',
      status: storedStrips > 0 || sessions.length === 0 ? 'ONLINE' : 'ATTN',
      detail: `${storedStrips} saved strip link${storedStrips === 1 ? '' : 's'}`,
    },
    {
      name: 'EMAIL SHARING',
      status: shared > 0 || sessions.length === 0 ? 'ONLINE' : 'ATTN',
      detail: `${shared} emailed session${shared === 1 ? '' : 's'}`,
    },
    {
      name: 'REVENUE DATA',
      status: sessionsOnline ? 'ONLINE' : 'ATTN',
      detail: `₱${totalRevenue.toLocaleString()} recorded`,
    },
  ]

  return (
    <AdminCard title="SYSTEM STATUS" accent="var(--burnt)">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
        {items.map(it => {
          const color = it.status === 'ONLINE' ? 'var(--olive)' : 'var(--burnt)'

          return (
            <div key={it.name} style={{
              padding: '16px',
              background: 'var(--ivory)',
              border: '3px solid var(--ink)',
              boxShadow: `4px 4px 0 ${color}`,
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
                  {it.name}
                </div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: 'var(--ivory)',
                  background: color,
                  padding: '4px 8px',
                  letterSpacing: '0.1em',
                }}>
                  ● {it.status}
                </div>
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 20,
                color: 'var(--ink)',
                opacity: 0.75,
                lineHeight: 1.3,
              }}>
                {it.detail}
              </div>
            </div>
          )
        })}
      </div>
    </AdminCard>
  )
}
