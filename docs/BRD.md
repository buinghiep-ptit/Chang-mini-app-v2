# BRD: Chang SDK Mini App V2

> Business Requirements Document — v1.0
> Cập nhật: 2026-05-14

---

## 1. Tổng quan

Tài liệu này mô tả yêu cầu nghiệp vụ dạng User Stories cho Chang SDK Mini App V2. Mỗi story có **Acceptance Criteria (AC)** cụ thể để phục vụ implement & test.

Tham chiếu tầm nhìn tại `brief.md`. Lộ trình tại `plans/master-plan.md`.

---

## 2. Module map

| Module           | Mô tả                                            | Phases liên quan |
| ---------------- | ------------------------------------------------ | ---------------- |
| Foundation       | Project setup, design system, layout shell       | 01–04            |
| Core Chat        | Conversation, composer, message bubbles, mascot  | 05–10            |
| Workspaces       | Apps grid, Tasks, Menu/Settings                  | 11–14            |
| Integration      | API, Auth, Streaming, Persistence                | 15–18            |
| Operate          | Admin dashboard, Deployment                      | 19–20            |

---

## 3. User Stories

### US-01 · Khởi động ứng dụng

**As** người dùng, **I want** mở app và thấy trang Home **so that** biết Chang đang sẵn sàng.

**AC:**
- Truy cập `/` thấy welcome screen với mascot Chang.
- Có nút/quick-action để bắt đầu hội thoại mới.
- Theme khớp với `prefers-color-scheme` của hệ điều hành.

---

### US-02 · Tạo hội thoại mới

**As** người dùng, **I want** gõ tin nhắn đầu tiên **so that** Chang tạo conversation và phản hồi.

**AC:**
- Composer luôn hiển thị ở Home và Chat page.
- Submit tin nhắn → tạo `Conversation` mới (uuid), điều hướng tới `/chat/:id`.
- Tin nhắn user xuất hiện optimistic, Chang phản hồi (streaming nếu có).
- Trạng thái "đang nghĩ" hiển thị mascot animation.

---

### US-03 · Tiếp tục hội thoại cũ

**As** người dùng, **I want** mở lại conversation từ danh sách **so that** xem được lịch sử và tiếp tục chat.

**AC:**
- Có entry point xem danh sách conversations (sidebar desktop / drawer mobile).
- Click conversation → load messages, scroll xuống cuối.
- Tin nhắn mới gửi tiếp tục được append vào conversation hiện tại.

---

### US-04 · Đổi theme

**As** người dùng, **I want** chuyển light/dark **so that** dùng được trong điều kiện ánh sáng khác nhau.

**AC:**
- Toggle có sẵn trong Menu.
- Lưu lựa chọn vào `localStorage`, áp dụng ngay không reload.
- Class `.dark` trên `<html>`; mọi component đổi màu qua token.

---

### US-05 · Mở Apps grid

**As** người dùng, **I want** xem & mở các mini-app **so that** dùng được công cụ liên quan ngay trong Chang.

**AC:**
- `/apps` hiển thị grid 2 cột (mobile) / 4 cột (desktop) các app card.
- Click app → mở (modal / sheet / route con tùy app).
- Mỗi card có icon, tên, mô tả ngắn.

---

### US-06 · Quản lý Tasks

**As** người dùng, **I want** xem danh sách tasks **so that** theo dõi những việc Chang đã tạo hoặc tôi tự thêm.

**AC:**
- `/tasks` hiển thị list task với checkbox, title, due date.
- Toggle checkbox cập nhật trạng thái local + sync API (sau MVP).
- Có CTA "Thêm task" → form đơn giản.

---

### US-07 · Settings / Menu

**As** người dùng, **I want** truy cập account & preferences **so that** quản lý phiên đăng nhập và tùy chỉnh.

**AC:**
- `/menu` hiển thị: avatar/email, theme toggle, language toggle, sign out.
- Sign out xoá `access_token`, redirect `/login`.

