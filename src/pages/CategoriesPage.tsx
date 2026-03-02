import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n'
import './categories-page.css'

const CATEGORIES = [
  'Uncensored',
  'HD',
  'Amateur',
  'MILF',
  'Teen',
  'Mature',
  'Hardcore',
  'Softcore',
  'Japanese',
  'Asian',
  'Lesbian',
  'Gay',
  'Trans',
  'Anal',
  'Oral',
  'Fetish',
  'BDSM',
  'VR',
  '4K',
]

export function CategoriesPage() {
  const { t } = useI18n()

  return (
    <div className="categories-page">
      <Link
        to="/"
        className="categories-page__back"
        aria-label={t('menu.home')}
        tabIndex={0}
      >
        <span className="categories-page__back-arrow" aria-hidden="true">
          ←
        </span>{' '}
        {t('menu.back')}
      </Link>
      <article className="categories-page__content">
        <h1 className="categories-page__title">{t('menu.categoriesAndTags')}</h1>
        <ul className="categories-page__list" role="list">
          {CATEGORIES.map((cat) => (
            <li key={cat} className="categories-page__item">
              <a
                href="https://www.javhd.com/categories"
                target="_blank"
                rel="noopener noreferrer"
                className="categories-page__link"
              >
                {cat}
              </a>
            </li>
          ))}
        </ul>
        <p className="categories-page__note">
          {t('menu.categoriesNote')}
        </p>
      </article>
    </div>
  )
}
