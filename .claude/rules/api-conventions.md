---
description: Cách gọi backend qua Axios + TanStack Query — service layer, query keys, useQuery/Mutation
globs: src/services/**/*.ts,src/hooks/**/*.ts,src/hooks/**/*.tsx,src/lib/http.ts
alwaysApply: false
---

# API Conventions

> Cách gọi backend qua Axios + TanStack Query.
> Error handling chung: xem `error-handling.md`.

## 1. Axios instance

**Luôn dùng `@/lib/http`.** Không bao giờ tạo axios instance mới hoặc dùng `fetch` raw.

```ts
// ✅
import { http } from '@/lib/http'
const data = await http.get<Conversation[]>('/conversations').then(r => r.data)

// ❌
import axios from 'axios'
await axios.get('/api/conversations')   // mất interceptor auth + base URL
await fetch('/api/conversations')        // mất Bearer token, 401 handling
```

`http` đã có sẵn:

- Base URL từ `import.meta.env.VITE_API_URL` (default `/api`).
- Interceptor request: đính `Authorization: Bearer <token>` từ `localStorage.access_token`.
- Interceptor response: 401 → xoá token + redirect `/login`.

## 2. Service layer

Đặt tại `src/services/<domain>.ts`. **Không gọi `http` trực tiếp** trong component / hook UI.

```ts
// src/services/conversation.ts
import { http } from '@/lib/http'
import type { Conversation } from '@/store/chat-store'

export const conversationService = {
  list: () =>
    http.get<Conversation[]>('/conversations').then(r => r.data),
  get: (id: string) =>
    http.get<Conversation>(`/conversations/${id}`).then(r => r.data),
  create: (payload: { firstMessage: string }) =>
    http.post<Conversation>('/conversations', payload).then(r => r.data),
}
```

Quy tắc:

- 1 file = 1 domain (`conversation`, `task`, `app`, `user`).
- Object export `{domain}Service` chứa các method.
- Method ngắn gọn: `list`, `get`, `create`, `update`, `remove`. Không `getAllConversations`.
- Generic `http.get<T>` luôn khai báo kiểu trả về.

## 3. Query keys (TanStack Query)

Mảng phân cấp, domain ở đầu:

```ts
['conversations']                          // list
['conversations', id]                       // detail
['conversations', id, 'messages']           // sub-resource
['conversations', id, 'messages', { page }] // có filter/page → object cuối
```

Invalidate theo domain:

```ts
queryClient.invalidateQueries({ queryKey: ['conversations'] })
```

## 4. useQuery — cấu trúc chuẩn

```tsx
const { data, isLoading, isError } = useQuery({
  queryKey: ['conversations'],
  queryFn: conversationService.list,
  staleTime: 60_000,  // override khi cần; default đã set ở QueryClient
})

if (isLoading) return <Skeleton />
if (isError) return <ErrorState />
```

Hook wrapper nếu tái sử dụng nhiều nơi: `src/hooks/queries/use-conversations.ts`.

## 5. useMutation — luôn xử lý onSuccess + onError

```tsx
const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: conversationService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['conversations'] })
    toast.success('Tạo hội thoại thành công')
  },
  onError: () => {
    toast.error('Có lỗi xảy ra, vui lòng thử lại')
  },
})
```

## 6. Optimistic update

Chỉ áp dụng cho action user kỳ vọng instant (add message, toggle task done):

```ts
onMutate: async (newMsg) => {
  await queryClient.cancelQueries({ queryKey: ['conversations', id, 'messages'] })
  const prev = queryClient.getQueryData(['conversations', id, 'messages'])
  queryClient.setQueryData(['conversations', id, 'messages'], (old) => [...old, newMsg])
  return { prev }
},
onError: (_err, _vars, ctx) => {
  queryClient.setQueryData(['conversations', id, 'messages'], ctx?.prev)
  toast.error('Không gửi được tin nhắn')
},
```

## 7. URL & params

- Không hardcode base URL — dùng `import.meta.env.VITE_API_URL`.
- Path param: template string `\`/conversations/${id}\``.
- Query param: object cuối Axios — `http.get('/x', { params: { page: 1 } })`. Không tự nối `?key=...`.
