import { useState, useCallback } from 'react'
import { useI18n } from '@/i18n'
import { MembershipPopup } from '@/components/MembershipPopup'
import type { Tariff } from '@/types/tariff'
import './membership-block.css'

const LockIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

const CancelIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
  </svg>
)

const CrownIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
)

const BuildingIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M8 10h.01M16 14h.01M8 14h.01" />
  </svg>
)

const PriceIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const UsersIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const QualityIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="membership-block__benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const BENEFITS: Array<{ key: string; Icon: () => JSX.Element }> = [
  { key: 'encrypted', Icon: LockIcon },
  { key: 'noAdultPayments', Icon: CheckIcon },
  { key: 'cancelAnytime', Icon: CancelIcon },
  { key: 'trialAvailable', Icon: CrownIcon },
  { key: 'localPayments', Icon: BuildingIcon },
  { key: 'affordable', Icon: PriceIcon },
  { key: 'dailyUpdates', Icon: UsersIcon },
  { key: 'highQuality', Icon: QualityIcon },
  { key: 'downloads', Icon: DownloadIcon },
]

interface Props {
  items?: Tariff[]
  loading?: boolean
  error?: Error | null
  onRegistrationComplete?: () => void
}

export function MembershipBlock({
  items = [],
  loading = false,
  error = null,
  onRegistrationComplete,
}: Props) {
  const { t } = useI18n()
  const [popupOpen, setPopupOpen] = useState(false)

  const handleGetMembershipClick = useCallback(() => {
    setPopupOpen(true)
  }, [])

  const handlePopupClose = useCallback(() => {
    setPopupOpen(false)
  }, [])

  const handleGetMembershipKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleGetMembershipClick()
    }
  }

  return (
    <>
    <aside className="membership-block" aria-label={t('membership.sectionLabel')}>
      <h2 className="membership-block__title">
        {t('membership.titleLine1')}{' '}
        <span className="membership-block__title-accent">{t('membership.titleLine2')}</span>
      </h2>

      <button
        type="button"
        className="membership-block__cta"
        onClick={handleGetMembershipClick}
        onKeyDown={handleGetMembershipKeyDown}
        aria-label={t('membership.ctaAria')}
        tabIndex={0}
      >
        {t('membership.cta')}
      </button>

      <ul className="membership-block__benefits" role="list">
        {BENEFITS.map(({ key, Icon }) => (
          <li key={key} className="membership-block__benefit" role="listitem">
            <Icon />
            <span>{t(`membership.benefits.${key}`)}</span>
          </li>
        ))}
      </ul>

      <div className="membership-block__images" aria-hidden="true">
        <div className="membership-block__img-wrap" />
        <div className="membership-block__img-wrap" />
      </div>

      <p className="membership-block__copyright">{t('membership.copyright')}</p>
    </aside>

    <MembershipPopup
      isOpen={popupOpen}
      onClose={handlePopupClose}
      items={items}
      loading={loading}
      error={error}
      onRegistrationComplete={onRegistrationComplete}
    />
    </>
  )
}
