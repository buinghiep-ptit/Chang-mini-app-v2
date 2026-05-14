---
description: Console levels, error reporting (Sentry placeholder), Web Vitals, devtools
globs: src/**/*.ts,src/**/*.tsx
alwaysApply: false
---

# Monitoring & Observability

> Frontend SDK ưu tiên gọn nhẹ. Monitoring tối giản, không over-engineering.

## 1. Logging

### Console levels

| Mức     | Khi dùng                                              |
| ------- | ----------------------------------------------------- |
| `error` | Lỗi không kỳ vọng — bắt được trong catch, ErrorBoundary |
| `warn`  | Tình huống lạ nhưng app vẫn chạy (deprecated, quota)  |
| `info`  | Sự kiện quan trọng (sign in, conversation created) — **chỉ dev mode** |
| `debug` | Trace chi tiết — **chỉ khi cần debug**, xoá trước commit |

```ts
if (import.meta.env.DEV) console.info('conversation created', id)
console.error('stream failed', err)  // luôn log error production
```

### Cấm

- ❌ `console.log` để lại trong code production (rotate sang `console.error`/`info` có ngữ cảnh hoặc xoá).
- ❌ Log payload chứa token, password, PII.
- ❌ Log trong vòng lặp / render — chỉ ở event handler / catch.

## 2. Error reporting (post-MVP)

Chuẩn bị tích hợp Sentry / equivalent ở Phase 19-20:

```ts
// src/lib/reporter.ts (placeholder)
export const reporter = {
  capture: (err: unknown, ctx?: Record<string, unknown>) => {
    console.error(err, ctx)
    // Sentry.captureException(err, { extra: ctx })
  },
}
```

Gọi `reporter.capture` ở:

- Axios response interceptor (lỗi 5xx).
- ErrorBoundary fallback.
- Mutation `onError` toàn cục (QueryCache).

## 3. Performance

### Web Vitals

Track LCP / CLS / INP qua `web-vitals` (cài khi tới Phase 20):

```ts
import { onLCP, onCLS, onINP } from 'web-vitals'
onLCP(reporter.metric)
onCLS(reporter.metric)
onINP(reporter.metric)
```

### Target

- LCP < 2.5s (4G)
- INP < 200ms
- Bundle initial ≤ 250KB gzipped
- Lighthouse Performance ≥ 85 mobile

## 4. Custom metrics

Đo điểm quan trọng tay:

```ts
const t0 = performance.now()
await chatStream.start()
reporter.metric('chat.first_token_ms', performance.now() - t0)
```

Metric ưu tiên (Phase 17+):

- `chat.first_token_ms` — TTFB streaming.
- `chat.stream_duration_ms`.
- `chat.error_rate` — fail / total.

## 5. Dev DX

- **TanStack Query Devtools** bật ở dev — xem cache, refetch.
- **TanStack Router Devtools** bật ở dev — xem route tree.
- **Tắt cả hai ở production** (`if (import.meta.env.DEV)`).

## 6. User-facing feedback

- Toast (sonner) cho action thành công / lỗi.
- Loading skeleton, không spinner full screen.
- Empty state có CTA.

Không lạm dụng toast — chỉ khi user cần biết. Action im lặng (auto-save) → không toast.

## 7. Checklist deploy

- [ ] `console.log` đã clean.
- [ ] Source map upload Sentry (sau khi tích hợp).
- [ ] Devtools tắt ở build production.
- [ ] Web Vitals tracking active.
