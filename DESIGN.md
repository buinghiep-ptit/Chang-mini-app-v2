---
name: Chang SDK Mini App — Design System v1
theme: Violet / Minimal Clean
modes: light + dark
font: Inter Variable
colors:
  # ── Light ──────────────────────────────────────────────────────
  background:           "hsl(0 0% 100%)"
  foreground:           "hsl(240 10% 4%)"
  card:                 "hsl(0 0% 100%)"
  card-foreground:      "hsl(240 10% 4%)"
  primary:              "hsl(262 83% 58%)"    # Violet 600
  primary-foreground:   "hsl(0 0% 100%)"
  secondary:            "hsl(240 5% 96%)"
  secondary-foreground: "hsl(240 6% 10%)"
  muted:                "hsl(240 5% 96%)"
  muted-foreground:     "hsl(240 4% 46%)"
  accent:               "hsl(240 5% 96%)"
  border:               "hsl(240 6% 90%)"
  ring:                 "hsl(262 83% 58%)"
  destructive:          "hsl(0 84% 60%)"
  success:              "hsl(142 71% 45%)"
  warning:              "hsl(38 92% 50%)"
  info:                 "hsl(200 95% 50%)"
  # ── Dark ───────────────────────────────────────────────────────
  dark-background:      "hsl(240 10% 4%)"
  dark-foreground:      "hsl(0 0% 98%)"
  dark-card:            "hsl(240 8% 7%)"
  dark-primary:         "hsl(258 90% 70%)"
  dark-muted:           "hsl(240 6% 14%)"
  dark-muted-foreground: "hsl(240 5% 65%)"
  dark-border:          "hsl(240 6% 18%)"
  # ── Chart palette ─────────────────────────────────────────────
  chart-1:  "hsl(262 83% 58%)"   # violet
  chart-2:  "hsl(199 89% 48%)"   # sky blue
  chart-3:  "hsl(38 92% 50%)"    # amber
  chart-4:  "hsl(142 71% 45%)"   # green
  chart-5:  "hsl(330 81% 60%)"   # pink
  chart-6:  "hsl(173 80% 40%)"   # teal
radius:
  sm:    "0.5rem"   # 8px
  md:    "0.75rem"  # 12px
  lg:    "1rem"     # 16px  — cards, panels
  xl:    "1.25rem"  # 20px  — chips, inputs, action buttons
  2xl:   "1.5rem"   # 24px  — chat bubbles
  shell: "2.5rem"   # 40px  — device frame (tablet+)
spacing:
  container-x-mobile:   "12px"  # px-3
  container-x-desktop:  "24px"  # px-6
  card-padding:         "12px"  # p-3
  section-gap:          "16px"  # gap-4
  item-gap:             "8px"   # gap-2
shadows:
  xs: "0 1px 2px hsl(240 6% 10% / 0.05)"
  sm: "0 1px 3px hsl(240 6% 10% / 0.06), 0 1px 2px hsl(240 6% 10% / 0.04)"
  md: "0 4px 12px hsl(240 6% 10% / 0.08), 0 2px 4px hsl(240 6% 10% / 0.04)"
  lg: "0 12px 32px hsl(240 6% 10% / 0.12), 0 4px 8px hsl(240 6% 10% / 0.06)"
  xl: "0 24px 64px hsl(240 6% 10% / 0.18), 0 8px 16px hsl(240 6% 10% / 0.08)"
motion:
  ease-out:    "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.65, 0, 0.35, 1)"
  ease-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
  fast:   "150ms"
  normal: "200ms"
  panel:  "220ms"
---

## Brand & Personality

Chang SDK Mini App là giao diện trợ lý AI nội bộ cho nhân viên FPT Telecom. Tính cách thiết kế là **tin tưởng, rõ ràng, và nhẹ nhàng** — không phô trương, không phân tâm, luôn đưa thông tin lên trước.

