---
description: Stack đã chốt của dự án — package manager, framework, lib bắt buộc/cấm
globs:
alwaysApply: true
---

# Tech Stack

> Khoá cứng. Không tự ý đổi tool/lib. Cần thay → mở thảo luận trước.

## Stack chính

| Layer           | Tool                                                  |
| --------------- | ----------------------------------------------------- |
| Package manager | **yarn** (không npm/pnpm/bun)                         |
| Bundler         | Vite 6                                                |
| Language        | TypeScript 5 strict                                   |
| UI framework    | React 19                                              |
| Styling         | Tailwind v4 (`@tailwindcss/vite`) + shadcn/ui         |
| Routing         | TanStack Router (file-based, `src/routes/`)           |
| Data fetching   | TanStack Query + Axios (`@/lib/http`)                 |
| State (global)  | Zustand                                               |
| Form            | react-hook-form + `@hookform/resolvers` + zod         |
| Animation       | framer-motion                                         |
| Theme           | next-themes — class `.dark` trên `<html>`             |
| Toast           | sonner                                                |
| Icons           | lucide-react                                          |
| Font            | Inter Variable (`@fontsource-variable/inter`)         |
| Markdown        | streamdown                                            |

## Lệnh

```bash
yarn dev        # dev server http://localhost:5173
yarn build      # tsc + vite build → dist/
yarn preview    # preview dist/
```

## Cấm

- ❌ React Router DOM (đã dùng TanStack Router)
- ❌ Redux / Recoil / Jotai cho global state (đã dùng Zustand)
- ❌ Fetch raw / axios mới (luôn qua `@/lib/http`)
- ❌ CSS module / styled-components / emotion (chỉ Tailwind + tokens)
- ❌ Class component (chỉ function component + hooks)

## Env

```ts
import.meta.env.VITE_API_URL  // base URL backend, default '/api'
```

Khai báo type mới: thêm vào `src/vite-env.d.ts`.
