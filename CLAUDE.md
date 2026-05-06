# CLAUDE.md — Chang SDK Mini App v2

## Stack

| Layer | Tool |
|---|---|
| Bundler | Vite 6 |
| UI framework | React 19 + TypeScript |
| Styling | Tailwind v4 (`@tailwindcss/vite`) + shadcn/ui convention |
| Routing | **TanStack Router** (file-based, `src/routes/`) |
| Data fetching | **TanStack Query** + **Axios** (`src/lib/http.ts`) |
| Theme | `next-themes` — class `.dark` on `<html>` |
| Toast | `sonner` |
| Form | `react-hook-form` + `@hookform/resolvers` + `zod` |
| Package manager | **yarn** |

## Commands

```bash
yarn dev        # dev server at http://localhost:5173
yarn build      # tsc + vite build → dist/
yarn preview    # preview dist/
```

## Map nhanh

```
src/
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx    # Root layout (MobileShell wrapper)
│   ├── index.tsx     # / → HomePage
│   ├── conversation.tsx
│   ├── apps.tsx
│   ├── tasks.tsx
│   ├── menu.tsx
│   └── conversation-2.tsx
├── pages/            # Page components (pure UI, no route logic)
├── components/
│   ├── chang/        # Chang-specific: TopBar, Composer, Mascot
│   ├── layout/       # MobileShell (mobile-first, card on tablet+)
│   └── ui/           # shadcn/ui components (add via: npx shadcn add <name>)
├── lib/
│   ├── utils.ts      # cn() helper
│   └── http.ts       # Axios instance (Bearer token + 401 redirect)
├── styles/
│   └── globals.css   # Tailwind v4 import + CSS vars (violet theme)
└── assets/
    └── chang-mascot.png
```

## Design system

- **Primary**: Violet 600 · `hsl(var(--primary))`
- **Radius base**: `rounded-lg` = 16px
- **Token rule**: không bao giờ dùng hex trực tiếp — dùng `bg-primary`, `text-muted-foreground`, `chart-1…6`, v.v.
- **Dark mode**: toggle class `dark` trên `<html>` qua `next-themes`. Không tự viết dark variant.
- **Mascot**: chỉ dùng trong empty/welcome/thinking states, không recolor.
- Xem `SKILL.md` để biết token cheat-sheet đầy đủ.

## Mobile-first layout

`MobileShell` trong `src/components/layout/mobile-shell.tsx`:
- **Mobile**: full screen (`w-full h-dvh`)
- **Tablet+**: centered card 390×844, `rounded-[2.5rem]`, `shadow-xl`

## Routing pattern (TanStack Router file-based)

Thêm route mới: tạo file trong `src/routes/`. Router plugin tự generate `src/routeTree.gen.ts`.

```tsx
// src/routes/my-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import { MyPage } from '@/pages/my-page'
export const Route = createFileRoute('/my-page')({ component: MyPage })
```

## shadcn/ui components

```bash
npx shadcn add button input card badge avatar ...
```

`components.json` đã được cấu hình với `baseColor: violet`, `css: src/styles/globals.css`.

## API / Data fetching

```tsx
import { useQuery } from '@tanstack/react-query'
import { http } from '@/lib/http'

const { data } = useQuery({
  queryKey: ['conversations'],
  queryFn: () => http.get('/conversations').then(r => r.data),
})
```

Axios base URL: `VITE_API_URL` env var (default `/api`).
