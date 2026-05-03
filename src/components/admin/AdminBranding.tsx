'use client'

import { useEffect, useRef, useState } from 'react'
import { AdminCard } from '@/components/ui/AdminCard'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { DEFAULT_BRANDING } from '@/lib/layouts'
import type { BrandingConfig, SettingsRow } from '@/types'

function isSettingsResponse(v: unknown): v is { settings: SettingsRow } {
  return typeof v === 'object' && v !== null && 'settings' in v
}

function isUploadResponse(v: unknown): v is { url: string } {
  return typeof v === 'object' && v !== null && 'url' in v && typeof (v as Record<string, unknown>).url === 'string'
}

interface EditableFieldProps {
  label: string
  value: string
  fieldKey: keyof BrandingConfig
  isEditing: boolean
  draft: string
  onEdit: () => void
  onDraftChange: (v: string) => void
  onCommit: () => void
  onCancel: () => void
  multiline?: boolean
}

function EditableField({
  label,
  value,
  isEditing,
  draft,
  onEdit,
  onDraftChange,
  onCommit,
  onCancel,
  multiline,
}: EditableFieldProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !multiline) {
      onCommit()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: 'var(--ink)',
        letterSpacing: '0.2em',
        opacity: 0.65,
        marginBottom: 5,
      }}>
        {label}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        border: '2px solid var(--ink)',
        padding: multiline ? '10px 12px' : '8px 12px',
        background: 'var(--ivory)',
        boxShadow: '2px 2px 0 var(--ink)',
        fontFamily: "'VT323', monospace",
        fontSize: 20,
        color: 'var(--ink)',
      }}>
        {isEditing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => onDraftChange(e.target.value)}
            onBlur={onCommit}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              fontFamily: "'VT323', monospace",
              fontSize: 20,
              color: 'var(--ink)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
            }}
          />
        ) : (
          <>
            <span style={{ flex: 1, wordBreak: 'break-all' }}>{value}</span>
            <span
              onClick={onEdit}
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: 'var(--burnt)',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              EDIT ▸
            </span>
          </>
        )}
      </div>
    </div>
  )
}

interface ToggleFieldProps {
  label: string
  value: boolean
  onToggle: () => void
}

function ToggleField({ label, value, onToggle }: ToggleFieldProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: 'var(--ink)',
        letterSpacing: '0.2em',
        opacity: 0.65,
        marginBottom: 5,
      }}>
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
      }}>
        <span>{value ? 'ON' : 'OFF'}</span>
        <span
          onClick={onToggle}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: 'var(--ivory)',
            background: value ? 'var(--olive)' : 'var(--ink)',
            padding: '3px 8px',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          {value ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  )
}