---

### US-08 · Authentication

**As** hệ thống, **I want** đính Bearer token vào mọi API call **so that** backend xác thực được request.

**AC:**
- Mọi request qua `http` đính header `Authorization: Bearer <token>` từ `localStorage.access_token`.
- Response 401 → xoá token + redirect `/login`.
- Toast thông báo khi expired.

---

### US-09 · Streaming AI response

**As** người dùng, **I want** thấy Chang trả lời từng chữ **so that** cảm giác phản hồi nhanh & tự nhiên.

**AC:**
- Sử dụng SSE / fetch stream để stream token-by-token.
- Render incremental, scroll-to-bottom mượt.
- Có nút "Stop generating" trong khi streaming.

---

### US-10 · Persistence

**As** người dùng, **I want** dữ liệu hội thoại lưu lại sau refresh **so that** không mất context.

**AC:**
- Zustand store persist conversations vào `localStorage` qua middleware.
- Refresh trang → khôi phục state (current conversation, message history).
- Quota đầy → cảnh báo nhẹ, không crash.

---

### US-11 · Responsive layout

**As** người dùng mobile/desktop, **I want** UI tự thích ứng **so that** dùng tiện trên mọi thiết bị.

**AC:**
- < 768px: full-screen + BottomNav.
- ≥ 768px: sidebar 272–300px + Outlet, không BottomNav.
- Safe area iOS được tôn trọng.

---

### US-12 · Mascot states

**As** người dùng, **I want** mascot Chang hiển thị trạng thái phù hợp **so that** UI có cá tính.

**AC:**
- Idle (Home), Thinking (đang chờ AI), Welcome (empty conversation).
- Không recolor mascot; không hiển thị trong message stream.

---

### US-13 · Error handling toàn cục

**As** người dùng, **I want** thấy thông báo rõ ràng khi có lỗi **so that** biết nên làm gì.

**AC:**
- Lỗi network → toast "Mất kết nối, vui lòng thử lại".
- Lỗi API 5xx → toast generic + log console.
- ErrorBoundary cho route crash → màn hình fallback.

---

### US-14 · Performance

**As** stakeholder, **I want** app load nhanh **so that** tỷ lệ thoát thấp.

**AC:**
- Lighthouse Performance ≥ 85 (mobile).
- Bundle initial ≤ 250KB gzipped (route-based code splitting).
- LCP < 2.5s trên 4G.

---

### US-15 · SDK integration

**As** host app, **I want** nhúng Chang qua iframe hoặc script **so that** triển khai được trong < 30 phút.

**AC:**
- Build artifact dạng `dist/` triển khai static được.
- Tài liệu nhúng (sample iframe + postMessage API) tại `docs/integration.md`.
- Theme auto-detect hoặc nhận qua URL param `?theme=dark`.

---

### US-16 · Admin dashboard (post-MVP)

**As** admin, **I want** xem & quản lý conversations + users **so that** vận hành & support.

**AC:**
- Route `/admin/*` được bảo vệ bằng role.
- Trang: dashboard tổng quan, conversations, users, prompts.
- (Chi tiết phase 19.)

---

### US-17 · Internationalization (post-MVP)

**As** người dùng, **I want** đổi ngôn ngữ Việt/Anh **so that** dùng phù hợp ngữ cảnh.

**AC:**
- Hệ thống i18n đặt tại `src/i18n/`, key-based.
- Lưu preference cùng theme.
- Bao phủ ít nhất Home, Menu, error messages.

---

## 4. Non-functional Requirements

- **Bảo mật**: không lưu password / token nhạy cảm trong store/state; chỉ `access_token` ở `localStorage`.
- **Accessibility**: tất cả interactive element có aria-label, contrast AA.
- **Tương thích**: 2 phiên bản gần nhất của Chrome/Safari/Edge.
