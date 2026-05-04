'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties, FormEvent, KeyboardEvent } from 'react'

const ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]
const SYMBOLS = ['@', '.', '-', '_', '.com', '.ph']

interface ArcadeKeyboardProps {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onClose: () => void
  status: 'idle' | 'sending' | 'sent' | 'error'
}

export function ArcadeKeyboard({ value, onChange, onSend, onClose, status }: ArcadeKeyboardProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function focusInput() {
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function press(char: string) {
    onChange(value + char.toLowerCase())
    focusInput()
  }

  function backspace() {
    onChange(value.slice(0, -1))
    focusInput()
  }

  function clear() {
    onChange('')
    focusInput()
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    if (status !== 'sending') {
      onSend()
    }
  }

  const keyBase: CSSProperties = {
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 11,
    border: '3px solid var(--ink)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    minWidth: 36,
    height: 44,
    padding: '0 6px',
    transition: 'transform 0.06s, box-shadow 0.06s',
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,26,20,0.88)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 200,
        padding: '0 0 32px',
      }}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
        width: '100%',
        maxWidth: 680,
        background: 'var(--blue)',
        border: '6px solid var(--ink)',
        boxShadow: '10px 10px 0 var(--ink)',
        padding: '24px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            color: 'var(--mustard)',
            letterSpacing: '0.2em',
          }}>
            ✉ ENTER YOUR EMAIL
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 10,
              color: 'var(--ivory)',
              background: 'transparent',
              cursor: 'pointer',
              padding: '6px 10px',
              border: '2px solid var(--ivory)',
              letterSpacing: '0.1em',
              opacity: 0.75,
              appearance: 'none',
            }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Email input */}
        <div style={{
          background: 'var(--ink)',
          border: '4px solid var(--mustard)',
          padding: '0 16px',
          minHeight: 52,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          overflow: 'hidden',
        }}>
          <input
            ref={inputRef}
            type="email"
            value={value}
            onChange={event => onChange(event.target.value)}
            onKeyDown={handleInputKeyDown}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
            inputMode="email"
            enterKeyHint="send"
            maxLength={254}
            aria-label="Email address"
            style={{
              width: '100%',
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--mustard)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 13,
              letterSpacing: '0.08em',
              caretColor: 'var(--mustard)',
            }}
          />
          <span className="animate-blink" style={{ color: 'var(--mustard)', marginLeft: 1 }}>█</span>
        </div>

        {/* Symbol row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SYMBOLS.map(sym => (
            <div
              key={sym}
              onClick={() => press(sym)}
              style={{
                ...keyBase,
                background: 'var(--burnt)',
                color: 'var(--ivory)',
                boxShadow: '3px 3px 0 var(--ink)',
                fontSize: sym.length > 2 ? 9 : 11,
                padding: '0 10px',
              }}
            >
              {sym}
            </div>
          ))}
        </div>

        {/* Letter/number rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 6 }}>
              {row.map(k => (
                <div
                  key={k}
                  onClick={() => press(k)}
                  style={{
                    ...keyBase,
                    background: 'var(--ivory)',
                    color: 'var(--ink)',
                    boxShadow: '3px 3px 0 var(--ink)',
                  }}
                >
                  {k}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom control row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            onClick={clear}
            style={{
              ...keyBase,
              background: 'var(--ink)',
              color: 'var(--ivory)',
              border: '3px solid var(--ivory)',
              boxShadow: '3px 3px 0 var(--mustard)',
              fontSize: 9,
              padding: '0 14px',
              letterSpacing: '0.1em',
            }}
          >
            CLEAR
          </div>
          <div
            onClick={() => press(' ')}
            style={{
              ...keyBase,
              flex: 1,
              background: 'var(--ivory)',
              color: 'var(--ink)',
              boxShadow: '3px 3px 0 var(--ink)',
              letterSpacing: '0.15em',
            }}
          >
            SPACE
          </div>
          <div
            onClick={backspace}
            style={{
              ...keyBase,
              background: 'var(--ink)',
              color: 'var(--mustard)',
              border: '3px solid var(--mustard)',
              boxShadow: '3px 3px 0 var(--mustard)',
              fontSize: 14,
              padding: '0 16px',
            }}
          >
            ⌫
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            style={{
              ...keyBase,
              background: status === 'error' ? 'var(--burnt)' : 'var(--mustard)',
              color: 'var(--ink)',
              boxShadow: '4px 4px 0 var(--ink)',
              fontSize: 10,
              padding: '0 18px',
              letterSpacing: '0.12em',
              opacity: status === 'sending' ? 0.6 : 1,
              cursor: status === 'sending' ? 'wait' : 'pointer',
              appearance: 'none',
            }}
          >
            {status === 'sending' ? '...' : status === 'error' ? 'RETRY' : 'SEND →'}
          </button>
        </div>

        {status === 'error' && (
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 20,
            color: 'var(--burnt)',
            letterSpacing: '0.1em',
            textAlign: 'center',
          }}>
            DELIVERY FAILED — CHECK EMAIL AND RETRY
          </div>
        )}
      </form>
    </div>
  )
}
