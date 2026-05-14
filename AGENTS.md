# AGENTS.md — Workflow vận hành AI

> Cách AI agent (Claude Code, Codex, Cursor, ...) làm việc trên repo này.
> Coding rules: xem `.claude/rules/`. File này chỉ về **process**.

---

## 1. Trước mọi task

```
1. Đọc CLAUDE.md (index) → biết rule nào áp dụng
2. Đọc .claude/rules/clean-code.md (luôn) + rule liên quan task
3. Đọc docs/plans/master-plan.md → biết phase hiện tại
4. Đọc PLAN của phase đang làm (vd docs/PLAN-phase01-setup.md)
5. Nắm scope. KHÔNG mở rộng ngoài scope.
```

---

## 2. Khi nhận yêu cầu

### Phân loại nhanh

| Loại                            | Hành động                                           |
| ------------------------------- | --------------------------------------------------- |
| Câu hỏi exploratory (`"có thể làm X không?"`) | Trả lời 2-3 câu + 1 đề xuất + tradeoff. KHÔNG implement. |
| Task rõ ràng, scope nhỏ         | Làm thẳng, báo kết quả ngắn.                        |
| Task nhiều bước                 | State plan (1-5 bước) → confirm hoặc làm tiếp.      |
| Task có ambiguity               | Hỏi 1-2 câu cụ thể trước khi code.                  |
| Task đụng kiến trúc / stack     | Đề xuất plan + xin xác nhận. KHÔNG tự đổi.          |

### Plan format (cho task nhiều bước)

```
1. [Step ngắn] → verify: [check cụ thể]
2. [Step ngắn] → verify: [check cụ thể]
3. [Step ngắn] → verify: [check cụ thể]
```

Verify rõ ràng → tự loop đến khi đúng, không hỏi lại.

---

## 3. Khi sửa code

- **Match style hiện tại**, không "improve" tự ý.
- Mỗi dòng thay đổi truy xuất được về yêu cầu user.
- Phát hiện dead code không liên quan → **nhắc, không xóa**.
- Khi thay đổi tạo orphan (do thay đổi của mình): xoá. Có sẵn từ trước: để yên.

Xem `.claude/rules/clean-code.md` §3.

---

## 4. Khi xong task

Thứ tự bắt buộc:

1. **Verify thủ công** (xem `.claude/rules/testing.md` §1):
   - `yarn build` pass.
   - `yarn dev` mở route đụng → click flow chính + 1 edge case.
   - Console không có log lạ.
2. **Summary ngắn** cho user: cái gì đã đổi + bước verify đã làm. KHÔNG dài dòng.
3. **CHANGELOG** (chỉ khi đóng phase / mốc): ghi vào `docs/CHANGELOG.md` đúng quy ước (chỉ ghi đã làm thật).
4. **KHÔNG tự commit** trừ khi user yêu cầu rõ.

---

## 5. Tone & format output

- Tiếng Việt cho conversation, code/identifier giữ tiếng Anh.
- Câu trả lời ngắn. Câu hỏi đơn giản → 1-2 câu, không header.
- Báo kết quả bằng plain text + bullet, không emoji trừ khi user dùng trước.
- Reference file: `path:line` để click được.

---

## 6. Tự đề xuất khi nào

- **Có**: spot bug rõ ràng / vi phạm rule trong file đang sửa → nhắc 1 câu (không tự fix).
- **Có**: tìm thấy cách đơn giản hơn user đề xuất → trình bày tradeoff, để user chọn.
- **Không**: refactor / cleanup ngoài scope, "while I'm here".
- **Không**: thêm test, comment, docs khi user không yêu cầu.

---

## 7. Khi không chắc

Thứ tự:

1. Đọc code hiện có (có pattern chưa?).
2. Đọc `.claude/rules/` (có rule chưa?).
3. Đọc `docs/` (có quyết định chưa?).
4. **Hỏi user** — 1-2 câu cụ thể, có lựa chọn rõ.

Không bao giờ đoán rồi viết code dài.

---

## 8. Top vi phạm thường gặp (đọc kỹ)

| ❌ Sai                                          | ✅ Đúng                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| `any` trong TS                                  | `unknown` + type guard                         |
| `export default`                                | Named export                                   |
| Hex color trong className                       | CSS token (`bg-primary`)                       |
| `dark:` variant trong component                 | Token tự swap qua `.dark` class                |
| `axios.create()` / `fetch()` raw                | `http` từ `@/lib/http`                         |
| Async handler không try/catch                   | try/catch + `toast.error` + `console.error`    |
| Commit `WIP` / `quick fix` / `tmp`              | Conventional commit (`feat(scope): ...`)       |
| Refactor ngoài scope task                       | Nhắc trong message, không tự sửa               |
| `console.log(...)` còn lại trong code           | Xoá hoặc đổi `console.error` có ngữ cảnh       |

---

## 9. File reference khẩn cấp

```
CLAUDE.md              → index rule + tóm tắt
.claude/rules/         → rule chi tiết theo chủ đề
docs/plans/master-plan.md  → phase đang làm
docs/PLAN-phase*.md    → checklist phase hiện tại
docs/CHANGELOG.md      → ghi nhận đã làm
DESIGN.md              → token màu, motion, spec
```

Khi mất phương hướng giữa task → mở `CLAUDE.md`.
