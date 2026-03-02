import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n'
import { TariffsSection } from '@/components/TariffsSection'
import type { Tariff } from '@/types/tariff'
import './membership-popup.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  items: Tariff[]
  loading: boolean
  error: Error | null
  onRegistrationComplete?: () => void
}

export function MembershipPopup({
  isOpen,
  onClose,
  items,
  loading,
  error,
  onRegistrationComplete,
}: Props) {
  const { t } = useI18n()
  const [step, setStep] = useState<'email' | 'tariffs'>('email')
  const [email, setEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)

  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const showEmailError = emailTouched && emailInvalid

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  const handleClose = useCallback(() => {
    onClose()
    setStep('email')
    setEmail('')
    setEmailTouched(false)
  }, [onClose])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailTouched(true)
  }, [])

  const handleContinueClick = useCallback(() => {
    setEmailTouched(true)
    if (emailInvalid) return
    setStep('tariffs')
  }, [emailInvalid])

  const handleContinueKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleContinueClick()
      }
    },
    [handleContinueClick]
  )

  const handleRegistrationComplete = useCallback(() => {
    onRegistrationComplete?.()
    handleClose()
  }, [onRegistrationComplete, handleClose])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  return (
    <div
      className={`membership-popup__overlay ${isOpen ? 'membership-popup__overlay--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="membership-popup-title"
      aria-hidden={!isOpen}
      onClick={handleOverlayClick}
    >
      <div className="membership-popup__modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="membership-popup__close"
          onClick={handleClose}
          aria-label={t('header.close')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {step === 'email' ? (
          <div className="membership-popup__step">
            <h2 id="membership-popup-title" className="membership-popup__title">
              {t('tariffs.joinTitle')}
            </h2>
            <p className="membership-popup__subtitle">{t('membership.popupEmailPrompt')}</p>
            <div className="membership-popup__form-row">
              <label htmlFor="membership-popup-email" className="visually-hidden">
                {t('header.email')}
              </label>
              <input
                id="membership-popup-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setEmailTouched(true)}
                placeholder={t('header.emailPlaceholder')}
                className={`membership-popup__input ${showEmailError ? 'membership-popup__input--invalid' : ''}`}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? 'membership-popup-email-error' : undefined}
                autoComplete="email"
                autoFocus
              />
              {showEmailError && (
                <p id="membership-popup-email-error" className="membership-popup__error" role="alert">
                  {t('header.emailRequired')}
                </p>
              )}
            </div>
            <button
              type="button"
              className="membership-popup__continue"
              onClick={handleContinueClick}
              onKeyDown={handleContinueKeyDown}
              aria-label={t('membership.popupContinue')}
            >
              {t('membership.popupContinue')}
            </button>
          </div>
        ) : (
          <div className="membership-popup__tariffs-wrap">
            <TariffsSection
              items={items}
              loading={loading}
              error={error}
              initialEmail={email.trim()}
              onRegistrationComplete={handleRegistrationComplete}
              variant="popup"
            />
          </div>
        )}
      </div>
    </div>
  )
}
