'use client'

import { useState } from 'react'
import type { CapturedShot, FilterId, LayoutId, UserScreen } from '@/types'
import { LAYOUTS } from '@/lib/layouts'
import { AttractScreen } from './AttractScreen'
import { WelcomeScreen } from './WelcomeScreen'
import { ChooseLayoutScreen } from './ChooseLayoutScreen'
import { CameraScreen } from './CameraScreen'
import { StripPreviewScreen } from './StripPreviewScreen'

interface UserAppProps {
  onAdminUnlock: () => void
}

export function UserApp({ onAdminUnlock }: UserAppProps) {
  const [screen, setScreen] = useState<UserScreen>('attract')
  const [chosenLayoutId, setChosenLayoutId] = useState<LayoutId>('A')
  const [capturedShots, setCapturedShots] = useState<CapturedShot[]>([])
  const [countdownSec, setCountdownSec] = useState<3 | 5 | 10>(3)
  const [photoFilter, setPhotoFilter] = useState<FilterId>('none')

  function handleStart() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    }
    setScreen('welcome')
  }

  return (
    <div className="app-shell">
      {screen === 'attract' && (
        <AttractScreen onStart={handleStart} onAdminUnlock={onAdminUnlock} />
      )}
      {screen === 'welcome' && (
        <WelcomeScreen
          layout={LAYOUTS[chosenLayoutId]}
          countdownSec={countdownSec}
          onStart={() => setScreen('chooseLayout')}
          onBack={() => setScreen('attract')}
        />
      )}
      {screen === 'chooseLayout' && (
        <ChooseLayoutScreen
          chosen={chosenLayoutId}
          onChoose={setChosenLayoutId}
          onContinue={() => setScreen('camera')}
          onBack={() => setScreen('welcome')}
        />
      )}
      {screen === 'camera' && (
        <CameraScreen
          layout={LAYOUTS[chosenLayoutId]}
          countdownSec={countdownSec}
          setCountdownSec={setCountdownSec}
          photoFilter={photoFilter}
          setPhotoFilter={setPhotoFilter}
          onDone={(shots) => { setCapturedShots(shots); setScreen('strip') }}
          onBack={() => setScreen('chooseLayout')}
        />
      )}
      {screen === 'strip' && (
        <StripPreviewScreen
          shots={capturedShots}
          layout={LAYOUTS[chosenLayoutId]}
          onRetake={() => { setCapturedShots([]); setScreen('camera') }}
          onPlayAgain={() => { setCapturedShots([]); setScreen('attract') }}
        />
      )}
    </div>
  )
}
