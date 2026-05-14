---
description: Token, sign out, XSS, secret, CSP, dependency audit
globs:
alwaysApply: true
---

# Security

## 1. Authentication

- **Token storage**: `localStorage.access_token` (đủ cho MVP). Sau MVP cân nhắc HttpOnly cookie + refresh flow.
- **Axios interceptor** đính `Authorization: Bearer <token>` tự động — không paste token thủ công.
- **401 response** → xoá `chang-sdk:*` keys + redirect `/login`. Tránh loop redirect bằng check pathname.

## 2. Sign out

Khi sign out phải **xoá sạch**:

```ts
localStorage.removeItem('chang-sdk:v1:auth')
localStorage.removeItem('chang-sdk:v1:conversations')
localStorage.removeItem('chang-sdk:v1:preferences')
queryClient.clear()         // xoá TanStack Query cache
useChatStore.persist.clearStorage()  // hoặc tương đương
window.location.href = '/login'
```

## 3. Input handling

- **Không `dangerouslySetInnerHTML`** với content từ user / API. Markdown phải qua sanitizer (streamdown đã sanitize).
- **Không `eval`, `new Function`** với input động.
- **URL từ user/AI**: validate scheme (`http`/`https` only), thêm `rel="noopener noreferrer"` và `target="_blank"` khi cần.

## 4. XSS

- React tự escape — không bypass.
- Nếu phải render HTML từ AI: chạy qua `DOMPurify` (cài khi cần).
- Không inline `<script>` chứa data động.

## 5. Secrets

- **Không commit** `.env`, token, API key. `.env.example` chỉ có placeholder.
- Biến VITE_* sẽ **vào bundle public** — đừng để secret ở đó. Chỉ chứa public config (API base URL).
- Backend là biên duy nhất nắm secret.

## 6. CORS / postMessage (embed)

- Khi nhúng iframe: validate `event.origin` trước khi xử lý `postMessage`.
- Whitelist host được phép nhúng (qua header `Content-Security-Policy: frame-ancestors`).

## 7. CSP (production)

Đề xuất header:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';      ← Tailwind inline cần
  img-src 'self' data: https:;
  connect-src 'self' https://api.chang.example.com;
  frame-ancestors https://*.fpt.com;
```

Cấu hình ở edge (CDN / reverse proxy), không ở Vite.

## 8. Dependency audit

- `yarn audit` định kỳ trước release.
- Pin major version trong `package.json`, để `yarn.lock` quyết định resolution.
- Không cài lib < 1k weekly downloads trừ khi chính chủ Anthropic / Tanstack / Radix / shadcn.

## 9. Checklist trước khi commit

- [ ] Không có `console.log(token)`, không log payload chứa PII.
- [ ] Không có `eval`, `dangerouslySetInnerHTML` không sanitize.
- [ ] `.env*` không bị `git add` (xem `.gitignore`).
- [ ] API call mới có error handling (xem `error-handling.md`).
