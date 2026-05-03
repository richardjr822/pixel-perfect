'use client'

import { useState } from 'react'
import type { AppMode } from '@/types'
import { AdminApp } from '@/components/admin/AdminApp'
import { UserApp } from '@/components/user/UserApp'

export default function PhotoboothApp() {
  const [mode, setMode] = useState<AppMode>('user')

  return (
    <>
      {mode === 'admin'
        ? <AdminApp />
        : <UserApp onAdminUnlock={() => setMode('admin')} />
      }
      {mode === 'admin' && (
        <div style={{ position: 'fixed', top: 8, left: 8, zIndex: 100 }}>
          <button
            onClick={() => setMode('user')}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              background: 'var(--burnt)',
              color: 'var(--ivory)',
              border: '3px solid var(--ink)',
              padding: '8px 12px',
              cursor: 'pointer',
              letterSpacing: '0.15em',
            }}
          >
            EXIT ADMIN
          </button>
        </div>
      )}
    </>
  )
}
