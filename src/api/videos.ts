import { request } from './client'
import type { VideosResponse } from '@/types/video'

/** Список видео с превью с сервера */
export function fetchVideos(): Promise<VideosResponse> {
  return request<VideosResponse>('/api/videos')
}

/** Одно видео по id (если нужно) */
export function fetchVideo(id: string): Promise<VideosResponse> {
  return request<VideosResponse>(`/api/videos/${id}`)
}
