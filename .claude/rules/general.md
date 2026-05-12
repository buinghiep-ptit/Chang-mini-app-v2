---
description: Quy tắc chung cho toàn bộ project
globs:
alwaysApply: true
---

# Project Rules

## 1. Luôn dùng TypeScript, không dùng JavaScript thuần

- Tất cả file phải có đuôi `.ts` hoặc `.tsx`.
- Không tạo file `.js` hay `.jsx` trong `src/`.
- Khai báo kiểu rõ ràng cho props, tham số hàm, và giá trị trả về — tránh dùng `any`.

## 2. Component phải là functional component, không dùng class component

- Chỉ dùng function component (`function MyComponent()` hoặc arrow function).
- Không dùng `class MyComponent extends React.Component`.
- State và side-effect dùng hooks (`useState`, `useEffect`, `useCallback`, ...).

## 3. Tất cả async function phải có error handling

- Mọi `async` function phải wrap bằng `try/catch` hoặc xử lý `.catch()`.
- Không để lỗi bị nuốt im lặng — phải log hoặc thông báo cho user (toast, error state, ...).
- Với TanStack Query, dùng `onError` callback hoặc kiểm tra `isError` / `error` từ hook.

```ts
// Đúng
async function fetchData() {
  try {
    const res = await http.get("/endpoint");
    return res.data;
  } catch (err) {
    toast.error("Không thể tải dữ liệu");
    throw err;
  }
}

// Sai — không có error handling
async function fetchData() {
  const res = await http.get("/endpoint");
  return res.data;
}
```