export function AdminBranding() {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING)
  const [editingField, setEditingField] = useState<keyof BrandingConfig | null>(null)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        const data: unknown = await res.json()

        if (!res.ok || !isSettingsResponse(data)) {
          return
        }

        setBranding({ ...DEFAULT_BRANDING, ...data.settings.branding_config })
      } catch (e) {
        console.error(e)
      }
    }

    void fetchSettings()
  }, [])

  async function saveBranding(updated: BrandingConfig) {
    setSaving(true)

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branding_config: updated }),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(field: keyof BrandingConfig) {
    const val = branding[field]
    setEditingField(field)
    setDraft(typeof val === 'string' ? val : '')
  }

  function commitEdit() {
    if (!editingField) {
      return
    }

    const updated = { ...branding, [editingField]: draft }
    setBranding(updated)
    setEditingField(null)
    setDraft('')
    void saveBranding(updated)
  }

  function cancelEdit() {
    setEditingField(null)
    setDraft('')
  }

  function toggle(field: 'show_date_stamp' | 'show_qr_code') {
    const updated = { ...branding, [field]: !branding[field] }
    setBranding(updated)
    void saveBranding(updated)
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    setUploading(true)
    const reader = new FileReader()

    reader.onload = async () => {
      const base64 = reader.result as string

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, folder: 'pixel-perfect/logos' }),
        })
        const data: unknown = await res.json()

        if (res.ok && isUploadResponse(data)) {
          const updated = { ...branding, logo_url: data.url }
          setBranding(updated)
          void saveBranding(updated)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setUploading(false)
      }
    }

    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function makeEditableProps(field: keyof BrandingConfig, multiline = false): Omit<EditableFieldProps, 'label' | 'value' | 'fieldKey'> {
    return {
      isEditing: editingField === field,
      draft,
      onEdit: () => startEdit(field),
      onDraftChange: setDraft,
      onCommit: commitEdit,
      onCancel: cancelEdit,
      multiline,
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
      <AdminCard title="STRIP BRANDING" accent="var(--mustard)">
        {saving && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--mustard)', letterSpacing: '0.15em', marginBottom: 10 }}>
            SAVING...
          </div>
        )}
        <EditableField
          label="HEADER TEXT"
          value={branding.header_text}
          fieldKey="header_text"
          {...makeEditableProps('header_text')}
        />
        <EditableField
          label="FOOTER TEXT"
          value={branding.footer_text}
          fieldKey="footer_text"
          {...makeEditableProps('footer_text')}
        />
        <ToggleField label="SHOW DATE STAMP" value={branding.show_date_stamp} onToggle={() => toggle('show_date_stamp')} />
        <ToggleField label="SHOW QR CODE"    value={branding.show_qr_code}    onToggle={() => toggle('show_qr_code')} />
      </AdminCard>

      <AdminCard title="BRANDING STATUS" accent="var(--burnt)">
        {[
          { label: 'HEADER', value: branding.header_text || 'NOT SET' },
          { label: 'FOOTER', value: branding.footer_text || 'NOT SET' },
          { label: 'DATE STAMP', value: branding.show_date_stamp ? 'ON' : 'OFF' },
          { label: 'QR CODE', value: branding.show_qr_code ? 'ON' : 'OFF' },
          { label: 'LOGO', value: branding.logo_url ? 'UPLOADED' : 'NOT SET' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            border: '2px solid var(--ink)',
            padding: '8px 12px',
            background: 'var(--ivory)',
            boxShadow: '2px 2px 0 var(--ink)',
            fontFamily: "'VT323', monospace",
            fontSize: 20,
            color: 'var(--ink)',
            marginBottom: 10,
          }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: '0.15em' }}>
              {label}
            </span>
            <span>{value}</span>
          </div>
        ))}
      </AdminCard>

      <AdminCard title="ATTRACT MARQUEE" accent="var(--olive)">
        {saving && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--mustard)', letterSpacing: '0.15em', marginBottom: 10 }}>
            SAVING...
          </div>
        )}
        <EditableField
          label="MARQUEE TEXT"
          value={branding.marquee_text}
          fieldKey="marquee_text"
          {...makeEditableProps('marquee_text', true)}
        />
        <EditableField
          label="TAGLINE"
          value={branding.tagline}
          fieldKey="tagline"
          {...makeEditableProps('tagline')}
        />
      </AdminCard>

      <AdminCard title="LOGO & ASSETS" accent="var(--blue)">
        <div style={{
          height: 130,
          background: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid var(--ink)',
          marginBottom: 14,
          overflow: 'hidden',
        }}>
          {branding.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logo_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 26, color: 'var(--ivory)', textShadow: '3px 3px 0 var(--mustard)' }}>
                PIXEL
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 20, color: 'var(--mustard)', marginTop: 4 }}>
                PERFECT
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          onClick={uploading ? undefined : handleUploadClick}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: 'var(--ink)',
            background: uploading ? 'rgba(255,206,27,0.5)' : 'var(--mustard)',
            border: '3px solid var(--ink)',
            padding: '10px 0',
            textAlign: 'center',
            letterSpacing: '0.15em',
            cursor: uploading ? 'wait' : 'pointer',
          }}
        >
          {uploading ? 'UPLOADING...' : '▲ UPLOAD NEW LOGO'}
        </div>
      </AdminCard>
    </div>
  )
}
