'use client'

import { useEffect, useState } from 'react'
import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { COUNTDOWN_OPTIONS, DEFAULT_SETTINGS, FILTERS } from '@/lib/layouts'
import type { FilterId, Session, SettingsRow } from '@/types'

const FILTER_IDS = Object.keys(FILTERS) as FilterId[]

function isSettingsResponse(v: unknown): v is { settings: SettingsRow } {
  return typeof v === 'object' && v !== null && 'settings' in v
}

function isSessionsResponse(v: unknown): v is { sessions: Session[] } {
  return typeof v === 'object' && v !== null && 'sessions' in v && Array.isArray((v as Record<string, unknown>).sessions)
}

export function AdminSettings() {
  const [countdown, setCountdown] = useState<3 | 5 | 10>(DEFAULT_SETTINGS.default_countdown)
  const [filter, setFilter] = useState<FilterId>(DEFAULT_SETTINGS.default_filter)
  const [autoShare, setAutoShare] = useState<boolean>(DEFAULT_SETTINGS.auto_share)
  const [settings, setSettings] = useState<SettingsRow | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [saving, setSaving] = useState(false)
  const [clearingHistory, setClearingHistory] = useState(false)
  const [cleared, setCleared] = useState(false)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [settingsRes, sessionsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/sessions?limit=200'),
        ])
        const settingsData: unknown = await settingsRes.json()
        const sessionsData: unknown = await sessionsRes.json()

        if (settingsRes.ok && isSettingsResponse(settingsData)) {
          const s = settingsData.settings
          setSettings(s)
          setCountdown(s.default_countdown ?? DEFAULT_SETTINGS.default_countdown)
          setFilter(s.default_filter ?? DEFAULT_SETTINGS.default_filter)
          setAutoShare(s.auto_share ?? DEFAULT_SETTINGS.auto_share)
        }

        if (sessionsRes.ok && isSessionsResponse(sessionsData)) {
          setSessions(sessionsData.sessions)
        }
      } catch (e) {
        console.error(e)
      }
    }

    void fetchSettings()
  }, [])

  async function saveSettings(patch: Partial<SettingsRow>) {
    setSaving(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data: unknown = await res.json()

      if (res.ok && isSettingsResponse(data)) {
        setSettings(data.settings)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  function handleCountdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = Number(e.target.value) as 3 | 5 | 10
    setCountdown(val)
    void saveSettings({ default_countdown: val })
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as FilterId
    setFilter(val)
    void saveSettings({ default_filter: val })
  }

  function handleAutoShareToggle() {
    const val = !autoShare
    setAutoShare(val)
    void saveSettings({ auto_share: val })
  }

  async function handleClearHistory() {
    if (!window.confirm('Delete ALL session records? This cannot be undone.')) {
      return
    }

    setClearingHistory(true)

    try {
      const res = await fetch('/api/sessions', { method: 'DELETE' })

      if (!res.ok) {
        throw new Error('Failed to clear history')
      }

      setSessions([])
      setCleared(true)
    } catch (e) {
      console.error(e)
      window.alert('Failed to clear history. Check the console.')
    } finally {
      setClearingHistory(false)
    }
  }

  const selectStyle: React.CSSProperties = {
    fontFamily: "'VT323', monospace",
    fontSize: 20,
    color: 'var(--ink)',
    background: 'var(--ivory)',
    border: '2px solid var(--ink)',
    padding: '4px 8px',
    cursor: 'pointer',
    outline: 'none',
  }
  const enabledLayouts = settings ? Object.values(settings.layouts_config).filter(layout => layout.enabled).length : 0
  const completedSessions = sessions.filter(session => session.status === 'completed').length
  const abandonedSessions = sessions.filter(session => session.status === 'abandoned').length
  const savedStrips = sessions.filter(session => session.strip_url !== null).length

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
      <AdminCard title="SESSION DEFAULTS" accent="var(--mustard)">
        {saving && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--mustard)', letterSpacing: '0.15em', marginBottom: 10 }}>
            SAVING...
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--ink)', letterSpacing: '0.2em', opacity: 0.65, marginBottom: 5 }}>
            DEFAULT COUNTDOWN
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
          }}>
            <select value={countdown} onChange={handleCountdownChange} style={selectStyle}>
              {COUNTDOWN_OPTIONS.map(v => (
                <option key={v} value={v}>{v} SECONDS</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--ink)', letterSpacing: '0.2em', opacity: 0.65, marginBottom: 5 }}>
            DEFAULT FILTER
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
          }}>
            <select value={filter} onChange={handleFilterChange} style={selectStyle}>
              {FILTER_IDS.map(id => (
                <option key={id} value={id}>{FILTERS[id].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--ink)', letterSpacing: '0.2em', opacity: 0.65, marginBottom: 5 }}>
            AUTO SHARE
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
            <span>{autoShare ? 'ON' : 'OFF'}</span>
            <span
              onClick={handleAutoShareToggle}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--ivory)',
                background: autoShare ? 'var(--olive)' : 'var(--ink)',
                padding: '3px 8px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              {autoShare ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="DATABASE SETTINGS" accent="var(--burnt)">
        {[
          { label: 'SETTINGS ROW', value: settings ? `ID ${settings.id}` : 'LOADING' },
          { label: 'ENABLED LAYOUTS', value: String(enabledLayouts) },
          { label: 'BRANDING LOGO', value: settings?.branding_config.logo_url ? 'UPLOADED' : 'NOT SET' },
          { label: 'DEFAULT FILTER', value: FILTERS[filter].label },
        ].map(({ label, value }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--ink)', letterSpacing: '0.2em', opacity: 0.65, marginBottom: 5 }}>
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
              opacity: 0.65,
            }}>
              <span>{value}</span>
            </div>
          </div>
        ))}
      </AdminCard>

      <AdminCard title="SESSION DATA" accent="var(--olive)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['TOTAL SESSIONS', String(sessions.length)],
            ['COMPLETED', String(completedSessions)],
            ['ABANDONED', String(abandonedSessions)],
            ['SAVED STRIPS', String(savedStrips)],
          ].map(([label, value]) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '2px solid var(--ink)',
              background: 'var(--ivory)',
              padding: '8px 12px',
            }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--ink)', letterSpacing: '0.1em' }}>
                {label}
              </span>
              <span style={{ fontFamily: "'VT323', monospace", fontSize: 22, color: 'var(--ink)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="DANGER ZONE" accent="var(--burnt)">
        <div style={{ fontFamily: "'VT323', monospace", fontSize: 20, color: 'var(--ink)', opacity: 0.75, marginBottom: 16 }}>
          actions here update Supabase records and cannot be undone.
        </div>
        <div
          onClick={clearingHistory ? undefined : handleClearHistory}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: cleared ? 'var(--ivory)' : 'var(--burnt)',
            background: cleared ? 'var(--olive)' : 'var(--ink)',
            border: `3px solid ${cleared ? 'var(--olive)' : 'var(--burnt)'}`,
            padding: '10px 14px',
            textAlign: 'center',
            letterSpacing: '0.1em',
            cursor: clearingHistory ? 'wait' : 'pointer',
            opacity: clearingHistory ? 0.6 : 1,
          }}
        >
          {clearingHistory ? 'CLEARING...' : cleared ? 'HISTORY CLEARED' : 'CLEAR BOOKING HISTORY'}
        </div>
      </AdminCard>
    </div>
  )
}
