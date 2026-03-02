import { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n'
import type { LocaleCode } from '@/i18n'
import { submitEmailToSheet } from '@/api/subscribe'
import './header.css'

const JAVHD_BASE = 'https://www.javhd.com'
const INFO_LINKS: { slug: string; key: string }[] = [
  { slug: 'content-removal', key: 'menu.contentRemoval' },
  { slug: 'dmca', key: 'menu.dmca' },
  { slug: 'for-creators', key: 'menu.forCreators' },
  { slug: 'terms-of-use', key: 'menu.termsOfUse' },
  { slug: 'privacy-policy', key: 'menu.privacyPolicy' },
  { slug: 'refund-policy', key: 'menu.refundPolicy' },
  { slug: 'affiliate-program', key: 'menu.affiliateProgram' },
  { slug: 'parental-control', key: 'menu.parentalControl' },
]

interface HeaderProps {
  isRegistered?: boolean
}

const LOCALES: { code: LocaleCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'ru', label: 'Русский', flag: 'ru' },
  { code: 'ja', label: 'Japanese', flag: 'jp' },
  { code: 'es', label: 'Spanish', flag: 'es' },
  { code: 'pt', label: 'Portuguese', flag: 'pt' },
]

/* Упрощённые флаги: UK, JP, ES, PT — как inline SVG для доступности */
const FlagIcon = ({ code }: { code: string }) => {
  const viewBox = '0 0 24 18'
  if (code === 'gb') {
    return (
      <svg className="header__lang-flag" viewBox={viewBox} aria-hidden="true">
        <rect width="24" height="18" fill="#012169" />
        <path d="M0 0l24 18M24 0L0 18" stroke="#fff" strokeWidth="4" />
        <path d="M0 0l24 18M24 0L0 18" stroke="#C8102E" strokeWidth="2.5" />
        <path d="M12 0v18M0 9h24" stroke="#fff" strokeWidth="6" />
        <path d="M12 0v18M0 9h24" stroke="#C8102E" strokeWidth="4" />
      </svg>
    )
  }
  if (code === 'jp') {
    return (
      <svg className="header__lang-flag" viewBox={viewBox} aria-hidden="true">
        <rect width="24" height="18" fill="#fff" />
        <circle cx="12" cy="9" r="5" fill="#BC002D" />
      </svg>
    )
  }
  if (code === 'es') {
    return (
      <svg className="header__lang-flag" viewBox={viewBox} aria-hidden="true">
        <rect width="24" height="6" y="0" fill="#AA151B" />
        <rect width="24" height="6" y="6" fill="#F1BF00" />
        <rect width="24" height="6" y="12" fill="#AA151B" />
      </svg>
    )
  }
  if (code === 'pt') {
    return (
      <svg className="header__lang-flag" viewBox={viewBox} aria-hidden="true">
        <rect width="24" height="18" fill="#006600" />
        <path d="M12 9L0 0v18l12-9z" fill="#FF0000" />
        <circle cx="9" cy="9" r="4" fill="#FFFF00" stroke="#003399" strokeWidth="0.8" />
      </svg>
    )
  }
  if (code === 'ru') {
    return (
      <svg className="header__lang-flag" viewBox={viewBox} aria-hidden="true">
        <rect width="24" height="6" y="0" fill="#fff" />
        <rect width="24" height="6" y="6" fill="#0039A6" />
        <rect width="24" height="6" y="12" fill="#D52B1E" />
      </svg>
    )
  }
  return null
}