Phương trình cốt lõi: **nội dung > chrome**. Mọi quyết định về màu, khoảng trống, và hiệu ứng đều phục vụ cho việc giúp người dùng hoàn thành công việc nhanh hơn, không phải để gây ấn tượng về giao diện.

---

## Colors

### Chiến lược

Hệ màu xây dựng trên **một accent duy nhất — Violet 600** (`hsl(262 83% 58%)`). Tất cả màu khác trong UI đều trung tính; chỉ violet mang ý nghĩa: focus state, active tab, primary action, hover signal.

**Quy tắc token:**
- Không dùng hex trực tiếp trong component. Luôn dùng `bg-primary`, `text-muted-foreground`, `hsl(var(--chart-N))`, v.v.
- **Chart palette** (`chart-1…6`) chỉ dùng cho icon tiles trong list items. Mỗi màu đại diện một danh mục chức năng, không dùng tùy tiện cho decoration.
- **Status colors** (`success`, `warning`, `info`, `destructive`) chỉ dùng đúng ngữ nghĩa — không làm màu brand phụ.

### Dark mode

Dark mode đảo nghịch surface: `bg-background` từ white thành `hsl(240 10% 4%)`. Primary violet nhạt hơn trong dark (`hsl(258 90% 70%)`) để đảm bảo tương phản tối thiểu AA. `bg-card` và `bg-muted` chênh nhau rõ hơn để giữ phân cấp surface.

Toggle theme qua `useTheme()` từ `next-themes`, đặt class `.dark` trên `<html>`. **Không tự viết `dark:` variant trong component** — mọi dark behavior đã được xử lý hoàn toàn trong CSS variable layer của `globals.css`.

---

## Typography

**Inter Variable** là font duy nhất. Sự thống nhất font tạo ra sự gọn gàng mà không cần thêm quy tắc.

### Phân cấp thực tế

| Tầng | Size | Weight | Tailwind class | Dùng khi |
|---|---|---|---|---|
| Page title | 20–24px | 600 | `text-xl font-semibold` | Welcome heading, page header |
| Section | 16px | 600 | `text-base font-semibold` | Section label trong Apps, Tasks |
| Body | 15px | 400 | `text-[15px]` | Tên app, tên task, chat message, list title |
| Input | 14px | 400 | `text-[14px]` | Composer textarea |
| Label | 13px | 400–500 | `text-[13px]` | Subtitle, chip text, metadata |
| Hint | 12px | 400 | `text-[12px]` | Upload hint, keyboard hint |
| Micro | 10px | 500 | `text-[10px] font-medium` | Bottom nav labels |

### Quy tắc chất lượng

- `font-semibold` (600) dùng cho tiêu đề, tên riêng, trạng thái quan trọng. **Không dùng `font-bold` (700)** — quá nặng với Inter Variable ở kích thước nhỏ.
- `text-muted-foreground` cho mọi text phụ trợ — phân cấp visual mà không cần thêm màu mới.
- `tracking-tight` chỉ dùng cho heading ≥ 18px.
- `line-height`: body 15px dùng `leading-6` (24px); label 13px dùng `leading-snug` (giữ mật độ cao trong list).

---

## Layout & Spacing

### Mobile-first shell

`MobileShell` (`src/components/layout/mobile-shell.tsx`) là wrapper duy nhất quản lý kích thước:

- **Mobile** (`< md`): `w-full h-dvh` — full screen. Dùng `dvh` thay vì `vh` để tránh layout shift do thanh địa chỉ browser di động.
- **Tablet+** (`≥ md`): card cố định `390 × 844px`, `rounded-[2.5rem]`, `shadow-xl`, canh giữa màn hình với `md:p-6 lg:p-10`. Outer stage: `bg-muted`.

Bên trong shell, layout luôn là `flex flex-col`:

