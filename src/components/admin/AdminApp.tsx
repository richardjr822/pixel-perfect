'use client'

import { useState } from 'react'
import type { AdminSection } from '@/types'
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

export function AdminApp() {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const active = SECTIONS.find(s => s.id === section)!

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      background: 'var(--ivory)',
      fontFamily: "'VT323', monospace",
    }}>
      {/* Sidebar */}
      <div style={{
        background: 'var(--ink)',
        borderRight: '4px solid var(--mustard)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 20px',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px 18px',
          borderBottom: '2px dashed var(--olive)',
          marginBottom: 8,
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 13,
            color: 'var(--mustard)',
            letterSpacing: '0.05em',
            lineHeight: 1.5,
          }}>
            PIXEL PERFECT
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--ivory)',
            opacity: 0.6,
            marginTop: 4,
            letterSpacing: '0.1em',
          }}>
            WEB ADMIN CONSOLE
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 }}>
          {SECTIONS.map(s => {
            const isActive = section === s.id
            return (
              <div
                key={s.id}
                onClick={() => setSection(s.id)}
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
                <span style={{ color: isActive ? 'var(--burnt)' : 'var(--mustard)', fontSize: 12 }}>
                  {s.icon}
                </span>
                {s.label}
              </div>
            )
          })}
        </div>

        {/* System status footer */}
        <div style={{
          margin: '12px',
          padding: '12px',
          background: 'var(--olive)',
          border: '2px solid var(--mustard)',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: 'var(--mustard)',
            letterSpacing: '0.15em',
            marginBottom: 6,
          }}>
            ● SYSTEM ONLINE
          </div>
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 18,
            color: 'var(--ivory)',
            lineHeight: 1.3,
          }}>
            uptime 14d 3h<br />
            web app v2.4.1
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ overflow: 'auto', background: 'var(--ivory)' }}>
        {/* Header */}
        <div style={{
          padding: '28px 36px 20px',
          borderBottom: '3px solid var(--ink)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--ivory)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--burnt)',
              letterSpacing: '0.3em',
              marginBottom: 6,
            }}>
              ★ ADMIN ★
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 24,
              color: 'var(--ink)',
              textShadow: '3px 3px 0 var(--mustard)',
              letterSpacing: '0.05em',
            }}>
              {active.label}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--ivory)',
              background: 'var(--olive)',
              border: '3px solid var(--ink)',
              padding: '8px 12px',
              letterSpacing: '0.15em',
              boxShadow: '3px 3px 0 var(--ink)',
            }}>
              ● LIVE
            </div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--mustard)',
              background: 'var(--ink)',
              border: '3px solid var(--mustard)',
              padding: '8px 12px',
              letterSpacing: '0.15em',
            }}>
              OPERATOR: AAA
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 36px' }}>
          {section === 'dashboard' && <AdminDashboard />}
          {section === 'sessions'  && <AdminSessions />}
          {section === 'layouts'   && <AdminLayouts />}
          {section === 'branding'  && <AdminBranding />}
          {section === 'pricing'   && <AdminPricing />}
          {section === 'system'    && <AdminSystemStatus />}
          {section === 'settings'  && <AdminSettings />}
        </div>
      </div>
    </div>
  )
}
