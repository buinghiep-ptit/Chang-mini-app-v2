import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { nanoid } from 'nanoid'

// ── Types ─────────────────────────────────────────────────────
export type MessageRole = 'user' | 'chang'

export type TaskStep = {
  id: string
  label: string
  status: 'running' | 'done'
}

export type Attachment = {
  name: string
  type: string
  objectUrl: string
}

export type Message = {
  id: string
  role: MessageRole
  content: string
  tasks?: TaskStep[]
  attachments?: Attachment[]
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  status: 'idle' | 'thinking'
  createdAt: Date
  group?: string
}

// ── Reducer ────────────────────────────────────────────────────
type State = { conversations: Conversation[] }

type Action =
  | { type: 'CREATE'; id: string; firstMessage: string }
  | { type: 'ADD_USER_MSG'; convId: string; content: string; attachments?: Attachment[] }
  | { type: 'ADD_CHANG_MSG'; convId: string; content: string; tasks?: TaskStep[] }
  | { type: 'FINISH_TASK'; convId: string; msgId: string; taskId: string }
  | { type: 'SET_STATUS'; convId: string; status: Conversation['status'] }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CREATE': {
      const conv: Conversation = {
        id: action.id,
        title: action.firstMessage.slice(0, 42) || 'Hội thoại mới',
        messages: [{ id: nanoid(), role: 'user', content: action.firstMessage }],
        status: 'thinking',
        createdAt: new Date(),
      }
      return { conversations: [conv, ...state.conversations] }
    }
    case 'ADD_USER_MSG':
      return {
        conversations: state.conversations.map(c =>
          c.id === action.convId
            ? {
                ...c,
                status: 'thinking',
                messages: [...c.messages, { id: nanoid(), role: 'user', content: action.content, attachments: action.attachments }],
              }
            : c,
        ),
      }
    case 'ADD_CHANG_MSG':
      return {
        conversations: state.conversations.map(c =>
          c.id === action.convId
            ? {
                ...c,
                status: 'idle',
                messages: [
                  ...c.messages,
                  { id: nanoid(), role: 'chang', content: action.content, tasks: action.tasks },
                ],
              }
            : c,
        ),
      }
    case 'FINISH_TASK':
      return {
        conversations: state.conversations.map(c =>
          c.id === action.convId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === action.msgId
                    ? {
                        ...m,
                        tasks: m.tasks?.map(t =>
                          t.id === action.taskId ? { ...t, status: 'done' } : t,
                        ),
                      }
                    : m,
                ),
              }
            : c,
        ),
      }
    case 'SET_STATUS':
      return {
        conversations: state.conversations.map(c =>
          c.id === action.convId ? { ...c, status: action.status } : c,
        ),
      }
  }
}

// ── Context ────────────────────────────────────────────────────
type Ctx = { state: State; dispatch: React.Dispatch<Action> }
const ChatCtx = createContext<Ctx | null>(null)

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    conversations: [
      {
        id: 'demo-1',
        title: 'Tử vi & Bát tự luận giải',
        messages: [],
        status: 'idle',
        createdAt: new Date(),
      },
      {
        id: 'demo-2',
        title: 'Tra cứu nhanh thông tin hợp đồng HNH1981',
        messages: [],
        status: 'idle',
        createdAt: new Date(),
        group: 'Dịch vụ nhân sự',
      },
      {
        id: 'demo-3',
        title: 'Bồi thường Bảo hiểm do ốm',
        messages: [],
        status: 'idle',
        createdAt: new Date(),
        group: 'Dịch vụ nhân sự',
      },
    ],
  })
  return <ChatCtx.Provider value={{ state, dispatch }}>{children}</ChatCtx.Provider>
}

export function useChatStore() {
  const ctx = useContext(ChatCtx)
  if (!ctx) throw new Error('useChatStore must be inside ChatStoreProvider')
  return ctx
}

// ── Simulated Chang responses ──────────────────────────────────
const RESPONSES: [RegExp, string, TaskStep[]?][] = [
  [
    /bảo hiểm/i,
    'Em đã tạo Công việc: Bồi thường bảo hiểm. Anh giúp em cung cấp các giấy tờ liên quan nhé!',
    [
      { id: nanoid(), label: 'Đối chiếu quyền lợi bảo hiểm', status: 'done' },
      { id: nanoid(), label: 'Tạo task xử lý hồ sơ', status: 'done' },
    ],
  ],
  [
    /gói cước|hợp đồng/i,
    'Tôi đã tra cứu thông tin gói cước. Khách hàng đang dùng gói cước Internet 150Mbps, hợp đồng còn hiệu lực đến 31/12/2025.',
    [{ id: nanoid(), label: 'Tra cứu thông tin khách hàng', status: 'done' }],
  ],
  [
    /vpn|cấp quyền/i,
    'Đã đối chiếu quy định — nhân viên đủ điều kiện cấp VPN. Anh có muốn tôi tạo yêu cầu cấp quyền ngay không?',
    [
      { id: nanoid(), label: 'Kiểm tra điều kiện nhân viên', status: 'done' },
      { id: nanoid(), label: 'Đối chiếu quy định bảo mật', status: 'done' },
    ],
  ],
  [
    /vé máy bay|đặt vé/i,
    'Tôi đang xử lý đặt vé máy bay. Anh xác nhận lịch bay: Hà Nội → TP.HCM, ngày mai 07:00 — giá tốt nhất hiện tại là 1.250.000₫/vé.',
    [
      { id: nanoid(), label: 'Tìm kiếm chuyến bay phù hợp', status: 'done' },
      { id: nanoid(), label: 'Đối chiếu thông tin nhân viên', status: 'done' },
    ],
  ],
]

export function getChangResponse(userMsg: string): { content: string; tasks?: TaskStep[] } {
  for (const [regex, content, tasks] of RESPONSES) {
    if (regex.test(userMsg)) return { content, tasks }
  }
  return {
    content: `Tôi đã nhận yêu cầu: "${userMsg.slice(0, 60)}${userMsg.length > 60 ? '…' : ''}". Để xử lý chính xác nhất, anh cho tôi biết thêm chi tiết được không?`,
  }
}