```
MobileShell (h-dvh flex flex-col overflow-hidden)
├── TopBar           (shrink-0, h-14)
├── [Optional pill]  (shrink-0, nếu có)
├── Scroll area      (flex-1 overflow-y-auto no-scrollbar)
│   └── content với px-3 py-3 flex flex-col gap-3
└── Composer / BottomNav  (shrink-0)
```

### Spacing system

Base unit là **8px** (= Tailwind `2`).

| Token | Value | Dùng khi |
|---|---|---|
| `px-3` / `px-6` | 12 / 24px | Container ngang mobile / desktop |
| `py-3` / `py-4` | 12 / 16px | Scroll area top/bottom padding |
| `p-3` | 12px | Card internal padding |
| `gap-2` | 8px | Giữa các item trong cùng group |
| `gap-3` | 12px | Giữa message bubbles |
| `gap-4` | 16px | Giữa các section |

### Desktop content width

Các scroll area dùng `md:max-w-2xl md:mx-auto md:w-full` để giữ content trong vùng đọc thoải mái khi shell render trên màn hình lớn hơn 390px.

---

## Elevation & Depth

Không dùng shadow nhiều lớp. Depth được tạo bởi sự chênh màu nền — gọi là **surface stack**:

| Level | Surface | Class | Dùng khi |
|---|---|---|---|
| 0 — Stage | Light grey | `bg-muted` | Outer shell trên desktop |
| 1 — App | White / near-black | `bg-background` | Nền toàn app |
| 2 — Card | White / `card` | `bg-card border border-border` | List items, chips, panels |
| 3 — Float | Semi-transparent | `bg-background/95 backdrop-blur-sm` | Composer (float trên scroll content) |
| 4 — Frost | Blur + semi-trans | `.frost` | TopBar, sticky headers |

**Frost utility** (`globals.css`):
```css
.frost {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: hsl(var(--background) / 0.72);
}
```

Frost tạo cảm giác "float" cho TopBar — khi scroll, content trượt qua dưới nhìn mờ qua lớp frost. Không thêm `box-shadow` vào TopBar — `border-b border-border` là separator đủ dùng.

---

## Shapes & Radius

Shape language là **rounded nhưng không quá mềm** — tạo sự chuyên nghiệp mà không lạnh lùng.

| Token | Value | Pattern trong app |
|---|---|---|
| `rounded-sm` | 8px | Inner accent elements, small badge |
| `rounded-md` | 12px | Icon containers (w-7 h-7), hover state |
| `rounded-lg` | 16px | Cards, panels — **default card shape** |
| `rounded-xl` | 20px | Chips, inputs, action buttons, TopBar buttons |
| `rounded-2xl` | 24px | Chat bubbles, composer block |
| `rounded-full` | pill | Badge count, micro-chips |
| `rounded-[2.5rem]` | 40px | Device shell (tablet+) |

**Quy tắc scale**: element càng nhỏ thì radius càng nhỏ. Icon 28px dùng `rounded-md`; card 300px dùng `rounded-xl`. Tránh "pill nhỏ trong hộp lớn" — trông lạc lõng về tỷ lệ.

---

## Components

### TopBar

```
[Command btn 36×36] [Agent badge: icon + "Chang"] ··· [Bell 36×36] [Theme toggle 36×36]
```

- Height: `h-14` (56px), `shrink-0`
- Effect: `.frost` — blur 20px + semi-transparent
- Separator: `border-b border-border`
- Standalone buttons: `w-9 h-9 rounded-lg text-muted-foreground hover:bg-muted transition-colors`
- Agent badge: `flex gap-2 px-2 py-1 rounded-lg bg-muted` với icon con `w-7 h-7 rounded-md bg-warning/15 text-warning`
- Responsive: nhận `title` prop để thay "Chang" khi ở trong conversation view

**Không thêm shadow** vào TopBar — separator border là đủ. Frost effect đảm nhận vai trò elevation.

---

### BottomNav

```
[Home] [Chang] [Apps] [Tasks] [Menu]
```

