# Brief: Chang SDK Mini App V2

## 1. Tầm nhìn

Chang là **trợ lý AI nhúng** cho hệ sinh thái FPT Telecom — giúp người dùng tra cứu, thực thi tác vụ, và khai thác công cụ nội bộ qua hội thoại tự nhiên. Mini App V2 là **giao diện chuẩn** để tích hợp Chang vào các sản phẩm khác (SDK-style).

## 2. Mục tiêu sản phẩm

- **Plug-and-play**: nhúng vào host app qua iframe / web component / SDK, tự thích ứng theme.
- **Hội thoại mượt**: streaming response, transitions tinh tế, optimistic UI.
- **Mở rộng được**: Apps (mini-apps trong Chang), Tasks (todo do Chang tạo/quản lý), Menu (settings).
- **Mobile-first**: ưu tiên mobile (< 768px), responsive lên tablet/desktop.

## 3. Người dùng mục tiêu

| Persona               | Nhu cầu                                                            |
| --------------------- | ------------------------------------------------------------------ |
| End-user (B2C)        | Hỏi đáp, đặt lịch, tra cước, troubleshoot dịch vụ                  |
| Nhân viên CSKH        | Tra cứu thông tin khách hàng, dùng Apps để thao tác nội bộ         |
| Admin                 | Quản lý conversations, users, apps, prompts (dashboard riêng)      |

## 4. Phạm vi MVP

**Trong scope:**

- Chat 1-1 với Chang (text, streaming)
- Conversations list + lịch sử
- Apps grid (launcher mini-apps)
- Tasks (todo tạo từ chat hoặc thủ công)
- Menu / Settings (theme, account, language)
- Authentication (Bearer token, redirect 401)

**Ngoài scope MVP:**

- Voice input / TTS
- File upload (sẽ tách phase riêng)
- Multi-user channel
- Admin dashboard (giai đoạn sau)

## 5. Ràng buộc

- **Tech stack** đóng cứng tại `CLAUDE.md` — không tự ý đổi.
- **Design tokens** đóng cứng tại `DESIGN.md` — không hardcode hex.
- **Backend** đã có sẵn, SDK chỉ là frontend → giao tiếp qua REST + (sau này) SSE.
- Hỗ trợ trình duyệt: Chrome/Safari/Edge 2 phiên bản gần nhất.

## 6. Tiêu chí thành công

- Tích hợp được vào ít nhất 1 host app trong < 30 phút.
- TTFB chat < 800ms (tới khi token đầu tiên xuất hiện).
- Lighthouse Performance ≥ 85 (mobile).
- Bundle initial ≤ 250KB gzipped.

## 7. Tham chiếu

- `BRD.md` — yêu cầu nghiệp vụ chi tiết (user stories)
- `plans/master-plan.md` — lộ trình triển khai 20 phases
- `DESIGN.md` — design system
