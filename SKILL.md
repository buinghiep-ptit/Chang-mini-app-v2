# SKILL.md — using the Chang shadcn/ui design system

Always read this file before building anything on top of the Chang DS.

## What this system is

shadcn/ui-flavored: Radix primitives + Tailwind v4 utilities, all wired through CSS variables in `tokens.css`. Every color, radius, font and shadow flows from one place. Don't reach for raw hex values; use semantic tokens.

## Setup

Every preview page does the same three things:

```html
<link rel="stylesheet" href="../tokens.css" />     <!-- tokens + Tailwind v4 -->
<!-- React + Babel pinned versions -->
<script type="text/babel" src="ui.jsx"></script>   <!-- shared primitives -->
```

`tokens.css` already `@import`s `https://unpkg.com/@tailwindcss/browser@4` so you don't add Tailwind separately.

## Token cheat-sheet

Use semantic tokens, not raw colors.

| Need | Use |
|---|---|
| Page surface | `bg-background text-foreground` |
| Cards / panels | `bg-card text-card-foreground border-border` |
| Subdued surface | `bg-muted` |
| Subdued text | `text-muted-foreground` |
| Primary action | `bg-primary text-primary-foreground` |
| Outlines / focus ring | `border-input` / `ring-ring` |
| Status | `bg-success`, `bg-warning`, `bg-destructive`, `bg-info` |
| Capability tile palette | `chart-1 … chart-6` (chart-3 = mascot orange) |
| Radius | `rounded-md` (12) · `rounded-lg` (16, base) · `rounded-xl` (20) · `rounded-2xl` (24) |
| Shadow | `shadow-sm` · `shadow-md` · `shadow-lg` (CSS var-driven, dark-aware) |

## Components

Import from `window` after loading `ui.jsx`:

```js
const { Button, Input, Field, Switch, Checkbox, Radio,
        Card, Badge, Avatar, Alert, Tabs, Tooltip, Sheet,
        Icon, Mascot, ThemeProvider, ThemeToggle } = window;
```

- `<Button variant size>` — `default | secondary | outline | ghost | link | destructive`, `sm | md | lg | icon`.
- `<Field label hint error>{<Input/>}</Field>` — wraps a control with label + helper text.
- `<Sheet side="bottom" open onClose>` — bottom-sheet (mobile) or right-drawer.
- `<Icon name size>` — Lucide-style strokes; full list in `PATHS` inside `ui.jsx`.

## Chang-specific patterns

- **Capability tile** — square card, icon in tinted square (15% of `chart-N`), verb + concrete object underneath. Six verbs: Tra cứu / Đặt lịch / Soạn thảo / Phân tích / Dịch / Học.
- **Conversation bubble** — user = `bg-primary` with `tail-r`; Chang = `bg-muted` with `tail-l`. Avatar (mascot) only on Chang side, only on first bubble of a turn.
- **Composer** — pill-shaped row, paperclip + input + mic + circular send button.
- **Mascot** — empty/welcome/thinking states only. Never recolor.

## Mobile-first scaling

Mobile screens live in `<IOSFrame>` at 360 wide. Desktop layouts are **re-flow, not redesign**: same tokens, same components, just a sidebar + main grid. See `screens.jsx` for the pairing.

## Dark mode

Toggle class `dark` on `<html>`. `ThemeProvider` does this. Don't hand-write dark variants — use semantic tokens and they swap automatically.

## When extending

1. Add the token to `tokens.css` (both `:root` and `.dark`).
2. Wire it into `@theme inline`.
3. Use `bg-…` / `text-…` utilities. Never hard-code colors in markup.

## When in doubt

Open `preview/foundations.html` and `preview/components.html`. Every pattern that exists in this DS is shown there with the exact tokens to use.
