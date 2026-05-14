---
description: Cây thư mục, alias, routing convention, vị trí đặt file mới
globs:
alwaysApply: true
---

# Project Structure

## Cây thư mục chuẩn

```
src/
├── routes/             # TanStack Router file-based — auto sinh routeTree.gen.ts
│   ├── __root.tsx      # Layout root (MobileShell + AppLayout)
│   ├── index.tsx       # /
│   ├── chat/
│   │   ├── index.tsx   # /chat
│   │   └── $chatId.tsx # /chat/:chatId
│   ├── apps.tsx
│   ├── tasks.tsx
│   └── menu.tsx
├── pages/              # Page component thuần UI — KHÔNG chứa route logic
├── components/
│   ├── chang/          # Chang-specific: TopBar, Composer, MessageBubble, Mascot
│   ├── layout/         # MobileShell, AppLayout, BottomNav, SidebarNav
│   └── ui/             # shadcn/ui (do `npx shadcn add` sinh ra)
├── hooks/              # Custom hooks — kebab-case, prefix `use-`
├── services/           # API service per-domain — gọi `http`
├── store/              # Zustand stores — kebab-case
├── lib/                # `http.ts`, `utils.ts` (`cn()`)
├── styles/
│   └── globals.css     # Tailwind v4 + CSS tokens
└── assets/             # Static (mascot PNG, ...)
```

## Nguyên tắc

1. **Routes chỉ wire-up.** Logic UI nằm ở `pages/`. Route file chỉ `createFileRoute(...)` + import page.
2. **Pages không gọi API trực tiếp.** Gọi qua hook ở `hooks/queries/` hoặc service trong `services/`.
3. **Components phân theo phạm vi:**
   - `ui/` — generic, reusable, không biết domain (shadcn).
   - `chang/` — biết domain Chang (chat, mascot, composer).
   - `layout/` — wrapper layout, navigation.
4. **Mỗi file 1 component** (trừ component nội bộ < 30 dòng).
5. **Đặt tên file: kebab-case** (`message-bubble.tsx`, `use-chat-scroll.ts`).
6. **Không tạo `index.ts` re-export** trừ khi cần barrel cho public API.

## Khi thêm route mới

```tsx
// src/routes/my-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import { MyPage } from '@/pages/my-page'

export const Route = createFileRoute('/my-page')({ component: MyPage })
```

`@tanstack/router-plugin` (Vite) tự sinh `src/routeTree.gen.ts` — **không sửa tay**.

## Khi thêm shadcn component

```bash
npx shadcn add button input card ...
```

`components.json` đã chốt: `baseColor: violet`, `css: src/styles/globals.css`.

## Alias

`@/` → `src/`. Luôn dùng alias thay đường dẫn tương đối sâu (`../../../`).
