/** Карточка видео с карты лендинга (хардкод) */
export interface LandingVideoCard {
  id: string
  id_video: number
  studio_id: number
  src: { sm: string; md: string }
  thumb_src: { sm: string; md: string }
  title: Record<string, string> // en, ja, zh, ...
  type: string
  model: unknown[]
  tags: string[]
  top_position: number
}

/** Нормализованный элемент для отображения в секции */
export interface VideoItem {
  id: string
  title: string
  videoUrl: string
  thumbnailUrl: string
  /** опционально: маленькое превью для сетки */
  thumbnailUrlSm?: string
  videoUrlSm?: string
  /** название канала / студии */
  channelName?: string
  /** теги для отображения */
  tags?: string[]
}

export interface VideosResponse {
  items: VideoItem[]
  total?: number
}
