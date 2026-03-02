import { useState, useCallback, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useVideos } from '@/hooks/useVideos'
import { useTariffs } from '@/hooks/useTariffs'
import { VideoSection } from '@/components/VideoSection'
import { MembershipBlock } from '@/components/MembershipBlock'
import { TariffsSection } from '@/components/TariffsSection'
import { AgeGate, getStoredAgeConfirmed, type ContentType } from '@/components/age-gate/AgeGate'
import { Header } from '@/components/header/Header'
import { InfoPage } from '@/pages/InfoPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { useI18n } from '@/i18n'
import '@/styles/index.css'

const REGISTERED_KEY = 'jav_registered'

export function App() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [showAgeGate, setShowAgeGate] = useState(false)
  const [isRegistered, setIsRegistered] = useState(
    () => localStorage.getItem(REGISTERED_KEY) === '1'
  )
  const videos = useVideos()
  const tariffs = useTariffs()

  useEffect(() => {
    setShowAgeGate(!getStoredAgeConfirmed())
  }, [])

  const handleAgeGateConfirm = useCallback((_contentType: ContentType) => {
    setShowAgeGate(false)
  }, [])

  const handleWatchFullVideo = useCallback(() => {
    navigate('/tariffs')
  }, [navigate])

  const handleTariffsBack = useCallback(() => {
    window.history.back()
  }, [])

  const handleRegistrationComplete = useCallback(() => {
    localStorage.setItem(REGISTERED_KEY, '1')
    setIsRegistered(true)
  }, [])

  if (showAgeGate) {
    return <AgeGate onConfirm={handleAgeGateConfirm} />
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main>
            <Header isRegistered={isRegistered} />
            <VideoSection {...videos} onWatchFullVideo={handleWatchFullVideo}>
              <TariffsSection {...tariffs} onRegistrationComplete={handleRegistrationComplete} />
            </VideoSection>
            <MembershipBlock
              {...tariffs}
              onRegistrationComplete={handleRegistrationComplete}
            />
          </main>
        }
      />
      <Route
        path="/tariffs"
        element={
          <main>
            <Header isRegistered={isRegistered} />
            <div className="tariffs-page">
              <button
                type="button"
                className="tariffs-page__back"
                onClick={handleTariffsBack}
                aria-label={t('menu.back')}
              >
                ← {t('menu.back')}
              </button>
              <TariffsSection
                {...tariffs}
                onRegistrationComplete={handleRegistrationComplete}
              />
            </div>
          </main>
        }
      />
      <Route
        path="/categories"
        element={
          <main>
            <Header isRegistered={isRegistered} />
            <CategoriesPage />
          </main>
        }
      />
      <Route
        path="/info/:slug"
        element={
          <main>
            <Header isRegistered={isRegistered} />
            <InfoPage />
          </main>
        }
      />
    </Routes>
  )
}
