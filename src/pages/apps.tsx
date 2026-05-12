import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Bell,
  Command,
  Image,
  LayoutDashboard,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { ChangComposer } from '@/components/chang/composer'
import { ChangTopBar } from '@/components/chang/top-bar'
import { useChatStore, getChangResponse } from '@/store/chat-store'

type AppItem = {
  id: string
  icon: LucideIcon
  color: number
  title: string
  subtitle: string
  pinned: boolean
}

const INITIAL_APPS: AppItem[] = [
  { id: 'a1', icon: Command, color: 2, title: 'Tra cứu nhanh', subtitle: 'Mẫu tra cứu thông tin nhanh chóng', pinned: true },
  { id: 'a2', icon: Bell, color: 3, title: 'Khảo sát sau Đào tạo', subtitle: 'Lớp học Quản trị Nguồn nhân lực', pinned: false },
]
const INITIAL_MY_APPS: AppItem[] = [
  { id: 'm1', icon: Sparkles, color: 5, title: 'Chỉ số Đánh giá Cảm xúc', subtitle: 'Đánh giá cảm xúc để biết những đồng nghiệp đang vui hay buồn', pinned: true },
  { id: 'm2', icon: LayoutDashboard, color: 6, title: 'Chỉ số Nhân sự', subtitle: 'Theo dõi chỉ số Nhân sự của đơn vị', pinned: false },
  { id: 'm3', icon: Image, color: 4, title: 'Theo dõi Ngân sách đơn vị', subtitle: 'Tra soát tình hình tài chính của Đơn vị', pinned: false },
]

function PinIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={active ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      className={active ? 'text-info' : 'text-muted-foreground'}>
      <path d="M12 17v5M5 11l7-8 7 8-3 3-2-1v3l-2 1H10l-2-1v-3l-2 1Z" />
    </svg>
  )
}

function AppRow({ app, onPin, onClick }: { app: AppItem; onPin: () => void; onClick: () => void }) {
  const { icon: Icon, color, title, subtitle, pinned } = app
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/30 hover:bg-primary/5 active:scale-[0.99] transition-all"
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `hsl(var(--chart-${color}) / 0.18)`, color: `hsl(var(--chart-${color}))` }}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] leading-tight">{title}</div>
        <div className="text-[13px] text-muted-foreground mt-1 leading-snug line-clamp-2">{subtitle}</div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onPin() }}
        className="shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
      >
        <PinIcon active={pinned} />
      </button>
    </div>
  )
}

export function AppsPage() {
  const navigate = useNavigate()
  const createConversation = useChatStore((s) => s.createConversation)
  const addChangMsg = useChatStore((s) => s.addChangMsg)
  const [apps, setApps] = useState(INITIAL_APPS)
  const [myApps, setMyApps] = useState(INITIAL_MY_APPS)

  function togglePin(list: AppItem[], setList: typeof setApps, id: string) {
    setList(list.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a))
  }

  function openApp(app: AppItem) {
    const id = nanoid(8)
    createConversation(id, `Mở ứng dụng: ${app.title}`)
    const res = getChangResponse(app.title)
    setTimeout(() => {
      addChangMsg(id, res.content, res.tasks)
    }, 1800)
    navigate({ to: '/chat/$chatId', params: { chatId: id } })
  }

  function handleSend(text: string) {
    const id = nanoid(8)
    createConversation(id, text)
    const res = getChangResponse(text)
    setTimeout(() => {
      addChangMsg(id, res.content, res.tasks)
    }, 1800)
    navigate({ to: '/chat/$chatId', params: { chatId: id } })
  }

  return (
    <>
      <ChangTopBar />
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4 no-scrollbar md:px-6 md:py-4 md:max-w-2xl md:mx-auto md:w-full">
        <div className="flex items-center gap-3 px-1">
          <button onClick={() => navigate({ to: '/' })} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
          <div className="text-base font-semibold">Ứng dụng</div>
          <button className="ml-auto w-8 h-8 rounded-md bg-muted flex items-center justify-center">
            <Command size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {apps.map(a => (
            <AppRow key={a.id} app={a}
              onPin={() => togglePin(apps, setApps, a.id)}
              onClick={() => openApp(a)} />
          ))}
        </div>

        <div className="flex items-center gap-2 px-1 pt-1">
          <div className="w-4 h-4 rounded-sm bg-foreground" />
          <div className="text-base font-semibold text-muted-foreground">Các ứng dụng của bạn</div>
        </div>

        <div className="flex flex-col gap-2">
          {myApps.map(a => (
            <AppRow key={a.id} app={a}
              onPin={() => togglePin(myApps, setMyApps, a.id)}
              onClick={() => openApp(a)} />
          ))}
        </div>
      </div>
      <ChangComposer tabs onSend={handleSend} />
    </>
  )
}