- `md:hidden` — chỉ hiển thị trên mobile
- Background: `bg-background/80 backdrop-blur-lg`
- Separator: `border-t border-border`
- Mỗi tab: `flex-1 flex flex-col items-center justify-center gap-0.5 py-2`
- Active: `text-primary`, icon `strokeWidth={2.2}`
- Inactive: `text-muted-foreground`, icon `strokeWidth={1.75}`
- Label: `text-[10px] font-medium`

Active indicator chỉ dùng màu (`text-primary`) + stroke thicker — không có background highlight hay border/underline. Tối giản, không tạo thêm visual noise.

---

### Card / List Item

Pattern chuẩn dùng trong Apps và Tasks:

```tsx
<div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card
                hover:border-primary/40 hover:bg-primary/5 active:scale-[0.99] transition-all">
  {/* Icon tile */}
  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
       style={{ background: `hsl(var(--chart-N) / 0.18)`, color: `hsl(var(--chart-N))` }}>
    <Icon size={22} />
  </div>
  {/* Content */}
  <div className="flex-1 min-w-0">
    <div className="font-semibold text-[15px] leading-tight">{title}</div>
    <div className="text-[13px] text-muted-foreground mt-1 leading-snug line-clamp-2">{subtitle}</div>
  </div>
</div>
```

- Icon tile: tinted `chart-N / 0.18` — màu danh mục nhẹ nhàng, không lấn át text
- `line-clamp-2` cho subtitle — giữ layout ổn định khi subtitle dài
- Hover: primary tint border + bg — consistent signal "đây là interactive"
- Press: `active:scale-[0.99]` — feedback rõ nhưng không làm layout nhảy

---

### Suggestion Chips

```tsx
<button className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl
                   border border-border bg-card text-[13px] text-left
                   hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all">
  <Icon size={16} style={{ color: CHART_COLORS[n] }} />
  <span>{text}</span>
</button>
```

- Icon inline trực tiếp (16px), không có wrapper tile — compact hơn card variant
- `full` variant: `w-full` cho suggestions dài cần toàn chiều rộng
- Layout: `flex-wrap gap-2` tạo grid tự nhiên không cần media query

---

### Composer

Cấu trúc 2 tầng:

**Tầng outer** (`bg-background/95 backdrop-blur-sm px-3 pt-2 pb-3`): float nhẹ trên content bên dưới.

**Tầng inner** (`rounded-xl border bg-card overflow-hidden`): unified block gom upload section + input row. `focus-within:border-primary/50` highlight cả block khi textarea được focus.

```
Composer outer (frost-lite)
├── [AnimatePresence] UploadSection — height 0→auto khi mở
│   ├── Header: "Tải lên nội dung" [X]
│   ├── Drop zone (empty) hoặc chip grid (có file)
│   └── border-b separator
├── Input row: [textarea flex-1] [Mic 28×28] [Send 32×32]
└── Chip row: [Attach] [Deep Think] [Agent] ··· [kbd hint]
```

**Textarea**: 1 row mặc định, auto-resize đến max 140px, `Enter` = send, `Shift+Enter` = newline.

**Send button**: `w-8 h-8 rounded-full`
- Active: `bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 scale-100`
- Disabled: `bg-muted text-muted-foreground opacity-50 scale-90`

**Secondary chips** (Deep Think, Agent): `h-7 px-3 rounded-full border border-dashed border-border text-[12px]`. Border dashed signal "secondary/optional" — phân biệt với primary action.

---

### Message Bubbles

```
User:    ············· [file chips?] [bubble bg-primary] [8px spacer]
Chang:   [32px avatar] [bubble bg-muted] [thinking expand?]
```

| Property | User | Chang |
|---|---|---|
| Background | `bg-primary` | `bg-muted` |
| Text | `text-primary-foreground` | `text-foreground` |
| Corner | `tail-r` | `tail-l` |
| Max-width | `max-w-[78%]` | `max-w-[78%]` |
| Font | `text-[15px] leading-6` | `text-[15px] leading-6` |
| Padding | `px-4 py-2.5` | `px-4 py-2.5` |

