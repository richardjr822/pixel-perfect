'use client'

import { useEffect, useMemo, useState } from 'react'

import { AdminCard } from '@/components/ui/AdminCard'
import { LAYOUTS } from '@/lib/layouts'
import type { LayoutId, Session } from '@/types'

type DateFilter = 'today' | 'week' | 'month' | 'all'

interface SessionsResponse {
  sessions: Session[]
}

const DATE_FILTERS: Array<{ label: string; value: DateFilter }> = [
  { label: 'TODAY', value: 'today' },
  { label: 'WEEK', value: 'week' },
  { label: 'MONTH', value: 'month' },
  { label: 'ALL TIME', value: 'all' },
]

function isSessionsResponse(value: unknown): value is SessionsResponse {
  return typeof value === 'object' && value !== null && 'sessions' in value && Array.isArray(value.sessions)
}

function isSameDate(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}

function isWithinDays(date: Date, days: number): boolean {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - days)

  return date >= start && date <= now
}

export function AdminSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<DateFilter>('today')

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const createdAt = new Date(session.created_at)

      if (filter === 'today') {
        return isSameDate(createdAt, new Date())
      }

      if (filter === 'week') {
        return isWithinDays(createdAt, 7)
      }

      if (filter === 'month') {
        return isWithinDays(createdAt, 30)
      }

      return true
    })
  }, [filter, sessions])

  const revenue = filteredSessions.reduce((amount, session) => amount + session.price, 0)

  function handleTodayClick() {
    setFilter('today')
  }

  function handleWeekClick() {
    setFilter('week')
  }

  function handleMonthClick() {
    setFilter('month')
  }

  function handleAllClick() {
    setFilter('all')
  }

  function getFilterClickHandler(value: DateFilter) {
    if (value === 'today') {
      return handleTodayClick
    }

    if (value === 'week') {
      return handleWeekClick
    }

    if (value === 'month') {
      return handleMonthClick
    }

    return handleAllClick
  }

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true)

      try {
        const query = `/api/sessions?limit=200${filter === 'today' ? '&status=completed' : ''}`
        const response = await fetch(query)
        const data: unknown = await response.json()

        if (!response.ok) {
          throw new Error('Failed to fetch sessions')
        }

        if (!isSessionsResponse(data)) {
          throw new Error('Invalid sessions response')
        }

        setSessions(data.sessions)
      } catch (error) {
        console.error(error)
        setSessions([])
      } finally {
        setLoading(false)
      }
    }

    void fetchSessions()
  }, [filter])

  return (
    <AdminCard title="ALL SESSIONS · FILTERS" accent="var(--mustard)">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {DATE_FILTERS.map((dateFilter) => (
          <div key={dateFilter.value} onClick={getFilterClickHandler(dateFilter.value)} style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            letterSpacing: '0.15em',
            padding: '8px 14px',
            border: '3px solid var(--ink)',
            cursor: 'pointer',
            background: filter === dateFilter.value ? 'var(--ink)' : 'var(--ivory)',
            color: filter === dateFilter.value ? 'var(--mustard)' : 'var(--ink)',
          }}>
            {dateFilter.label}
          </div>
        ))}
      </div>

      <div style={{
        fontFamily: "'VT323', monospace",
        fontSize: 22,
        color: 'var(--ink)',
        marginBottom: 16,
        opacity: 0.8,
      }}>
        Showing {filteredSessions.length} sessions · ₱{revenue.toLocaleString()} in revenue
      </div>

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
          {filteredSessions.map((session, index) => (
            <tr key={session.id} style={{
              background: index % 2 ? 'rgba(85,130,3,0.07)' : 'transparent',
              borderBottom: '1px dashed rgba(0,0,0,0.18)',
            }}>
              <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>{session.id.slice(-6).toUpperCase()}</td>
              <td style={{ padding: '10px 12px' }}>{LAYOUTS[session.layout_id as LayoutId]?.label ?? session.layout_id}</td>
              <td style={{ padding: '10px 12px' }}>{session.filter}</td>
              <td style={{ padding: '10px 12px' }}>{new Date(session.created_at).toLocaleTimeString()}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--burnt)', fontWeight: 'bold' }}>₱{session.price}</td>
              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: 'var(--ivory)',
                  background: session.status === 'completed' ? 'var(--olive)' : 'var(--burnt)',
                  padding: '3px 8px',
                  letterSpacing: '0.1em',
                }}>
                  {session.status === 'completed' ? 'SHARED' : 'ABANDONED'}
                </span>
              </td>
            </tr>
          ))}
          {!loading && filteredSessions.length === 0 && (
            <tr>
              <td colSpan={6} style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                padding: '24px 12px',
                textAlign: 'center',
              }}>
                NO SESSIONS FOUND
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminCard>
  )
}
