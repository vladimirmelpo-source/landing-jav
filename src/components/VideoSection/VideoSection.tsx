import { useState, useCallback, useEffect } from 'react'
import { useI18n } from '@/i18n'
import type { VideoItem } from '@/types/video'
import './video-section.css'

interface Props {
  items: VideoItem[]
  loading: boolean
  error: Error | null
  /** Слот между блоком выбранного видео и списком «Другие видео» (например, тарифы) */
  children?: React.ReactNode
  /** По клику «Смотреть полное видео» — переход на страницу тарифов */
  onWatchFullVideo?: () => void
}

const MuteIcon = ({ muted }: { muted: boolean }) => (
  <svg className="video-section__preview-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    {muted ? (
      <>
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
  </svg>
)

export function VideoSection({ items, loading, error, children, onWatchFullVideo }: Props) {
  const { t } = useI18n()
  const [selectedId, setSelectedId] = useState<string>(() => (items.length ? items[0].id : ''))
  const [previewMuted, setPreviewMuted] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)

  const selected: VideoItem | null = selectedId ? items.find((v) => v.id === selectedId) ?? null : null

  const handleVideoError = useCallback(() => {
    setVideoError((prev) => prev ?? selectedId ?? '')
  }, [selectedId])

  const handleVideoLoaded = useCallback(() => {
    setVideoError(null)
  }, [])

  useEffect(() => {
    setVideoError(null)
  }, [selectedId])

  useEffect(() => {
    if (items.length && !items.some((v) => v.id === selectedId)) {
      setSelectedId(items[0].id)
    }
  }, [items, selectedId])

  const handleSelectVideo = useCallback((id: string) => {
    setSelectedId(id)
    document.getElementById('video-featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleMuteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setPreviewMuted((m) => !m)
  }, [])

  const handleWatchFullVideoClick = useCallback(() => {
    if (onWatchFullVideo) {
      onWatchFullVideo()
    } else if (selected?.videoUrl) {
      window.open(selected.videoUrl, '_blank', 'noopener,noreferrer')
    }
  }, [onWatchFullVideo, selected?.videoUrl])

  if (error) {
    return (
      <section className="video-section" aria-label={t('video.sectionLabel')}>
        <p className="video-section__error">{error.message}</p>
      </section>
    )
  }
  if (loading) {
    return (
      <section className="video-section" aria-label={t('video.sectionLabel')}>
        <p className="video-section__loading">{t('video.loading')}</p>
      </section>
    )
  }
  if (!items.length) {
    return (
      <section className="video-section" aria-label={t('video.sectionLabel')}>
        <p className="video-section__empty">{t('video.noVideos')}</p>
      </section>
    )
  }

  return (
    <section className="video-section" aria-label={t('video.sectionLabel')}>
      {/* Блок выбранного видео */}
      {selected && (
        <div id="video-featured" className="video-section__featured">
          <div className="video-section__preview-wrap">
            <div className="video-section__preview-inner">
              {videoError === selected.id ? (
                <img
                  src={selected.thumbnailUrl ?? selected.thumbnailUrlSm}
                  alt=""
                  className="video-section__preview-img video-section__preview-img--fallback"
                  width={394}
                  height={222}
                  loading="eager"
                />
              ) : (
                <video
                  key={selected.id}
                  className="video-section__preview-video"
                  src={selected.videoUrlSm ?? selected.videoUrl}
                  poster={selected.thumbnailUrl ?? selected.thumbnailUrlSm}
                  muted={previewMuted}
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                  width={394}
                  height={222}
                  aria-label={selected.title}
                  onError={handleVideoError}
                  onLoadedData={handleVideoLoaded}
                />
              )}
            </div>
            <div className="video-section__preview-controls">
              <button
                type="button"
                className="video-section__preview-btn"
                onClick={handleMuteClick}
                aria-label={previewMuted ? t('video.muteOn') : t('video.muteOff')}
                tabIndex={0}
              >
                <MuteIcon muted={previewMuted} />
              </button>
            </div>
          </div>

          <div className="video-section__card">
            <div className="video-section__card-avatar" aria-hidden="true">
              {selected.channelName?.charAt(0) ?? '?'}
            </div>
            <div className="video-section__card-body">
              <h2 className="video-section__card-title">{selected.title}</h2>
              {(selected.tags?.length ?? 0) > 0 && (
                <ul className="video-section__card-tags" role="list">
                  {(selected.tags ?? []).map((tag) => (
                    <li key={tag} className="video-section__card-tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {selected.channelName && (
                <p className="video-section__card-channel">{selected.channelName}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="video-section__cta"
            onClick={handleWatchFullVideoClick}
            aria-label={t('video.watchFullVideo')}
          >
            {t('video.watchFullVideo')}
          </button>
        </div>
      )}

      {children != null ? <div className="video-section__slot">{children}</div> : null}

      {/* Рекомендуемые видео (Related videos) */}
      <div className="video-section__others">
        <h3 className="video-section__others-title">{t('video.relatedVideos')}</h3>
        <ul className="video-section__grid" role="list">
          {items
            .filter((v) => v.id !== selectedId)
            .map((v) => (
              <li key={v.id} className="video-section__tile" role="listitem">
                <button
                  type="button"
                  className="video-section__tile-btn"
                  onClick={() => handleSelectVideo(v.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelectVideo(v.id)
                    }
                  }}
                  aria-label={`${t('video.selectVideo')}: ${v.title}`}
                  tabIndex={0}
                >
                  <div className="video-section__tile-media">
                    <img
                      src={v.thumbnailUrlSm ?? v.thumbnailUrl}
                      alt=""
                      className="video-section__tile-img"
                      width={264}
                      height={264}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="video-section__tile-info">
                    <div
                      className="video-section__tile-avatar"
                      aria-hidden="true"
                      title={v.channelName ?? undefined}
                    >
                      {v.channelName?.charAt(0) ?? (
                        <svg className="video-section__tile-avatar-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      )}
                    </div>
                    <div className="video-section__tile-body">
                      <span className="video-section__tile-title">{v.title}</span>
                      {(v.channelName ?? v.tags?.[0]) && (
                        <span className="video-section__tile-desc">
                          {v.channelName ?? v.tags?.[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}
