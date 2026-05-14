---
description: Quy ước đặt tên — component, biến, hằng, file, hook, props, query key
globs:
alwaysApply: true
---

# Naming Conventions

| Loại                          | Quy tắc                   | Ví dụ                          |
| ----------------------------- | ------------------------- | ------------------------------ |
| Component, Class, Type, Enum  | `PascalCase`              | `UserCard`, `MessageRole`      |
| Variable, function, prop      | `camelCase`               | `isLoading`, `handleSubmit`    |
| Hook                          | `useCamelCase`            | `useChatScroll`                |
| Module-level constant         | `SCREAMING_SNAKE_CASE`    | `MAX_RETRY`, `API_TIMEOUT`     |
| File / folder                 | `kebab-case`              | `message-bubble.tsx`           |
| Props interface               | `{ComponentName}Props`    | `MessageBubbleProps`           |
| Store                         | `use{Domain}Store`        | `useChatStore`, `useTasksStore`|
| Service                       | `{domain}Service`         | `conversationService`          |
| Query key (mảng phân cấp)     | `[domain, id?, sub?]`     | `['conversations', id]`        |
| Boolean                       | Bắt đầu `is/has/can/should`| `isOpen`, `hasError`          |
| Event handler                 | `handle{Event}` / `on{Event}` | `handleClick`, `onSelect`  |

## Tránh

- ❌ Viết tắt mơ hồ: `usrCnt`, `msgArr` → ✅ `userCount`, `messages`
- ❌ Hungarian: `strName`, `iCount`
- ❌ `data`, `info`, `obj`, `temp` đứng riêng — luôn thêm ngữ cảnh
- ❌ Folder số nhiều/ít lẫn lộn — chọn 1: `components/`, `hooks/`, `services/` (số nhiều)
- ❌ Default export → dùng named export (xem `code-style.md`)

## Đặc biệt

- File route: tên file = path. `chat/$chatId.tsx` → `/chat/:chatId`.
- File page tương ứng route: cùng tên (`chat.tsx` ↔ `routes/chat/...`).
- Component nội bộ một file: prefix `_` không cần — chỉ cần không export.