export function Header({ isRegistered = false }: HeaderProps) {
  const { locale: currentLocale, setLocale, t } = useI18n()
  const navigate = useNavigate()
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentEmail, setPaymentEmail] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentLocaleData = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0]

  const handleLangOptionClick = useCallback(
    (code: LocaleCode) => {
      setLocale(code)
      setLangOpen(false)
    },
    [setLocale]
  )

  const handleLangTriggerClick = useCallback(() => {
    setLangOpen((o) => !o)
    setMenuOpen(false)
    setPaymentOpen(false)
  }, [])

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setPaymentOpen(true)
    setLangOpen(false)
    setMenuOpen(false)
    setPaymentEmail('')
    setPaymentError('')
    setPaymentSuccess(false)
  }, [])

  const handleBurgerClick = useCallback(() => {
    setMenuOpen((o) => !o)
    setLangOpen(false)
    setPaymentOpen(false)
  }, [])

  const handlePaymentClose = useCallback(() => {
    setPaymentOpen(false)
    setPaymentError('')
    setPaymentSuccess(false)
  }, [])

  const handlePaymentSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const email = paymentEmail.trim()
      if (!email) {
        setPaymentError(t('header.emailRequired'))
        return
      }
      setPaymentError('')
      setPaymentLoading(true)
      const result = await submitEmailToSheet(email)
      setPaymentLoading(false)
      if (result.ok) {
        setPaymentSuccess(true)
        setPaymentEmail('')
        setTimeout(() => {
          setPaymentOpen(false)
          setPaymentSuccess(false)
        }, 1500)
      } else {
        setPaymentError(t('header.submitError'))
      }
    },
    [paymentEmail, t]
  )

  const handlePaymentEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentEmail(e.target.value)
    if (paymentError) setPaymentError('')
  }, [paymentError])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('.header__burger') && !target.closest('.header__menu-panel')) {
          setMenuOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setLangOpen(false)
      setMenuOpen(false)
      setPaymentOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      <header className="header" role="banner">
        <div className="header__lang-wrap" ref={langRef}>
          <button
            type="button"
            className={`header__lang-trigger header__lang${langOpen ? ' header__lang--open' : ''}`}
            onClick={handleLangTriggerClick}
            aria-expanded={langOpen}
            aria-haspopup="listbox"
            aria-label={t('header.langSelector')}
            tabIndex={0}
          >
            <FlagIcon code={currentLocaleData.flag} />
            <svg className="header__lang-arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {langOpen && (
            <ul
              className="header__lang-dropdown"
              role="listbox"
              aria-label={t('header.langSelector')}
            >
              {LOCALES.map((loc) => (
                <li key={loc.code} role="option" aria-selected={currentLocale === loc.code}>
                  <button
                    type="button"
                    className={`header__lang-option${currentLocale === loc.code ? ' header__lang-option--active' : ''}`}
                    onClick={() => handleLangOptionClick(loc.code)}
                  >
                    {loc.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          className="header__logo"
          onClick={handleLogoClick}
          aria-label={t('header.payment')}
          tabIndex={0}
        >
          <span>JAV</span>
          <span className="header__logo-badge">HD</span>
        </button>

        <button
          type="button"
          className="header__burger"
          onClick={handleBurgerClick}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t('header.closeMenu') : t('header.openMenu')}
          tabIndex={0}
        >
          <span className="header__burger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </header>

      {/* Оверлей и панель бургер-меню */}
      <div
        className="header__menu-overlay"
        style={{ visibility: menuOpen ? 'visible' : 'hidden', opacity: menuOpen ? 1 : 0 }}
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
      />
      <div
        ref={menuRef}
        className={`header__menu-panel ${menuOpen ? 'header__menu-panel--open' : ''}`}
        role="dialog"
        aria-label={t('menu.title')}
        aria-modal="true"
        hidden={!menuOpen}
      >
        <div className="header__menu-brand">JAV HD</div>
        <button
          type="button"
          className="header__menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label={t('header.closeMenu')}
        >
          ✕
        </button>
        <nav aria-label="Основная навигация">
          <ul className="header__menu-list">
            {INFO_LINKS.map(({ slug, key }) => (
              <li key={slug} className="header__menu-item">
                <Link
                  to={`/info/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="header__menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            <li className="header__menu-item">
              <Link
                to="/info/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="header__menu-link"
                onClick={() => setMenuOpen(false)}
              >
                {t('menu.contactUs')}
                <span className="header__menu-hint" aria-hidden="true">?</span>
              </Link>
            </li>
            <li className="header__menu-divider" aria-hidden="true" />
            <li className="header__menu-item">
              <a
                href={`${JAVHD_BASE}/dvd`}
                target="_blank"
                rel="noopener noreferrer"
                className="header__menu-link"
                onClick={() => setMenuOpen(false)}
              >
                {t('menu.dvd')}
              </a>
            </li>
            <li className="header__menu-item">
              <Link
                to="/categories"
                className="header__menu-link header__menu-link--categories"
                onClick={() => setMenuOpen(false)}
              >
                <span>{t('menu.categoriesAndTags')}</span>
                <svg className="header__menu-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M4 6h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 12h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
                </svg>
              </Link>
            </li>
            <li className="header__menu-divider" aria-hidden="true" />
            {isRegistered ? (
              <li className="header__menu-item">
                <button
                  type="button"
                  className="header__menu-link header__menu-link--btn"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/tariffs')
                  }}
                >
                  {t('menu.becomeMember')}
                </button>
              </li>
            ) : (
              <>
                <li className="header__menu-item">
                  <button
                    type="button"
                    className="header__menu-link header__menu-link--btn"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/tariffs')
                    }}
                  >
                    {t('menu.createNewAccount')}
                  </button>
                </li>
                <li className="header__menu-item">
                  <button
                    type="button"
                    className="header__menu-link header__menu-link--btn"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/tariffs')
                    }}
                  >
                    {t('menu.signIn')}
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <footer className="header__menu-footer">
          <a
            href={`${JAVHD_BASE}/en/2257`}
            target="_blank"
            rel="noopener noreferrer"
            className="header__menu-footer-link"
          >
            18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement
          </a>
          <p className="header__menu-footer-text">VECTOR INNOVATIONS LTD</p>
          <p className="header__menu-footer-text">11 Blackheath Village London SE3 9LA England</p>
          <p className="header__menu-footer-text">
            <a href="https://jvbill.com" target="_blank" rel="noopener noreferrer">JVBill.com</a>,
            {' '}<a href="https://vend-o.com" target="_blank" rel="noopener noreferrer">Vend-o.com</a>,
            {' '}<a href="https://segpayeu.com" target="_blank" rel="noopener noreferrer">SegPayEU.com</a>,
            {' '}<a href="https://centrohelp.eu" target="_blank" rel="noopener noreferrer">CentroHelp.eu</a>
            {' '}our authorized sales agent.
          </p>
        </footer>
      </div>

      {/* Модалка формы оплаты */}
      <div
        className={`header__payment-overlay ${paymentOpen ? 'header__payment-overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        aria-hidden={!paymentOpen}
        onClick={(e) => e.target === e.currentTarget && handlePaymentClose()}
      >
        <div className="header__payment-modal" onClick={(e) => e.stopPropagation()}>
          <h2 id="payment-title" className="header__payment-title">
            {t('header.payment')}
          </h2>
          <form className="header__payment-form" onSubmit={handlePaymentSubmit} noValidate>
            {paymentSuccess && (
              <p className="header__payment-success" role="status">
                {t('header.submitSuccess')}
              </p>
            )}
            <div className="header__payment-field">
              <label htmlFor="header-payment-email" className="header__payment-label">
                {t('header.email')}
              </label>
              <input
                id="header-payment-email"
                type="email"
                className="header__payment-input"
                placeholder={t('header.emailPlaceholder')}
                value={paymentEmail}
                onChange={handlePaymentEmailChange}
                autoComplete="email"
                aria-invalid={!!paymentError}
                aria-describedby={paymentError ? 'payment-email-error' : undefined}
                disabled={paymentLoading || paymentSuccess}
              />
              {paymentError && (
                <p id="payment-email-error" className="header__payment-error" role="alert">
                  {paymentError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="header__payment-submit"
              disabled={paymentLoading || paymentSuccess}
            >
              {paymentLoading ? '...' : t('header.createAccount')}
            </button>
          </form>
          <button
            type="button"
            className="header__payment-close"
            onClick={handlePaymentClose}
            aria-label={t('header.close')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
