---
description: Client-side persistence — localStorage, Zustand persist, schema versioning, backend contract types
globs: src/store/**/*.ts,src/store/**/*.tsx,src/lib/http.ts,src/types/**/*.ts
alwaysApply: false
---

# Database / Persistence

> Frontend SDK — không có database trực tiếp. File này quy ước về **client-side persistence** (localStorage / IndexedDB) và contract dữ liệu với backend.

## 1. Client-side storage

| Lưu trữ          | Dùng cho                                     |
| ---------------- | -------------------------------------------- |
| `localStorage`   | `access_token`, theme, conversations (qua Zustand persist), language |
| `sessionStorage` | (Hiện chưa dùng)                             |
| `IndexedDB`      | Dự phòng cho payload lớn (sau MVP, qua `idb-keyval` nếu cần) |
| Memory (state)   | UI ephemeral, không cần khôi phục            |

## 2. Quy ước key

Prefix tất cả key với `chang-sdk:` để tránh xung đột với host app:

```
chang-sdk:v1:auth           → { access_token, expires_at }
chang-sdk:v1:conversations  → Zustand persist payload
chang-sdk:v1:preferences    → theme, language
```

**Versioned key (`:v1`):** đổi schema → bump version + viết migration.

## 3. Zustand persist

```ts
import { persist } from 'zustand/middleware'

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({ /* state + actions */ }),
    {
      name: 'chang-sdk:v1:conversations',
      version: 1,
      migrate: (persisted, version) => {
        // chuyển v0 → v1 nếu cần
        return persisted as ChatState
      },
      partialize: (state) => ({
        // CHỈ persist field cần thiết
        conversations: state.conversations,
        currentId: state.currentId,
      }),
    },
  ),
)
```

**Không persist:**

- Token đang streaming (transient).
- UI flags (`isComposerOpen`, ...).
- Trạng thái loading / error.

## 4. Quota & lỗi

- `localStorage` quota ~5MB / origin.
- Bắt lỗi `QuotaExceededError` khi write → toast nhẹ + log, không crash.
- Trim conversations cũ nếu cần (giữ N mới nhất).

## 5. Bảo mật

- ❌ **Không lưu password / refresh token nhạy cảm** trong localStorage. Chỉ short-lived `access_token`.
- ❌ Không lưu PII (số CMND, số thẻ) ở client.
- Xoá toàn bộ key `chang-sdk:*` khi sign out (xem `security.md`).

## 6. Backend contract (tham khảo)

Schema định nghĩa ở backend. Frontend chỉ import **type** mirror:

```ts
// src/types/api.ts (hoặc tự sinh từ OpenAPI sau)
export interface Conversation {
  id: string
  title: string
  createdAt: string  // ISO 8601
  updatedAt: string
  messageCount: number
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'chang'
  content: string
  status: 'sending' | 'streaming' | 'done' | 'error'
  createdAt: string
}
```

**Không tự định nghĩa lệch backend.** Khi schema BE đổi → sync ngay file types.
