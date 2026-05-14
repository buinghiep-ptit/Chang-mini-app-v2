# PLAN — Phase 01: Project Setup Foundation

> File thực thi cho Phase 01. Phase plan (mô tả mục tiêu) tại `plans/phase-01-project-setup-foundation.md`.
> File này là **checklist hành động** cụ thể đang/sẽ thực hiện.

---

## Mục tiêu Phase 01

Hoàn thiện foundation: project init, package manager, bundler, linting, base configs — sao cho mọi phase sau có sẵn môi trường ổn định để chạy `yarn dev`.

---

## Pre-flight check

| Hạng mục               | Trạng thái | Ghi chú                                  |
| ---------------------- | ---------- | ---------------------------------------- |
| Node ≥ 20              | ☐          | `node -v`                                |
| Yarn ≥ 1.22            | ☐          | `yarn -v`                                |
| Git repo init          | ✅         | branch `main`                            |
| `.gitignore`           | ✅         | exclude `node_modules`, `dist`, `.env`   |

---

## Checklist thực thi

### 1. Vite + React + TypeScript

- [x] `package.json` cấu hình script `dev` / `build` / `preview`
- [x] `vite.config.ts` với `@vitejs/plugin-react` + `@tailwindcss/vite` + `@tanstack/router-plugin`
- [x] `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json` — strict mode
- [x] Alias `@/` → `src/`

**Verify:** `yarn dev` → mở `http://localhost:5173`, thấy trang React mặc định không lỗi.

### 2. Tailwind v4

- [x] Cài `tailwindcss` + `@tailwindcss/vite`
- [x] Import `@import "tailwindcss"` trong `src/styles/globals.css`
- [x] CSS variables (HSL) cho design tokens (primary, background, foreground, ...)
- [x] Class `.dark` swap tokens

**Verify:** Thử `<div className="bg-primary text-primary-foreground">` render đúng màu.

### 3. shadcn/ui scaffolding

- [x] `components.json` (baseColor: violet, css: `src/styles/globals.css`)
- [x] `src/lib/utils.ts` với `cn()` helper
- [x] Thư mục `src/components/ui/` sẵn sàng nhận shadcn add

**Verify:** `npx shadcn add button` → file mới sinh ra ở `components/ui/button.tsx`.

### 4. TanStack Router (file-based)

- [x] Cài `@tanstack/react-router` + `@tanstack/router-plugin` + devtools
- [x] Thư mục `src/routes/` với `__root.tsx` + `index.tsx`
- [x] Auto-generate `routeTree.gen.ts` qua plugin

**Verify:** Vào `/` thấy HomePage, `routeTree.gen.ts` được tạo tự động khi `yarn dev`.

### 5. TanStack Query + Axios

- [x] Cài `@tanstack/react-query` + `@tanstack/react-query-devtools`
- [x] `src/lib/http.ts` — Axios instance + interceptor Bearer token + 401 redirect
- [x] `QueryClientProvider` wrap trong `main.tsx`

**Verify:** `http.get('/healthz')` (giả lập) trả về data; 401 trigger redirect.

### 6. Zustand store skeleton

- [x] Cài `zustand`
- [x] `src/store/chat-store.tsx` với type `Conversation`, `Message` + actions cơ bản
- [x] Có thể `useChatStore()` từ bất kỳ component nào

**Verify:** Component test gọi `useChatStore.getState().createConversation(...)` chạy không lỗi.

### 7. Theme (next-themes)

- [x] Cài `next-themes`
- [x] `ThemeProvider attribute="class" defaultTheme="light"` trong `main.tsx`

**Verify:** Toggle `.dark` class trên `<html>` đổi màu toàn site.

### 8. Toast (sonner)

- [x] Cài `sonner`
- [x] `<Toaster />` render trong `main.tsx` (cuối tree)

**Verify:** `toast.success('hello')` hiển thị notification.

### 9. Form (react-hook-form + zod)

- [x] Cài `react-hook-form` + `@hookform/resolvers` + `zod`

**Verify:** Sẵn sàng dùng — sẽ test thực tế khi cần form ở phase sau.

### 10. Font + Icons

- [x] Cài `@fontsource-variable/inter` — Inter Variable
- [x] Cài `lucide-react`
- [x] Font khai báo trong `globals.css` (`font-sans`)

**Verify:** Body render bằng Inter; `<Mail />` icon hiển thị.

### 11. Folder convention

```
src/
├── routes/        ✅
├── pages/         ✅
├── components/
│   ├── chang/     ✅
│   ├── layout/    ✅
│   └── ui/        ✅
├── store/         ✅
├── lib/           ✅
├── styles/        ✅
├── hooks/         ✅
└── assets/        ✅
```

### 12. Coding rules

- [x] `CLAUDE.md` — instructions cho AI
- [x] `.claude/rules/general.md`
- [x] `.claude/rules/coding-style.md`
- [x] `.claude/rules/react-components.md`
- [x] `.claude/rules/api-conventions.md`
- [x] `AGENTS.md` — top-level rules

---

## Acceptance Criteria Phase 01

- [x] `yarn dev` chạy không lỗi tại `http://localhost:5173`.
- [x] `yarn build` build thành công vào `dist/`.
- [x] Dark mode toggle hoạt động trên trang Home.
- [x] Import alias `@/` hoạt động.
- [x] Tạo route mới chỉ cần thêm file trong `src/routes/`.

---

## Hoàn tất Phase 01

Khi tất cả checklist trên đã `[x]`:

1. Ghi entry vào `CHANGELOG.md` với ngày thực tế.
2. Đánh dấu Phase 01 là `[x]` trong `plans/master-plan.md`.
3. Mở `plans/phase-02-design-system-tokens.md` và bắt đầu Phase 02.

---

## Risks & Mitigations

| Risk                                       | Mitigation                                       |
| ------------------------------------------ | ------------------------------------------------ |
| Conflict version giữa React 19 + lib cũ    | Pin version trong `package.json`, theo `yarn.lock` |
| Tailwind v4 syntax khác v3                 | Bám theo docs v4; không copy v3 patterns         |
| TanStack Router plugin chưa generate tree  | Restart `yarn dev`, xoá `.tanstack/` cache       |
