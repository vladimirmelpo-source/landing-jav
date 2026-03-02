import { useMemo } from 'react'
import { LANDING_VIDEOS } from '@/data/landingVideos'
import { landingVideosToItems } from '@/data/landingVideosUtils'
import type { VideoItem } from '@/types/video'

/** Видео с карты лендинга (хардкод). Видосы и превью тянутся по URL из карты. */
export function useVideos(): { items: VideoItem[]; loading: boolean; error: Error | null } {
  const items = useMemo(() => landingVideosToItems(LANDING_VIDEOS), [])
  return { items, loading: false, error: null }
}
