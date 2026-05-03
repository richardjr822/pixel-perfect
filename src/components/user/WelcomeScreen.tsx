'use client'

import type { LayoutConfig } from '@/types'
import { FlowChrome } from '@/components/ui/FlowChrome'
import { ArcadePanel } from '@/components/ui/ArcadePanel'

interface Props {
  layout: LayoutConfig
  countdownSec: 3 | 5 | 10
  onStart: () => void
  onBack: () => void
}

export function WelcomeScreen({ layout, countdownSec, onStart, onBack }: Props) {
  return (
    <FlowChrome step={1} total={4} title="WELCOME" onBack={onBack}>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'min(4vw, 56px)',
      }}>
        {/* Decorative checkers */}
        <div style={{
          position: 'absolute',
          top: 24,
          left: 24,
          width: 80,
          height: 80,
          opacity: 0.25,
          backgroundImage: 'repeating-conic-gradient(var(--ink) 0% 25%, transparent 0% 50%)',
          backgroundSize: '20px 20px',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 80,
          height: 80,
          opacity: 0.25,
          backgroundImage: 'repeating-conic-gradient(var(--ink) 0% 25%, transparent 0% 50%)',
          backgroundSize: '20px 20px',
        }} />

        <ArcadePanel style={{ maxWidth: 720, textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            position: 'absolute',
            top: -22,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--mustard)',
            color: 'var(--ink)',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 11,
            letterSpacing: '0.25em',
            padding: '8px 16px',
            border: '3px solid var(--ink)',
            whiteSpace: 'nowrap',
          }}>
            ★ READY TO PLAY ★
          </div>

          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(36px, 5vw, 64px)',
            color: 'var(--ink)',
            letterSpacing: '0.04em',
            textShadow: '4px 4px 0 var(--mustard), 8px 8px 0 var(--blue)',
            marginTop: 18,
            lineHeight: 1.1,
          }}>
            WELCOME!
          </div>

          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 'clamp(20px, 2.2vw, 30px)',
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginTop: 22,
          }}>
            you have{' '}
            <strong style={{ color: 'var(--burnt)' }}>{countdownSec} seconds</strong>{' '}
            for each shot — no retakes.<br />
            this booth captures{' '}
            <strong style={{ color: 'var(--burnt)' }}>{layout.count} picture{layout.count !== 1 ? 's' : ''}</strong>{' '}
            in a row,<br />
            so strike your best pose and have fun.
          </div>

          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: 22,
            color: 'var(--ink)',
            opacity: 0.7,
            marginTop: 16,
          }}>
            after the session, grab your strip and share the fun.
          </div>

          <div
            onClick={onStart}
            className="animate-blink-slow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 36,
              cursor: 'pointer',
              padding: '18px 36px',
              background: 'var(--ink)',
              color: 'var(--mustard)',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 18,
              letterSpacing: '0.25em',
              boxShadow: '6px 6px 0 var(--mustard)',
            }}
          >
            START
            <span style={{ animation: 'arrow-pulse 0.8s infinite' }}>▶</span>
          </div>
        </ArcadePanel>
      </div>
    </FlowChrome>
  )
}
