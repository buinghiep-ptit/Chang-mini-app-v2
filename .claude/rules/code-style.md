---
description: TypeScript strict, React component pattern, import order, Tailwind, comments
globs: src/**/*.ts,src/**/*.tsx
alwaysApply: false
---

# Code Style

> Naming: xem `naming-conventions.md`. Error handling: xem `error-handling.md`.

## TypeScript

- **Strict mode bắt buộc.** Không tắt rule trong `tsconfig`.
- **`interface` cho props** (object shape mở rộng được), **`type` cho union/alias**.
- **Không `any`.** Nếu thực sự không biết kiểu → `unknown` + type guard.
- **Không non-null assertion (`!`) bừa.** Check rồi throw, hoặc dùng optional chaining.
- **Type return của hàm public** — kể cả khi suy ra được, vẫn khai báo để contract rõ.

```ts
// ✅
interface ButtonProps { label: string; onClick: () => void }
type Status = 'idle' | 'loading' | 'error'

function parseResponse(data: unknown): string {
  if (typeof data !== 'string') throw new Error('Expected string')
  return data
}

// ❌
type ButtonProps = { label: string }   // type cho props
function parseResponse(data: any) {}   // any
const el = document.getElementById('root')!  // non-null bừa
```

## React Component

- **Arrow function + named export.** Không default export, không class component.
- **Destructure props** ngay ở signature, default ở đó.
- **Hooks ở đầu component**, không nằm trong condition/loop.
- **`useCallback` / `useMemo`** chỉ khi có vấn đề perf thực sự (prop xuống child memo, deps lớn).
- **Tách logic phức tạp ra custom hook** thay vì nhét vào component.
- **JSX > ~30 dòng** → extract sub-component.

```tsx
// ✅
interface AvatarProps { src: string; alt: string; size?: number }

export const Avatar = ({ src, alt, size = 32 }: AvatarProps) => (
  <img src={src} alt={alt} width={size} height={size} />
)
```

## Import order

```tsx
// 1. React
import { useState } from 'react'
// 2. Third-party
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
// 3. Internal (@/)
import { useChatStore } from '@/store/chat-store'
import { Button } from '@/components/ui/button'
// 4. Relative
import { ConvItem } from './conv-item'
// 5. Types only (cuối)
import type { Conversation } from '@/store/chat-store'
```

Luôn dùng alias `@/` thay `../../../`.

## Tailwind

- **Không hex/rgb hardcode** — luôn qua CSS token (`bg-primary`, `text-muted-foreground`).
- **Không viết `dark:`** trong component — token tự swap qua `.dark` class.
- **Nhóm className dài bằng `cn()`** theo thứ tự: layout → box model → visual → state.

```tsx
<button className={cn(
  'flex items-center gap-2',          // layout
  'px-4 py-2 rounded-lg',             // box model
  'bg-primary text-primary-foreground text-sm',  // visual
  'hover:bg-primary/90 transition',   // state
  disabled && 'opacity-50 cursor-not-allowed',
)} />
```

## Comments

Mặc định **không viết comment**. Chỉ thêm khi WHY không rõ:

- Ràng buộc ẩn / invariant tinh tế
- Workaround cho bug cụ thể
- Behavior gây bất ngờ

❌ Không comment WHAT (đã rõ từ tên biến), không refer task/PR/issue trong comment.

## File tổ chức

- Mỗi file 1 component export.
- Type/interface dùng nội bộ → khai báo cùng file. Type dùng chéo → `types/` hoặc co-locate ở module gốc.
- Hằng số dùng > 1 nơi → tách `constants.ts`; dùng 1 nơi → khai báo tại chỗ.
