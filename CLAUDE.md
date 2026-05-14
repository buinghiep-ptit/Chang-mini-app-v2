# CLAUDE.md

> Entry point cho Claude Code khi làm việc trên repo này.
> Mỗi rule chi tiết nằm ở `.claude/rules/`. File này chỉ là **index + tóm tắt**.

---

## Dự án

**Chang SDK Mini App V2** — trợ lý AI nhúng cho hệ sinh thái FPT Telecom, đóng gói SDK frontend để nhúng vào host app.

- Tầm nhìn & phạm vi: [`docs/brief.md`](docs/brief.md)
- Yêu cầu nghiệp vụ: [`docs/BRD.md`](docs/BRD.md)
- Lộ trình: [`docs/plans/master-plan.md`](docs/plans/master-plan.md)
- Phase hiện tại: **01 — Project Setup Foundation** (xem [`docs/PLAN-phase01-setup.md`](docs/PLAN-phase01-setup.md))
- Tình trạng: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)

---

## Quy tắc

Mỗi file có frontmatter điều khiển khi nào tự load:

- **`alwaysApply: true`** → luôn được nạp vào context (rule nền, đọc xuyên suốt).
- **`globs: <pattern>`** → chỉ nạp khi đang sửa file khớp pattern (rule scope).
- **Manual** (`alwaysApply: false`, `globs:` rỗng) → tham chiếu khi cần.

### Auto load — luôn áp dụng

| File                                                                | Phạm vi                                            |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)                                            | Workflow vận hành AI                               |
| [`.claude/rules/clean-code.md`](.claude/rules/clean-code.md)        | Triết lý: Think before · Simplicity · Surgical    |
| [`.claude/rules/tech-stack.md`](.claude/rules/tech-stack.md)        | Stack đã chốt — bắt buộc / cấm                     |
| [`.claude/rules/project-structure.md`](.claude/rules/project-structure.md) | Cây thư mục, alias, routing                  |
| [`.claude/rules/naming-conventions.md`](.claude/rules/naming-conventions.md) | Quy ước đặt tên                            |
| [`.claude/rules/system-design.md`](.claude/rules/system-design.md)  | Provider hierarchy, data flow, state boundary      |
| [`.claude/rules/security.md`](.claude/rules/security.md)            | Token, XSS, secret, sign out                       |

### Auto load theo glob — chỉ khi sửa file khớp

| File                                                                | Glob (`globs:`)                                                                  |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [`.claude/rules/code-style.md`](.claude/rules/code-style.md)        | `src/**/*.ts`, `src/**/*.tsx`                                                    |
| [`.claude/rules/error-handling.md`](.claude/rules/error-handling.md)| `src/**/*.ts`, `src/**/*.tsx`                                                    |
| [`.claude/rules/monitoring.md`](.claude/rules/monitoring.md)        | `src/**/*.ts`, `src/**/*.tsx`                                                    |
| [`.claude/rules/api-conventions.md`](.claude/rules/api-conventions.md) | `src/services/**`, `src/hooks/**`, `src/lib/http.ts`                          |
| [`.claude/rules/database.md`](.claude/rules/database.md)            | `src/store/**`, `src/lib/http.ts`, `src/types/**`                                |
| [`.claude/rules/testing.md`](.claude/rules/testing.md)              | `**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `e2e/**`                             |

### Manual — tham chiếu khi cần

| File                                                                | Khi nào                                            |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| [`.claude/rules/git-workflow.md`](.claude/rules/git-workflow.md)    | Trước commit / mở PR                               |
| [`DESIGN.md`](DESIGN.md)                                            | Design tokens, motion, component specs             |
| [`docs/brief.md`](docs/brief.md), [`docs/BRD.md`](docs/BRD.md)      | Tầm nhìn, yêu cầu nghiệp vụ                        |

---

## Tóm tắt nhanh (5 luật vàng)

1. **Stack đã chốt** — không tự ý đổi (yarn, Vite, React 19, Tailwind v4, TanStack Router/Query, Zustand, Axios). Chi tiết: `tech-stack.md`.
2. **Surgical changes** — chỉ sửa thứ liên quan yêu cầu. Không refactor / format / cleanup ngoài scope. Chi tiết: `clean-code.md`.
3. **Tokens, không hex** — mọi màu/spacing qua CSS var. Không `dark:` variant. Chi tiết: `code-style.md` + `DESIGN.md`.
4. **API qua `@/lib/http`** — không `axios.create` mới, không `fetch` raw. Service layer ở `src/services/`. Chi tiết: `api-conventions.md`.
5. **Hỏi khi không chắc** — assumption mơ hồ → hỏi, không đoán. Chi tiết: `clean-code.md` §1, §7.

---

## Commands

```bash
yarn dev        # http://localhost:5173
yarn build      # tsc + vite build → dist/
yarn preview    # preview dist/
```

---

## Hierarchy tài liệu

```
CLAUDE.md            ← bạn đang đọc (entry point)
AGENTS.md            ← workflow vận hành AI
.claude/rules/*.md   ← rules theo chủ đề
docs/                ← brief, BRD, plans, changelog
DESIGN.md            ← design system
```

Khi rule mâu thuẫn: thứ tự ưu tiên = `AGENTS.md` > `.claude/rules/*` > `CLAUDE.md` (file này) > `docs/`. Khi không rõ → hỏi.
