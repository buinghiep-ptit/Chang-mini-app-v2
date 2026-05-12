# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

| Layer           | Tool                                                        |
| --------------- | ----------------------------------------------------------- |
| Bundler         | Vite 6                                                      |
| UI framework    | React 19 + TypeScript                                       |
| Styling         | Tailwind v4 (`@tailwindcss/vite`) + shadcn/ui convention    |
| Routing         | **TanStack Router** (file-based, `src/routes/`)             |
| Data fetching   | **TanStack Query** + **Axios** (`src/lib/http.ts`)          |
| State           | **Zustand** (`src/store/chat-store.tsx`)                    |
| Animation       | `framer-motion` (chat message transitions)                  |
| Theme           | `next-themes` — class `.dark` on `<html>`                   |
| Toast           | `sonner`                                                    |
| Form            | `react-hook-form` + `@hookform/resolvers` + `zod`           |
| Package manager | **yarn**                                                    |

## Commands

```bash
yarn dev        # dev server at http://localhost:5173
yarn build      # tsc + vite build → dist/
yarn preview    # preview dist/
```

## File map

```
src/
├── routes/                  # TanStack Router — file-based, auto-generates routeTree.gen.ts
│   ├── __root.tsx           # Root layout (MobileShell + AppLayout)
│   ├── index.tsx            # / → HomePage
│   ├── chat/
│   │   ├── index.tsx        # /chat → (redirect or empty)
│   │   └── $chatId.tsx      # /chat/:chatId → ChatPage
│   ├── apps.tsx             # /apps → AppsPage
│   ├── tasks.tsx            # /tasks → TasksPage
│   └── menu.tsx             # /menu → MenuSettingPage
├── pages/                   # Page components (pure UI, no route logic)
│   ├── home.tsx
│   ├── chat.tsx
│   ├── apps.tsx
│   ├── tasks.tsx
│   └── menu-setting.tsx
├── components/
│   ├── chang/               # Chang-specific: TopBar, Composer, MessageBubble, Mascot
│   ├── layout/              # MobileShell, AppLayout, BottomNav, SidebarNav
│   └── ui/                  # shadcn/ui components
├── store/
│   └── chat-store.tsx       # Zustand store — conversations + actions (createConversation, addUserMsg, addChangMsg, ...)
├── lib/
│   ├── utils.ts             # cn() helper
│   └── http.ts              # Axios instance (Bearer token + 401 redirect)
├── styles/
│   └── globals.css          # Tailwind v4 import + CSS vars
└── assets/
    └── chang-mascot.png
```

## Design system

Xem **`DESIGN.md`** — token đầy đủ, component specs, motion catalog, do & don't.

Tóm tắt nhanh:

- **Primary**: Violet 600 · `hsl(var(--primary))`
- **Radius base**: `rounded-lg` = 16px
- Không dùng hex trực tiếp — luôn dùng CSS tokens (`bg-primary`, `text-muted-foreground`, `chart-1…6`)
- Không viết `dark:` variant trong component — token tự swap qua `.dark` class
- Mascot: chỉ trong empty / welcome / thinking states, không recolor

## Routing

Thêm route mới: tạo file trong `src/routes/`. Router Vite plugin tự generate `src/routeTree.gen.ts`.

```tsx
// src/routes/my-page.tsx
import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "@/pages/my-page";
export const Route = createFileRoute("/my-page")({ component: MyPage });
```

## shadcn/ui

```bash
npx shadcn add button input card badge avatar ...
```

`components.json` đã cấu hình `baseColor: violet`, `css: src/styles/globals.css`.

## Provider hierarchy (main.tsx)

```
QueryClientProvider
  ThemeProvider (attribute="class", defaultTheme="light")
    RouterProvider
    Toaster (sonner)
```

Zustand store không cần Provider — `useChatStore` có thể gọi trực tiếp từ bất kỳ component nào.

## Authentication

`http.ts` tự động đính Bearer token từ `localStorage.getItem('access_token')` vào mọi request. Nếu nhận 401, xóa token và redirect về `/login`.

## Layout

`AppLayout` (`src/components/layout/app-layout.tsx`) render responsive:

- **Mobile** (`< md`): full-screen + `BottomNav`
- **Tablet/Desktop** (`md+`): sidebar 272–300px + `<Outlet />` (không có BottomNav)

## API / Data fetching

```tsx
import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";

const { data } = useQuery({
  queryKey: ["conversations"],
  queryFn: () => http.get("/conversations").then((r) => r.data),
});
```

Axios base URL: `VITE_API_URL` env var (default `/api`).

---

## Coding guidelines

### 1. Think Before Coding

Trước khi implement:

- Nêu rõ assumption. Nếu không chắc → hỏi.
- Nếu có nhiều cách hiểu → trình bày, không tự chọn im lặng.
- Nếu có cách đơn giản hơn → nói ra, phản biện khi cần.

### 2. Simplicity First

- Không thêm feature ngoài yêu cầu.
- Không tạo abstraction cho code chỉ dùng một lần.
- Không viết error handling cho scenario không thể xảy ra.
- Nếu viết 200 dòng mà có thể là 50 → viết lại.

### 3. Surgical Changes

Khi sửa code hiện có:

- Không "cải thiện" code xung quanh, comment, hay format.
- Không refactor thứ không bị lỗi.
- Match style hiện tại, dù có thể làm khác.
- Phát hiện dead code không liên quan → nhắc, không xóa.

Khi thay đổi tạo ra orphan: xóa import/variable/function do **thay đổi của mình** tạo ra. Không xóa dead code có sẵn.

Kiểm tra: mỗi dòng thay đổi phải truy xuất được về yêu cầu của người dùng.

### 4. Goal-Driven Execution

Với task nhiều bước, state plan ngắn:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Tiêu chí thành công rõ ràng → có thể tự loop đến khi đúng mà không cần hỏi lại.
