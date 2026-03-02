import { useState, useCallback } from 'react'
import { useI18n } from '@/i18n'
import './age-gate.css'

const STORAGE_KEY_AGE = 'ageConfirmed'
const STORAGE_KEY_CONTENT_TYPE = 'contentType'

export type ContentType = 'gay' | 'straight' | 'trans'

type AgeGateProps = {
  onConfirm: (contentType: ContentType) => void
}

const IconGay = () => (
  <svg className="age-gate__card-icon" viewBox="0 0 40 24" aria-hidden="true">
    <rect fill="#E40303" width="40" height="4" y="0" />
    <rect fill="#FF8C00" width="40" height="4" y="4" />
    <rect fill="#FFED00" width="40" height="4" y="8" />
    <rect fill="#008026" width="40" height="4" y="12" />
    <rect fill="#24408E" width="40" height="4" y="16" />
    <rect fill="#732982" width="40" height="4" y="20" />
  </svg>
)

const IconStraight = () => (
  <svg className="age-gate__card-icon age-gate__card-icon--straight" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 16v6M9 19h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const IconTrans = () => (
  <svg className="age-gate__card-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 14v4M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8.5 9.5L12 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const renderIcon = (id: ContentType) => {
  switch (id) {
    case 'gay':
      return <IconGay />
    case 'straight':
      return <IconStraight />
    case 'trans':
      return <IconTrans />
    default:
      return null
  }
}

const CONTENT_TYPE_IDS: ContentType[] = ['gay', 'straight', 'trans']

export function AgeGate({ onConfirm }: AgeGateProps) {
  const { t } = useI18n()
  const [selectedType, setSelectedType] = useState<ContentType>('straight')

  const handleCardClick = useCallback((id: ContentType) => {
    setSelectedType(id)
  }, [])

  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent, id: ContentType) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setSelectedType(id)
      }
    },
    []
  )

  const handleConfirmClick = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_AGE, 'true')
    localStorage.setItem(STORAGE_KEY_CONTENT_TYPE, selectedType)
    onConfirm(selectedType)
  }, [selectedType, onConfirm])

  const handleConfirmKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleConfirmClick()
      }
    },
    [handleConfirmClick]
  )

  const getContentLabel = (id: ContentType) => {
    switch (id) {
      case 'gay':
        return t('ageGate.contentGay')
      case 'straight':
        return t('ageGate.contentStraight')
      case 'trans':
        return t('ageGate.contentTrans')
      default:
        return id
    }
  }

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-desc">
      <p id="age-gate-title" className="age-gate__warning">
        {t('ageGate.warning')}
      </p>

      <div id="age-gate-desc" className="age-gate__content-types" role="group" aria-label={t('ageGate.contentTypeChoice')}>
        {CONTENT_TYPE_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`age-gate__card ${selectedType === id ? 'age-gate__card--selected' : ''}`}
            aria-pressed={selectedType === id}
            aria-label={`${t('ageGate.contentTypeChoice')}: ${getContentLabel(id)}`}
            tabIndex={0}
            onClick={() => handleCardClick(id)}
            onKeyDown={(e) => handleCardKeyDown(e, id)}
          >
            {renderIcon(id)}
            <span className="age-gate__card-label">{getContentLabel(id)}</span>
          </button>
        ))}
      </div>

      <div className="age-gate__confirm-wrap">
        <span className="age-gate__confirm-arrow" aria-hidden="true" />
        <button
          type="button"
          className="age-gate__confirm-btn"
          aria-label={t('ageGate.confirmAria')}
          tabIndex={0}
          onClick={handleConfirmClick}
          onKeyDown={handleConfirmKeyDown}
        >
          {t('ageGate.confirmButton')}
        </button>
      </div>

      <div className="age-gate__disclaimer">
        <p className="age-gate__disclaimer-text">
          {t('ageGate.disclaimer1')}
        </p>
        <p className="age-gate__disclaimer-text">
          {t('ageGate.disclaimer2')}{' '}
          <a href={`${import.meta.env.BASE_URL}info/terms-of-use`} className="age-gate__link">{t('ageGate.termsOfUse')}</a>
          {' '}{t('ageGate.and')}{' '}
          <a href={`${import.meta.env.BASE_URL}info/privacy-policy`} className="age-gate__link">{t('ageGate.privacyPolicy')}</a>
        </p>
      </div>
    </div>
  )
}

export function getStoredAgeConfirmed(): boolean {
  return localStorage.getItem(STORAGE_KEY_AGE) === 'true'
}

export function getStoredContentType(): ContentType | null {
  const v = localStorage.getItem(STORAGE_KEY_CONTENT_TYPE)
  if (v === 'gay' || v === 'straight' || v === 'trans') return v
  return null
}