`.tail-r` / `.tail-l` xóa border-radius góc "đuôi":
```css
.tail-r { border-bottom-right-radius: 6px; }
.tail-l { border-bottom-left-radius: 6px; }
```

**ThinkingBubble**: 3 dots `w-2 h-2 rounded-full bg-muted-foreground/60`, animation `y: 0 → -4 → 0`, stagger `0.15s`.

**Task expand**: toggle `<ChevronDown>` + `AnimatePresence` height animation. Khi mở: `border-l-2 border-border pl-3` tạo timeline track visual.

---

### Task Cards (action variant)

Extension của Card pattern với action bar:

```tsx
<motion.div layout className="rounded-xl border border-border bg-card overflow-hidden">
  {/* Card header — giống list item */}
  <div className="p-3 flex items-start gap-3">...</div>

  {/* Action bar — chỉ khi actions=true && status='pending' */}
  <div className="grid grid-cols-[1fr_1fr_auto] border-t border-border">
    <button className="py-2.5 ... text-success border-r border-border hover:bg-success/5">
      <Check size={15} /> Duyệt
    </button>
    <button className="py-2.5 ... text-destructive border-r border-border hover:bg-destructive/5">
      <X size={15} /> Từ chối
    </button>
    <button className="py-2.5 px-4 ... text-muted-foreground hover:bg-muted">
      <Ellipsis size={16} />
    </button>
  </div>
</motion.div>
```

Sau khi approve/reject: status badge `rounded-full text-[11px] font-semibold px-2 py-0.5 bg-success/15 text-success` (hoặc destructive). `motion.div layout` đảm bảo transition mượt khi action bar collapse.

---

## Motion & Interaction

### Nguyên tắc

1. **Animation phục vụ orientation** — chỉ animate khi giúp user hiểu "cái gì vừa thay đổi và ở đâu". Không animate để trang trí.
2. **Enter nhanh, exit có chủ đích** — elements xuất hiện nhanh (200ms), biến mất chậm hơn nhẹ để user kịp "thấy" sự thay đổi.
3. **Spring cho touch feedback** — `ease-spring` cho scale. `ease-out` cho panel transitions.

### Catalog

| Pattern | Spec | Áp dụng |
|---|---|---|
| Message appear | `opacity 0→1, y 8→0, 200ms ease-out` | Mỗi message bubble mới |
| Panel expand | `height 0→auto, opacity 0→1, 200ms ease-out` | Upload section, thinking expand |
| Press card | `active:scale-[0.99]` | Cards, list items |
| Press chip | `active:scale-[0.98]` | Suggestion chips |
| Dot bounce | `y: 0→-4→0, 600ms, stagger 0.15s` | ThinkingBubble dots |
| Spinner | `border-t-transparent animate-spin` | In-progress tasks |

### Framer Motion patterns

```tsx
// Message / list item enter
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
/>

// Panel collapse/expand
<AnimatePresence initial={false}>
  {open && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    />
  )}
</AnimatePresence>

// List reflow (TaskCard)
<motion.div layout />
```

---

## Icons

**Lucide React** toàn bộ. Không mix icon library.

| Context | Size | strokeWidth |
|---|---|---|
| Navigation (active) | 22px | 2.2 |
| Navigation (inactive) | 22px | 1.75 |
| Card icon tiles | 22px | default (1.5) |
| TopBar action buttons | 17–18px | default |
| Inline text icons | 14–16px | default |
| Micro actions (close, X) | 13–15px | default |
| Send / Mic | 15–16px | default |

**Icon tiles** trong cards không có màu inline — dùng `color: hsl(var(--chart-N))` kết hợp `background: hsl(var(--chart-N) / 0.18)` trên container. Tách màu khỏi icon giúp dễ đổi chart color mà không cần update component.

