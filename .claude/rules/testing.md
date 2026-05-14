---
description: Manual verify trước commit + quy ước khi thêm test (Vitest, Playwright)
globs: src/**/*.test.ts,src/**/*.test.tsx,src/**/*.spec.ts,src/**/*.spec.tsx,e2e/**/*.ts
alwaysApply: false
---

# Testing

> MVP hiện chưa có test suite. File này định nghĩa quy ước **khi** thêm test, để không phải tranh luận lúc đó.
> Trước Phase 20: ưu tiên manual verification + type-check.

## 1. Verification trước khi commit (bắt buộc, không cần test framework)

- [ ] `yarn build` pass (tsc + vite).
- [ ] `yarn dev` mở route bị đụng, click qua flow chính + 1 edge case.
- [ ] Không có TS error (`tsc --noEmit` nếu có time).
- [ ] Không log lạ trong console khi click qua flow.

UI feature: **phải mở browser test thật.** Type-check không thay được manual click.

## 2. Khi nào viết test tự động

| Loại                                   | Test khi                              |
| -------------------------------------- | ------------------------------------- |
| Pure function (`lib/`, util)           | Có logic nontrivial (parse, format)   |
| Custom hook                            | Reused ≥ 2 nơi và có state machine     |
| Component                              | Có nhánh logic phức tạp / accessibility |
| Service / API                          | Mock axios, kiểm key + payload         |
| E2E flow                               | Critical path: login → chat → send    |

**Không** test:

- Component render thuần JSX.
- Wrapper 1 dòng.
- Code do shadcn / library sinh ra.

## 3. Stack đề xuất (khi thêm)

| Loại         | Tool                                  |
| ------------ | ------------------------------------- |
| Unit / hook  | Vitest + @testing-library/react       |
| Component    | Vitest + @testing-library/react       |
| E2E          | Playwright                            |
| Lint         | (Hiện chưa có — đề xuất ESLint flat config) |

Cài khi tới Phase 20 (hoặc sớm hơn nếu cần regression).

## 4. Cấu trúc file

```
src/components/chang/composer.tsx
src/components/chang/composer.test.tsx     ← co-locate
src/lib/format.ts
src/lib/format.test.ts
e2e/
├── chat.spec.ts
└── auth.spec.ts
```

## 5. Đặt tên test

```ts
describe('composer', () => {
  it('submits on Enter without Shift', () => { ... })
  it('does not submit during IME composition', () => { ... })
  it('disables send button when streaming', () => { ... })
})
```

Mỗi `it` mô tả **behavior**, không mô tả implementation.

## 6. Nguyên tắc

- **Test behavior, không test internal.** Đừng assert state Zustand trực tiếp — assert UI / kết quả.
- **AAA**: Arrange → Act → Assert. Mỗi test 1 ý.
- **Không dùng `sleep` / timeout cố định.** Dùng `waitFor`, `findBy*`.
- **Mock biên ngoài** (axios, browser API). Đừng mock function của chính module đang test.
- **Test fail trước**, fix sau (TDD nhẹ cho bug fix).

## 7. Code coverage

Không đặt threshold cứng. Mục tiêu: **mọi critical path có ít nhất 1 E2E**. Coverage là chỉ báo, không phải KPI.

## 8. Manual test checklist mẫu (per phase)

Mỗi phase plan kèm checklist verify (xem `PLAN-phase01-setup.md`). Tick từng item trên browser thật, không tick mò.
