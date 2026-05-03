'use client'

import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'

import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { DEFAULT_SETTINGS, LAYOUTS } from '@/lib/layouts'
import type { LayoutId, SettingsRow } from '@/types'

type LayoutsConfig = Record<LayoutId, { enabled: boolean; price: number }>

interface SettingsResponse {
  settings: SettingsRow
}

const LAYOUT_IDS = Object.keys(LAYOUTS) as LayoutId[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSettingsResponse(value: unknown): value is SettingsResponse {
  return isRecord(value) && isRecord(value.settings)
}

function createLayoutsConfig(source: Partial<LayoutsConfig> = DEFAULT_SETTINGS.layouts_config): LayoutsConfig {
  const config = {} as LayoutsConfig

  for (const id of LAYOUT_IDS) {
    const layout = LAYOUTS[id]
    const saved = source[id]

    config[id] = {
      enabled: saved?.enabled ?? layout.enabled,
      price: saved?.price ?? layout.price,
    }
  }

  return config
}

export function AdminLayouts() {
  const [layoutsConfig, setLayoutsConfig] = useState<LayoutsConfig>(() => createLayoutsConfig())
  const [saving, setSaving] = useState(false)
  const [editingLayoutId, setEditingLayoutId] = useState<LayoutId | null>(null)
  const [priceDraft, setPriceDraft] = useState('')
  const { isMobile } = useBreakpoint()

  async function saveSettings(body: Partial<SettingsRow>) {
    setSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Settings save failed')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  function persistLayoutsConfig(updatedConfig: LayoutsConfig) {
    void saveSettings({ layouts_config: updatedConfig })
  }

  function toggleEnabled(id: LayoutId) {
    const updatedConfig = {
      ...layoutsConfig,
      [id]: {
        ...layoutsConfig[id],
        enabled: !layoutsConfig[id].enabled,
      },
    }

    setLayoutsConfig(updatedConfig)
    persistLayoutsConfig(updatedConfig)
  }

  function startEditingPrice(id: LayoutId) {
    setEditingLayoutId(id)
    setPriceDraft(String(layoutsConfig[id].price))
  }

  function commitPriceEdit(id: LayoutId) {
    const parsedPrice = Number.parseInt(priceDraft, 10)
    const price = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : layoutsConfig[id].price
    const updatedConfig = {
      ...layoutsConfig,
      [id]: {
        ...layoutsConfig[id],
        price,
      },
    }

    setLayoutsConfig(updatedConfig)
    setEditingLayoutId(null)
    setPriceDraft('')
    persistLayoutsConfig(updatedConfig)
  }

  function cancelPriceEdit() {
    setEditingLayoutId(null)
    setPriceDraft('')
  }

  function handlePriceDraftChange(event: ChangeEvent<HTMLInputElement>) {
    setPriceDraft(event.target.value)
  }

  function getToggleHandler(id: LayoutId) {
    return function handleToggle() {
      toggleEnabled(id)
    }
  }

  function getEditHandler(id: LayoutId) {
    return function handleEdit() {
      startEditingPrice(id)
    }
  }

  function getPriceBlurHandler(id: LayoutId) {
    return function handlePriceBlur() {
      commitPriceEdit(id)
    }
  }

  function getPriceKeyDownHandler(id: LayoutId) {
    return function handlePriceKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Enter') {
        commitPriceEdit(id)
      }

      if (event.key === 'Escape') {
        cancelPriceEdit()
      }
    }
  }

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings')
        const data: unknown = await response.json()

        if (!response.ok) {
          throw new Error('Settings fetch failed')
        }

        if (isSettingsResponse(data) && data.settings.layouts_config) {
          setLayoutsConfig(createLayoutsConfig(data.settings.layouts_config))
        }
      } catch (error) {
        console.error(error)
      }
    }

    void fetchSettings()
  }, [])

  return (
    <AdminCard title="LAYOUT MANAGER" accent="var(--mustard)">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: 22,
          color: 'var(--ink)',
          opacity: 0.75,
        }}>
          enable/disable layouts, set per-layout pricing, and pick the default selection.
        </div>
        {saving && (
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: 'var(--mustard)',
            letterSpacing: '0.15em',
          }}>
            SAVING...
          </div>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 14 }}>
        {LAYOUT_IDS.map(id => {
          const layout = LAYOUTS[id]
          const config = layoutsConfig[id]
          const editing = editingLayoutId === id

          return (
            <div key={id} style={{
              padding: '16px',
              border: '3px solid var(--ink)',
              background: config.enabled ? 'var(--ivory)' : 'rgba(0,0,0,0.04)',
              boxShadow: config.enabled ? '4px 4px 0 var(--mustard)' : 'none',
              opacity: config.enabled ? 1 : 0.55,
            }}>
              <div style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 11,
                color: 'var(--ink)',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}>
                {layout.label.toUpperCase()}
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 22,
                color: 'var(--ink)',
                opacity: 0.7,
                marginBottom: 14,
              }}>
                {layout.count} {layout.count === 1 ? 'photo' : 'photos'} · ₱{editing ? (
                  <input
                    value={priceDraft}
                    onChange={handlePriceDraftChange}
                    onBlur={getPriceBlurHandler(id)}
                    onKeyDown={getPriceKeyDownHandler(id)}
                    style={{
                      width: 72,
                      fontFamily: "'VT323', monospace",
                      fontSize: 22,
                      color: 'var(--ink)',
                      background: 'var(--ivory)',
                      border: '2px solid var(--ink)',
                      padding: '0 6px',
                    }}
                  />
                ) : config.price}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div
                  onClick={getToggleHandler(id)}
                  style={{
                    flex: 1,
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: 'var(--ivory)',
                    background: config.enabled ? 'var(--olive)' : 'var(--ink)',
                    padding: '8px 0',
                    textAlign: 'center',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  {config.enabled ? '● ENABLED' : '○ OFF'}
                </div>
                <div
                  onClick={getEditHandler(id)}
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: 9,
                    color: 'var(--ivory)',
                    background: 'var(--burnt)',
                    padding: '8px 12px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  EDIT
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AdminCard>
  )
}
