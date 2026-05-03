'use client'

import { useState } from 'react'
import { AdminCard } from '@/components/ui/AdminCard'

const INITIAL_LAYOUTS = [
  { id: 'S', label: 'SINGLE SHOT',  count: 1, enabled: true,  price: 100 },
  { id: 'A', label: 'LAYOUT A',     count: 4, enabled: true,  price: 200 },
  { id: 'B', label: 'LAYOUT B',     count: 3, enabled: true,  price: 180 },
  { id: 'C', label: 'LAYOUT C',     count: 2, enabled: false, price: 150 },
  { id: 'D', label: 'LAYOUT D',     count: 6, enabled: true,  price: 280 },
  { id: 'T', label: 'TRADITIONAL',  count: 4, enabled: true,  price: 200 },
]

export function AdminLayouts() {
  const [layouts, setLayouts] = useState(INITIAL_LAYOUTS)

  function toggleEnabled(id: string) {
    setLayouts(prev => prev.map(l => l.id === id ? { ...l, enabled: !l.enabled } : l))
  }

  return (
    <AdminCard title="LAYOUT MANAGER" accent="var(--mustard)">
      <div style={{
        fontFamily: "'VT323', monospace",
        fontSize: 22,
        color: 'var(--ink)',
        opacity: 0.75,
        marginBottom: 20,
      }}>
        enable/disable layouts, set per-layout pricing, and pick the default selection.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {layouts.map(L => (
          <div key={L.id} style={{
            padding: '16px',
            border: '3px solid var(--ink)',
            background: L.enabled ? 'var(--ivory)' : 'rgba(0,0,0,0.04)',
            boxShadow: L.enabled ? '4px 4px 0 var(--mustard)' : 'none',
            opacity: L.enabled ? 1 : 0.55,
          }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 11,
              color: 'var(--ink)',
              letterSpacing: '0.15em',
              marginBottom: 6,
            }}>
              {L.label}
            </div>
            <div style={{
              fontFamily: "'VT323', monospace",
              fontSize: 22,
              color: 'var(--ink)',
              opacity: 0.7,
              marginBottom: 14,
            }}>
              {L.count} {L.count === 1 ? 'photo' : 'photos'} · ₱{L.price}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                onClick={() => toggleEnabled(L.id)}
                style={{
                  flex: 1,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 9,
                  color: 'var(--ivory)',
                  background: L.enabled ? 'var(--olive)' : 'var(--ink)',
                  padding: '8px 0',
                  textAlign: 'center',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {L.enabled ? '● ENABLED' : '○ OFF'}
              </div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: 'var(--ivory)',
                background: 'var(--burnt)',
                padding: '8px 12px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}>
                EDIT
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}