**Navigation**: stroke thay đổi thay vì filled/outline variant — đơn giản hơn và không cần hai bộ icon.

---

## Accessibility

### Contrast

- `text-foreground` trên `bg-background`: ≥ 7:1 (AAA) cả light lẫn dark
- `text-muted-foreground` trên `bg-background`: ≥ 4.5:1 (AA)
- `bg-primary text-primary-foreground`: ≥ 4.5:1 (AA)
- Không dùng màu làm tín hiệu duy nhất — luôn kết hợp icon hoặc text label

### Touch targets

- Minimum tap area: `w-9 h-9` (36×36px) cho mọi standalone button
- Bottom nav items: `flex-1 py-2` đảm bảo toàn chiều cao column dễ tap
- Card toàn bộ là clickable (không chỉ button con bên trong), trừ các action button nội bộ

### Scroll UX

- `.no-scrollbar` ẩn scrollbar — clean UI, user vẫn scroll được bình thường
- Dùng `overflow-y-auto` thay `overflow-y-scroll` — scrollbar chỉ xuất hiện khi cần
- Auto-scroll to bottom: `ref.current?.scrollIntoView({ behavior: 'smooth' })`

---

## Token Cheat Sheet

```tsx
// ── Surfaces ──────────────────────────────────────────────────
bg-background           // trang chủ nền
bg-card                 // cards, list items
bg-muted                // hover state, secondary surface, Chang bubble
bg-primary              // primary action fill
bg-primary/5            // primary hover tint trên card
bg-primary/10           // primary active tint trên chip

// ── Text ──────────────────────────────────────────────────────
text-foreground         // primary text
text-muted-foreground   // secondary / hint text
text-primary            // brand accent text (active state)
text-primary-foreground // text trên primary bg

// ── Borders ───────────────────────────────────────────────────
border-border           // standard border
border-primary/40       // hover border trên card
border-primary/50       // focus border trên input
border-dashed border-border  // secondary chip border

// ── Status ────────────────────────────────────────────────────
bg-success/15 text-success
bg-destructive/15 text-destructive
bg-warning/15 text-warning
bg-info/10 text-info

// ── Chart icon tiles ──────────────────────────────────────────
style={{ background: `hsl(var(--chart-1) / 0.18)`, color: `hsl(var(--chart-1))` }}
// chart-1 violet · chart-2 sky · chart-3 amber · chart-4 green · chart-5 pink · chart-6 teal

// ── Motion ────────────────────────────────────────────────────
transition-colors         // color-only transitions (hover bg/text)
transition-all            // khi cả scale thay đổi
active:scale-[0.98]       // press feedback chips
active:scale-[0.99]       // press feedback cards
```

---

## Do & Don't

| ✅ Do | ❌ Don't |
|---|---|
| Dùng `text-muted-foreground` cho hint text | Dùng `text-foreground/60` opacity trực tiếp cho body text |
| `border border-border bg-card` cho cards | `border-gray-200` hoặc hex trực tiếp |
| Toggle dark mode qua `useTheme().setTheme()` | Viết `dark:bg-gray-900` trong component |
| `w-9 h-9` minimum cho standalone buttons | Buttons nhỏ hơn 36px trong vùng touch |
| `line-clamp-2` cho subtitle trong list | Để subtitle tràn dòng tự do |
| `chart-1…6` cho icon tiles theo danh mục | Màu cố định không theo palette |
| Wrap list với `<AnimatePresence>` | Animate layout thủ công với CSS |
| `active:scale-[0.98]` cho press feedback chips | `scale(0.95)` quá mạnh |
| `gap-*` và `flex` cho layout | Margin âm hoặc padding asymmetric |
| `h-dvh` cho full-screen container | `h-screen` — sai trên mobile browser |
| `no-scrollbar` trên scroll container | Để scrollbar native hiển thị trong app |
