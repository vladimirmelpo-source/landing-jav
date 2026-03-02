import type { LandingVideoCard } from '@/types/video'
import type { VideoItem } from '@/types/video'

const PREFERRED_LOCALES = ['en', 'ja', 'zh', 'de', 'ko', 'tw', 'vi', 'th', 'id', 'hi', 'pt', 'es']

function getTitle(card: LandingVideoCard): string {
  const t = card.title
  for (const locale of PREFERRED_LOCALES) {
    if (t[locale]?.trim()) return t[locale].trim()
  }
  const first = Object.values(t).find((s) => s?.trim())
  return (first as string)?.trim() ?? card.id
}

/** Карту лендинга в плоские элементы для секции. Превью/видео — по ссылкам из карты. */
export function landingVideosToItems(cards: LandingVideoCard[]): VideoItem[] {
  return cards
    .slice()
    .sort((a, b) => a.top_position - b.top_position)
    .map((c) => ({
      id: c.id,
      title: getTitle(c),
      videoUrl: c.src.md,
      thumbnailUrl: c.thumb_src.md,
      thumbnailUrlSm: c.thumb_src.sm,
      videoUrlSm: c.src.sm,
      channelName: `Studio ${c.studio_id}`,
      tags: c.tags ?? []
    }))
}
