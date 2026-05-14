---
description: Branch naming, Conventional Commits, PR template — tham chiếu khi commit/push/PR
globs:
alwaysApply: false
---

# Git Workflow

## Branching

- `main` — luôn deployable, protected.
- `feat/<scope>-<short-desc>` — feature mới (vd `feat/chat-streaming`).
- `fix/<scope>-<short-desc>` — bug fix.
- `chore/<scope>` — bumping deps, config, không đụng logic.
- `docs/<scope>` — chỉ tài liệu.
- `refactor/<scope>` — refactor không đổi behavior.

## Commit message (Conventional Commits)

```
<type>(<scope>): <subject>

<body>            ← optional, giải thích WHY (không WHAT)

<footer>          ← optional, breaking change / issue ref
```

### Types

| Type       | Khi dùng                                       |
| ---------- | ---------------------------------------------- |
| `feat`     | Feature mới                                    |
| `fix`      | Bug fix                                        |
| `refactor` | Đổi code không đổi behavior                    |
| `perf`     | Cải thiện performance                          |
| `style`    | Format, không đổi logic                        |
| `docs`     | Tài liệu                                       |
| `test`     | Thêm/sửa test                                  |
| `chore`    | Build, deps, config                            |
| `revert`   | Revert commit trước                            |

### Ví dụ

```
feat(chat): add streaming response with SSE

Sử dụng EventSource cho /chat/stream endpoint.
TTFB giảm từ ~2s xuống ~600ms ở môi trường staging.
```

```
fix(auth): handle 401 without redirect loop

Pathname check trước khi redirect tránh trường hợp /login tự redirect chính nó.
```

## Quy tắc commit

- **Atomic**: mỗi commit là 1 thay đổi logic độc lập, build pass, type-check pass.
- **Tránh `WIP`** trên main. Squash khi merge nếu cần.
- **Đừng amend commit đã push** (trừ branch riêng của mình, chưa ai pull).
- **Đừng `git push --force`** vào main hoặc shared branch. Nếu cần (cá nhân) → dùng `--force-with-lease`.
- **Không skip hook** (`--no-verify`) — fix root cause.
- **Không commit secret** — `.env*`, key, token. Kiểm `git diff --cached` trước commit.

## .gitignore phải có

```
node_modules
dist
.env
.env.local
*.local
.DS_Store
.tanstack
```

## Pull Request

Title: dùng Conventional Commit format luôn (vd `feat(chat): add streaming`).

Body template:

```md
## Summary
- bullet point ngắn về thay đổi

## Why
- WHY làm việc này (link issue/ticket)

## Test plan
- [ ] yarn build pass
- [ ] yarn dev mở route bị đụng, click qua các flow
- [ ] (specific test steps)

## Screenshot (UI changes)
<img>
```

## Review etiquette

- Đọc diff đầy đủ, không chỉ "looks good".
- Block trên: bug logic, vi phạm rule, security, performance regression.
- Comment trên: style nit, naming suggest.
- Approve khi: pass test plan + không block.

## Khi conflict

- Resolve tại local, **không** `git push --force` lên branch chung.
- Ưu tiên `git rebase` cho branch cá nhân, `git merge` cho shared branch.
- Lock file conflict (`yarn.lock`): xoá → `yarn install` lại, không sửa tay.

## Cấm

- ❌ Commit thẳng vào `main` (luôn qua PR).
- ❌ `git reset --hard` lên branch có code chưa push của người khác.
- ❌ Đổi git config repo, commit author email khác.
