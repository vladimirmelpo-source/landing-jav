# Лендинг

Лендинг тянет **видео + превью** и **тарифы** с сервера.

## Структура

```
src/
  api/           # запросы к серверу
    client.ts    # общий fetch, BASE из env
    videos.ts    # GET /api/videos
    tariffs.ts   # GET /api/tariffs
  types/         # video.ts, tariff.ts
  hooks/         # useVideos, useTariffs
  components/    # VideoSection, TariffsSection
  styles/
```

## Ожидаемый API сервера

- **GET /api/videos** → `{ items: Array<{ id, title, videoUrl, thumbnailUrl, ... }> }`
- **GET /api/tariffs** → `{ items: Array<{ id, name, price, currency?, period?, features?, ctaText?, ctaUrl?, highlighted? }> }`

Превью и видео: в ответе приходят URL (абсолютные или относительные к `VITE_API_BASE`).

## Запуск

```bash
npm i
cp .env.example .env   # поправить VITE_API_BASE при необходимости
npm run dev
```

Сборка: `npm run build`.
