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


# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
