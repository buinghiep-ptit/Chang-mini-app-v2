---
description: Kiến trúc tổng thể — provider hierarchy, data flow, state boundaries, layout strategy
globs:
alwaysApply: true
---

# System Design

> Kiến trúc tổng thể frontend SDK. Cập nhật khi đổi shape lớn (provider, layer chính).

## Bố cục cao

```
┌─────────────────────────────────────────────────────────┐
│  Host App (iframe / script embed)                       │
│  └── Chang SDK Mini App                                 │
│      ├── Providers (Query · Theme · Router · Toast)     │
│      ├── Routes (TanStack)                              │
│      │     └── Pages (UI only)                          │
│      │         └── Components (chang / layout / ui)     │
│      ├── State (Zustand stores)                         │
│      ├── Hooks (queries / mutations / local)            │
│      ├── Services (axios per domain)                    │
│      └── lib/http → Axios → Backend API                 │
└─────────────────────────────────────────────────────────┘
```

## Provider hierarchy (`main.tsx`)

Thứ tự cố định:

```
QueryClientProvider           ← TanStack Query cache
  ThemeProvider               ← next-themes, attribute="class"
    RouterProvider            ← TanStack Router
    Toaster                   ← sonner (đặt cuối tree)
```

Zustand **không cần Provider** — `useChatStore` gọi trực tiếp ở bất kỳ component nào.

## Data flow

```
User action
  → Component handler
    → Hook (useMutation / store action)
      → Service (axios call) ─── hoặc ─── Store (Zustand update)
        → Backend API                       → Subscribers re-render
          → onSuccess: invalidateQueries
            → useQuery refetch
              → Component re-render
```

**Quy tắc:**

- Component không gọi `http` trực tiếp.
- Store không gọi API — store là pure state. API call ở service + hook.
- Service không biết React (không import hook, không dùng `useState`).

## Layout strategy

`AppLayout` branch theo breakpoint Tailwind `md` (768px):

- **Mobile** (`< md`): full-screen + `BottomNav` cố định đáy.
- **Tablet/Desktop** (`md+`): sidebar 272–300px + `<Outlet />`, không BottomNav.

`MobileShell` xử lý viewport: `100dvh`, safe-area iOS, scroll-lock khi modal mở.

## Theming

- CSS custom properties trong `:root` và `.dark`.
- Component dùng token (`bg-primary`, `text-muted-foreground`) — không hex, không `dark:` variant.
- Switch theme chỉ toggle class `.dark` trên `<html>` qua next-themes.

## State boundaries

| Loại state              | Đặt ở đâu                         |
| ----------------------- | --------------------------------- |
| Server data (API)       | TanStack Query cache              |
| Cross-route UI state    | Zustand store                     |
| Local 1 component       | `useState` / `useReducer`         |
| URL state (filter, tab) | TanStack Router search params     |
| Persisted (theme, conv) | Zustand + persist middleware → localStorage |

**Đừng** lưu cùng 1 thông tin ở 2 nơi (state + URL, state + cache). Chọn 1 source of truth.

## Streaming

Endpoint AI dùng SSE (`text/event-stream`). Hook `useChatStream`:

- Mở connection khi user submit.
- Append token vào store qua `appendStreamToken`.
- Abort khi user click "Stop" hoặc unmount.

## SDK embed

Build output là static `dist/`. Host nhúng qua:

- `<iframe src="https://chang.example.com/?theme=dark">` (chính)
- Hoặc `<script src=".../chang-sdk.js">` (sau MVP)

Communication qua `postMessage` — định nghĩa schema khi tới Phase 20.
