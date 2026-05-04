'use client'

import { useEffect, useState } from 'react'
import type { AdminSection, Session, SettingsRow } from '@/types'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { AdminDashboard } from './AdminDashboard'
import { AdminSessions } from './AdminSessions'
import { AdminLayouts } from './AdminLayouts'
import { AdminBranding } from './AdminBranding'
import { AdminPricing } from './AdminPricing'
import { AdminSystemStatus } from './AdminSystemStatus'
import { AdminSettings } from './AdminSettings'

const SECTIONS: { id: AdminSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'DASHBOARD', icon: '▦' },
  { id: 'sessions',  label: 'SESSIONS',  icon: '▶' },
  { id: 'layouts',   label: 'LAYOUTS',   icon: '▤' },
  { id: 'branding',  label: 'BRANDING',  icon: '★' },
  { id: 'pricing',   label: 'PRICING',   icon: '₱' },
  { id: 'system',    label: 'SYSTEM',    icon: '◉' },
  { id: 'settings',  label: 'SETTINGS',  icon: '⚙' },
]

function isSettingsResponse(v: unknown): v is { settings: SettingsRow } {
  return typeof v === 'object' && v !== null && 'settings' in v
}

function isSessionsResponse(v: unknown): v is { sessions: Session[] } {
  return typeof v === 'object' && v !== null && 'sessions' in v && Array.isArray((v as Record<string, unknown>).sessions)
}

export function AdminApp() {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [databaseOnline, setDatabaseOnline] = useState(false)
  const [settingsOnline, setSettingsOnline] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const { isMobile } = useBreakpoint()
  const active = SECTIONS.find(s => s.id === section)!

  useEffect(() => {
    async function fetchAdminStatus() {
      try {
        const [settingsRes, sessionsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/sessions?limit=200'),
        ])
        const settingsData: unknown = await settingsRes.json()
        const sessionsData: unknown = await sessionsRes.json()

        setSettingsOnline(settingsRes.ok && isSettingsResponse(settingsData))

        if (sessionsRes.ok && isSessionsResponse(sessionsData)) {
          setDatabaseOnline(true)
          setSessionCount(sessionsData.sessions.length)
        }
      } catch (error) {
        console.error(error)
      }
    }

    void fetchAdminStatus()
  }, [])

  const sidebar = (
    <div style={{
      background: 'var(--ink)',
      borderRight: isMobile ? 'none' : '4px solid var(--mustard)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 0 20px',
      overflow: 'hidden',
      height: '100%',
    }}>
      <div style={{
        padding: '24px 20px 18px',
        borderBottom: '2px dashed var(--olive)',
        marginBottom: 8,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: 'var(--mustard)', letterSpacing: '0.05em', lineHeight: 1.5 }}>
            PIXEL PERFECT
          </div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--ivory)', opacity: 0.6, marginTop: 4, letterSpacing: '0.1em' }}>
            WEB ADMIN CONSOLE
          </div>
        </div>
        {isMobile && (
          <div onClick={() => setSidebarOpen(false)} style={{ cursor: 'pointer', color: 'var(--mustard)', fontFamily: "'Press Start 2P', monospace", fontSize: 14, padding: '4px 8px' }}>
            ✕
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1, overflowY: 'auto' }}>
        {SECTIONS.map(s => {
          const isActive = section === s.id
          return (
            <div
              key={s.id}
              onClick={() => { setSection(s.id); setSidebarOpen(false) }}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                letterSpacing: '0.18em',
                background: isActive ? 'var(--mustard)' : 'transparent',
                color: isActive ? 'var(--ink)' : 'var(--ivory)',
                border: `2px solid ${isActive ? 'var(--ivory)' : 'transparent'}`,
                boxShadow: isActive ? '3px 3px 0 var(--burnt)' : 'none',
              }}
            >
              <span style={{ color: isActive ? 'var(--burnt)' : 'var(--mustard)', fontSize: 12 }}>{s.icon}</span>
              {s.label}
            </div>
          )
        })}
      </div>

      <div style={{ margin: '12px', padding: '12px', background: 'var(--olive)', border: '2px solid var(--mustard)' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--mustard)', letterSpacing: '0.15em', marginBottom: 6 }}>
          {databaseOnline && settingsOnline ? '● DATABASE ONLINE' : '● DATABASE CHECK'}
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: 'var(--ivory)', lineHeight: 1.3 }}>
          {sessionCount} sessions loaded<br />settings {settingsOnline ? 'synced' : 'pending'}
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-fixed" style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '240px 1fr',
      background: 'var(--ivory)',
      fontFamily: "'VT323', monospace",
    }}>
      {/* Desktop sidebar */}
      {!isMobile && sidebar}

      {/* Mobile sidebar drawer */}
      {isMobile && sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          />
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 260, zIndex: 50 }}>
            {sidebar}
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{ overflow: 'auto', background: 'var(--ivory)' }}>
        {/* Header */}
        <div style={{
          padding: isMobile ? '14px 16px' : '28px 36px 20px',
          borderBottom: '3px solid var(--ink)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--ivory)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <div
                onClick={() => setSidebarOpen(true)}
                style={{ cursor: 'pointer', fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: 'var(--ink)', padding: '4px 8px', border: '2px solid var(--ink)' }}
              >
                ☰
              </div>
            )}
            <div>
              {!isMobile && (
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--burnt)', letterSpacing: '0.3em', marginBottom: 6 }}>
                  ★ ADMIN ★
                </div>
              )}
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: isMobile ? 14 : 24,
                color: 'var(--ink)',
                textShadow: '3px 3px 0 var(--mustard)',
                letterSpacing: '0.05em',
              }}>
                {active.label}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: isMobile ? 8 : 10,
              color: 'var(--ivory)',
              background: 'var(--olive)',
              border: '3px solid var(--ink)',
              padding: isMobile ? '6px 8px' : '8px 12px',
              letterSpacing: '0.1em',
              boxShadow: '3px 3px 0 var(--ink)',
            }}>
              ● LIVE
            </div>
            {!isMobile && (
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'var(--mustard)',
                background: 'var(--ink)',
                border: '3px solid var(--mustard)',
                padding: '8px 12px',
                letterSpacing: '0.15em',
              }}>
                SESSIONS: {sessionCount}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: isMobile ? '16px' : '28px 36px' }}>
          {section === 'dashboard' && <AdminDashboard />}
          {section === 'sessions'  && <AdminSessions />}
          {section === 'layouts'   && <AdminLayouts />}
          {section === 'branding'  && <AdminBranding />}
          {section === 'pricing'   && <AdminPricing onNavigate={setSection} />}
          {section === 'system'    && <AdminSystemStatus />}
          {section === 'settings'  && <AdminSettings />}
        </div>
      </div>
    </div>
  )
}
