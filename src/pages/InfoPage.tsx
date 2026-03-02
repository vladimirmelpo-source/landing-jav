import { Link, useParams } from 'react-router-dom'
import { INFO_PAGES } from '@/data/info-pages'
import { useI18n } from '@/i18n'
import './info-page.css'

export function InfoPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useI18n()
  const page = slug ? INFO_PAGES[slug] : null

  if (!page) {
    return (
      <div className="info-page">
        <Link to="/" className="info-page__back" aria-label={t('menu.home')}>
          <span aria-hidden="true">←</span> {t('menu.home')}
        </Link>
        <h1>Page not found</h1>
      </div>
    )
  }

  return (
    <div className="info-page">
      <Link
        to="/"
        className="info-page__back"
        aria-label={t('menu.home')}
        tabIndex={0}
      >
        <span className="info-page__back-arrow" aria-hidden="true">
          ←
        </span>{' '}
        {t('menu.back')}
      </Link>
      <article className="info-page__content">
        <h1 className="info-page__title">{page.title}</h1>
        <div className="info-page__body">
          {page.content.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para.replace(/\n/g, ' ')}</p>
          ))}
        </div>
      </article>
    </div>
  )
}
