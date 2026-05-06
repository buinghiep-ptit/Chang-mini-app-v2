# Chang SDK · Design System (shadcn/ui edition)

Bộ design system cho Chang — trợ lý AI nội bộ. Phiên bản này thay thế bản Ant Design cũ, dùng **shadcn/ui** (Radix + Tailwind v4) làm nền.

## Cấu trúc

```
tokens.css                 — single source of truth: CSS vars + @theme + base
preview/
  index.html               — landing, dẫn vào 3 trang chính
  foundations.html         — color, type, spacing, radius, shadow, motion
  components.html          — 12 nhóm component + Chang chat + command palette
  ui-kit.html              — 5 màn hình × {mobile, desktop}
  ui.jsx                   — React primitives shadcn-flavored
  screens.jsx              — màn hình mobile/desktop dùng trong UI Kit
  ios-frame.jsx            — device frame (starter component)
assets/chang-mascot.png    — mascot
```

## Quyết định chính

| | |
|---|---|
| **Primary** | Violet 600 · `#7C3AED` (HSL `262 83% 58%`) |
| **Accent / Warning** | Mascot orange · `#FAAD14` |
| **Radius base** | `1rem` (16px) — feels iOS / mobile |
| **Theme** | Light + Dark, toggle ở mọi trang preview |
| **Stack** | Tailwind v4 (`@tailwindcss/browser`) + shadcn HSL convention |
| **Footprint** | Mobile-first, scale lên desktop bằng grid re-flow |

## Cách dùng

```html
<link rel="stylesheet" href="tokens.css" />
<!-- tokens.css đã @import Tailwind v4 sẵn -->
```

Sau đó dùng utility Tailwind quen thuộc:

```html
<button class="h-10 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
  Hỏi Chang
</button>
```

Mọi `bg-primary`, `text-foreground`, `border-border`, `rounded-lg`… đều đọc từ CSS vars trong `tokens.css` — đổi var, đổi cả hệ.

## shadcn convention

CSS vars là **HSL triplets không có `hsl()` wrapper**, đúng chuẩn shadcn. Bạn có thể paste bất kỳ snippet shadcn upstream nào và nó chạy ngay:

```css
--primary: 262 83% 58%;            /* triplet, không phải hsl(…) */
```

```html
<div style="background: hsl(var(--primary))"/>
```

## Dark mode

Toggle bằng class `.dark` trên `<html>`. `ThemeProvider` trong `ui.jsx` lo việc này.

## Mascot

Nhân vật, không phải decoration. Quy tắc trong `foundations.html → 10 · Mascot rules`.
