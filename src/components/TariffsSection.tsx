import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n'
import type { Tariff } from '@/types/tariff'
import { submitEmailToSheet } from '@/api/subscribe'
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

const PAYMENT_IDS = ['card', 'crypto', 'alipay', 'pay', 'oxxo', 'pix', 'upi'] as const

export function TariffsSection({ items, loading, error, onRegistrationComplete, initialEmail, variant = 'section' }: Props) {
  const { t } = useI18n()
  const [email, setEmail] = useState(initialEmail ?? '')
  const [emailTouched, setEmailTouched] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string>('card')

  useEffect(() => {
    if (items.length && (selectedId === null || !items.some((i) => i.id === selectedId))) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId])

  const emailInvalid = email.trim() === ''
  const showEmailError = emailTouched && emailInvalid

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailTouched(true)
    if (submitStatus === 'error' || submitStatus === 'success') setSubmitStatus('idle')
  }, [submitStatus])

  const handleEmailBlur = useCallback(() => {
    setEmailTouched(true)
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setEmailTouched(true)
      if (emailInvalid) return
      setSubmitStatus('loading')
      const result = await submitEmailToSheet(email.trim())
      if (result.ok) {
        setSubmitStatus('success')
        setEmail('')
        setEmailTouched(false)
        onRegistrationComplete?.()
      } else {
        setSubmitStatus('error')
      }
    },
    [email, emailInvalid, onRegistrationComplete]
  )

  const handleSelectTariff = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const getPaymentLabel = (id: string) => {
    switch (id) {
      case 'card':
        return t('tariffs.paymentCard')
      case 'crypto':
        return t('tariffs.paymentCrypto')
      case 'alipay':
        return t('tariffs.paymentAlipay')
      case 'pay':
        return t('tariffs.paymentPay')
      case 'oxxo':
        return t('tariffs.paymentOxxo')
      case 'pix':
        return t('tariffs.paymentPix')
      case 'upi':
        return t('tariffs.paymentUpi')
      default:
        return id
    }
  }

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

        <div className="tariffs-section__payments">
          <p className="tariffs-section__payments-label visually-hidden">{t('header.payment')}</p>
          <div className="tariffs-section__payments-grid" role="group">
            {PAYMENT_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`tariffs-section__payment-btn ${selectedPayment === id ? 'tariffs-section__payment-btn--selected' : ''}`}
                onClick={() => setSelectedPayment(id)}
                aria-pressed={selectedPayment === id}
                aria-label={getPaymentLabel(id)}
              >
                {getPaymentLabel(id)}
              </button>
            ))}
          </div>
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
                  onBlur={handleEmailBlur}
                  placeholder={t('header.emailPlaceholder')}
                  className={`tariffs-section__input ${showEmailError ? 'tariffs-section__input--invalid' : ''}`}
                  required
                  aria-required="true"
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? 'tariffs-email-error' : undefined}
                  autoComplete="email"
                />
                {showEmailError && (
                  <p id="tariffs-email-error" className="tariffs-section__error" role="alert">
                    {t('header.emailRequired')}
                  </p>
                )}
              </div>
              {submitStatus === 'success' && (
                <p className="tariffs-section__success" role="status">
                  {t('tariffs.submitSuccess')}
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="tariffs-section__error tariffs-section__error--submit" role="alert">
                  {t('tariffs.submitError')}
                </p>
              )}
              <button
                type="submit"
                className="tariffs-section__submit"
                aria-label={t('tariffs.createAccountButton')}
                disabled={submitStatus === 'loading'}
              >
                {submitStatus === 'loading' ? '...' : t('tariffs.createAccountButton')}
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
