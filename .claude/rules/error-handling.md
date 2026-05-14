---
description: Async try/catch, TanStack Query isError, mức nghiêm trọng, ErrorBoundary
globs: src/**/*.ts,src/**/*.tsx
alwaysApply: false
---

# Error Handling

## Nguyên tắc

1. **Không nuốt lỗi im lặng.** Mỗi catch phải hoặc log, hoặc thông báo user, hoặc re-throw.
2. **Validate ở biên hệ thống** (user input, API response). Trong code nội bộ tin vào type + invariant.
3. **Đừng try/catch cho scenario không thể xảy ra** — chỉ tạo noise.
4. **Toast cho lỗi user-facing, console.error cho lỗi dev.**

## 1. Async trong event handler

Mọi async function trong handler **phải** có try/catch hoặc `.catch()`:

```tsx
// ✅
async function handleSubmit() {
  try {
    await http.post('/submit', data)
    toast.success('Đã gửi')
  } catch (err) {
    console.error('submit failed', err)
    toast.error('Có lỗi xảy ra, vui lòng thử lại')
  }
}

// ❌ — lỗi sẽ bị browser nuốt, user không biết gì
async function handleSubmit() {
  await http.post('/submit', data)
}
```

## 2. TanStack Query

Trong component **dùng `isError`** thay try/catch:

```tsx
const { data, isError, isLoading } = useQuery({ ... })
if (isError) return <ErrorState />
if (isLoading) return <Skeleton />
```

Trong `useMutation` luôn có `onError` (xem `api-conventions.md`).

Lỗi global (network down, 5xx) → xử lý ở axios interceptor + `QueryCache.onError` thay vì lặp lại mỗi nơi.

## 3. Service layer

Re-throw để query/mutation nhận được:

```ts
// ✅
export const conversationService = {
  get: async (id: string) => {
    try {
      return await http.get<Conversation>(`/conversations/${id}`).then(r => r.data)
    } catch (err) {
      console.error('fetch conversation failed', err)
      throw err  // re-throw để TanStack Query biết
    }
  },
}

// ❌ — nuốt lỗi, UI sẽ thấy "loaded" với data undefined
get: async (id) => {
  try { ... } catch {}
}
```

Đa số trường hợp: **không cần try/catch trong service**. Để lỗi nổi lên axios interceptor + TanStack Query lo. Chỉ catch khi cần transform / log thêm context.

## 4. Component-level

- **Loading**: skeleton hoặc spinner.
- **Empty**: empty state friendly + CTA.
- **Error**: ErrorState component với "Thử lại" button.

```tsx
if (isLoading) return <Skeleton />
if (isError) return <ErrorState onRetry={refetch} />
if (!data?.length) return <EmptyState />
return <List items={data} />
```

## 5. Global ErrorBoundary

Bọc ở `__root.tsx` hoặc cấp route — fallback UI khi component crash:

```tsx
<ErrorBoundary fallback={<RouteError />}>
  <Outlet />
</ErrorBoundary>
```

## 6. Mức độ nghiêm trọng

| Loại lỗi              | Hành động                                  |
| --------------------- | ------------------------------------------ |
| User input invalid    | Inline message (form field), không toast   |
| API 4xx (business)    | Toast cụ thể từ `error.response.data.message` |
| API 401               | Interceptor xử lý — clear token + redirect |
| API 5xx / network     | Toast generic "Có lỗi, vui lòng thử lại"   |
| Bug logic (impossible)| `throw new Error(...)` + console.error     |

## 7. Cấm

- ❌ `catch {}` rỗng.
- ❌ `console.log(err)` rồi bỏ qua — dùng `console.error` và xử lý.
- ❌ `try/catch` quanh code đồng bộ pure (Math, format, ...).
- ❌ Bắt `Error` rồi convert thành string không có ngữ cảnh: `catch (e) { toast.error(e.message) }`.
