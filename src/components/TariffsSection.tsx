import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n'
import type { Tariff } from '@/types/tariff'
import { submitToBiller } from '@/api/tariffs'
import './TariffsSection/tariffs-section.css'

interface Props {
  items: Tariff[]
  loading: boolean
  error: Error | null
  onRegistrationComplete?: () => void
  /** Pre-fill email when used inside MembershipPopup */
  initialEmail?: string
  variant?: 'section' | 'popup'
}

export function TariffsSection({ items, loading, error, initialEmail, variant = 'section' }: Props) {
  const { t } = useI18n()
  const [email, setEmail] = useState(initialEmail ?? '')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (items.length && (selectedId === null || !items.some((i) => i.id === selectedId))) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const optionId = selectedId ?? items[0]?.id
      if (!optionId) return
      submitToBiller(optionId, email.trim() || undefined)
    },
    [email, selectedId, items]
  )

  const handleSelectTariff = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const sectionId = variant === 'section' ? 'tariffs' : undefined

  if (error) {
    return (
      <section id={sectionId} className="tariffs-section" aria-label={t('tariffs.title')}>
        <div className="tariffs-section__panel">
          <p className="tariffs-section__error-msg">{error.message}</p>
        </div>
      </section>
    )
  }
  if (loading) {
    return (
      <section id={sectionId} className="tariffs-section" aria-label={t('tariffs.title')}>
        <div className="tariffs-section__panel">
          <p className="tariffs-section__loading">{t('tariffs.loading')}</p>
        </div>
      </section>
    )
  }

  return (
    <section id={sectionId} className="tariffs-section" aria-label={t('tariffs.title')}>
      <div className="tariffs-section__panel">
        <h2 className="tariffs-section__title">{t('tariffs.joinTitle')}</h2>

        {items.length > 0 && (
          <div className="tariffs-section__list" role="list">
            {items.map((tariff) => {
              const isSelected = selectedId === tariff.id
              const totalLine =
                tariff.period === 'Lifetime'
                  ? `Lifetime for ${tariff.currency ?? '$'}${tariff.price}`
                  : `${tariff.period} for ${tariff.currency ?? '$'}${tariff.price}`
              return (
                <article
                  key={tariff.id}
                  role="listitem"
                  className={`tariffs-section__row ${isSelected ? 'tariffs-section__row--selected' : ''}`}
                >
                  <div className="tariffs-section__radio-wrap">
                    <span
                      className={`tariffs-section__radio ${isSelected ? 'tariffs-section__radio--checked' : ''}`}
                      aria-hidden="true"
                    />
                  </div>
                  <button
                    type="button"
                    className="tariffs-section__row-btn"
                    onClick={() => handleSelectTariff(tariff.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectTariff(tariff.id)
                      }
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${tariff.displayName ?? tariff.name}, ${totalLine}`}
                    tabIndex={0}
                  >
                    <div className="tariffs-section__row-top">
                      <span className="tariffs-section__row-name">{tariff.displayName ?? tariff.name}</span>
                      {tariff.badges?.length ? (
                        <span className="tariffs-section__badges">
                          {tariff.badges.map((b, i) => (
                            <span
                              key={i}
                              className={`tariffs-section__badge tariffs-section__badge--${b.type}`}
                              aria-hidden="true"
                            >
                              {b.text}
                            </span>
                          ))}
                        </span>
                      ) : null}
                      {tariff.dayPrice ? (
                        <span className="tariffs-section__row-dayprice">{tariff.dayPrice}</span>
                      ) : null}
                    </div>
                    <div className="tariffs-section__row-total">{totalLine}</div>
                  </button>
                </article>
              )
            })}
          </div>
        )}

        {items.length === 0 && <p className="tariffs-section__empty">{t('tariffs.noTariffs')}</p>}

        <div className="tariffs-section__payments" role="group" aria-label={t('header.payment')}>
          <span className="tariffs-section__payment-card-only">{t('tariffs.paymentCard')}</span>
        </div>

        {variant !== 'popup' && (
          <div className="tariffs-section__form-wrap">
            <p className="tariffs-section__form-heading">
              {t('tariffs.createOrSignInPrefix')}
              <a href="#" className="tariffs-section__form-signin" aria-label={t('tariffs.signIn')}>
                {t('tariffs.signIn')}
              </a>
            </p>
            <form className="tariffs-section__form" onSubmit={handleSubmit} noValidate>
              <div className="tariffs-section__form-row">
                <label htmlFor="tariffs-email" className="visually-hidden">
                  {t('header.email')}
                </label>
                <input
                  id="tariffs-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t('header.emailPlaceholder')}
                  className="tariffs-section__input"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="tariffs-section__submit"
                aria-label={t('tariffs.createAccountButton')}
              >
                {t('tariffs.createAccountButton')}
              </button>
            </form>
            <p className="tariffs-section__footer-agree">
              {t('tariffs.footerAgreePrefix')}
              <a href="#" className="tariffs-section__footer-link">{t('ageGate.termsOfUse')}</a>
              {t('tariffs.footerAgreeAnd')}
              <a href="#" className="tariffs-section__footer-link">{t('ageGate.privacyPolicy')}</a>
              {t('tariffs.footerAgreeSuffix')}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
