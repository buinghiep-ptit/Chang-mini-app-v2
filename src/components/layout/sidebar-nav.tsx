import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  ChevronDown,
  Clock,
  Ellipsis,
  Globe,
  Grid2x2,
  Home,
  ListTodo,
  MessageCirclePlus,
  Moon,
  Pin,
  Sun,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { nanoid } from 'nanoid'
import { Mascot } from '@/components/chang/mascot'
import { useChatStore, getChangResponse } from '@/store/chat-store'
import { cn } from '@/lib/utils'

type NavItem = { to: string; icon: typeof Home; label: string }

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: Home, label: 'Trang chủ' },
  { to: '/apps', icon: Grid2x2, label: 'Ứng dụng' },
  { to: '/tasks', icon: ListTodo, label: 'Công việc' },
]

export function SidebarNav() {
  const conversations = useChatStore((s) => s.conversations)
  const createConversation = useChatStore((s) => s.createConversation)
  const addChangMsg = useChatStore((s) => s.addChangMsg)
  const { location } = useRouterState()
  const navigate = useNavigate()
  const { resolvedTheme, setTheme } = useTheme()

  function newChat() {
    const id = nanoid(8)
    createConversation(id, 'Xin chào Chang!')
    setTimeout(() => {
      const res = getChangResponse('hello')
      addChangMsg(id, res.content)
    }, 1200)
    navigate({ to: '/chat/$chatId', params: { chatId: id } })
  }

  const grouped = conversations.reduce<Record<string, typeof conversations>>(
    (acc, c) => { const k = c.group ?? '__none__'; (acc[k] ??= []).push(c); return acc },
    {},
  )

  return (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center overflow-hidden">
          <Mascot size={24} />
        </div>
        <span className="font-semibold text-[15px] flex-1">Chang</span>
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
        >
          {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* New chat CTA */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <button
          onClick={newChat}
          className="w-full rounded-xl border border-info/30 bg-info/5 py-2.5 flex items-center justify-center gap-2 text-info font-medium text-[13px] hover:bg-info/10 transition-colors"
        >
          <MessageCirclePlus size={15} />Cuộc trò chuyện mới
        </button>
      </div>

      {/* Main nav */}
      <div className="px-3 pb-2 flex flex-col gap-0.5 border-b border-border shrink-0">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <Link key={to} to={to as '/'}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon size={16} />{label}
            </Link>
          )
        })}
      </div>

      {/* Assistants */}
      <div className="px-3 py-2 flex flex-col gap-0.5 border-b border-border shrink-0">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground uppercase tracking-wider font-medium">
            <Clock size={13} />Trợ lý
          </div>
          <Ellipsis size={14} className="text-muted-foreground" />
        </div>
        <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted text-[13px] text-left">
          <div className="w-6 h-6 rounded-full bg-muted-foreground/30 flex items-center justify-center shrink-0">
            <User size={12} className="text-muted-foreground" />
          </div>Chang Bít Tất
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-0.5 no-scrollbar">
        <div className="px-2 py-1 text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
          Cuộc trò chuyện
        </div>

        {Object.entries(grouped).map(([group, convs]) =>
          group === '__none__' ? (
            convs.map(c => (
              <ConvItem key={c.id} title={c.title}
                active={location.pathname === `/chat/${c.id}`}
                onClick={() => navigate({ to: '/chat/$chatId', params: { chatId: c.id } })} />
            ))
          ) : (
            <div key={group}>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] text-muted-foreground hover:text-foreground">
                <Globe size={13} />
                <span className="flex-1 text-left truncate">{group}</span>
                <ChevronDown size={13} />
              </button>
              {convs.map(c => (
                <ConvItem key={c.id} title={c.title} indent
                  active={location.pathname === `/chat/${c.id}`}
                  onClick={() => navigate({ to: '/chat/$chatId', params: { chatId: c.id } })} />
              ))}
            </div>
          ),
        )}
      </div>

      {/* User footer */}
      <div className="h-14 px-4 flex items-center gap-3 border-t border-border shrink-0">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
          <User size={16} className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium truncate">Phong NT31</div>
          <div className="text-[11px] text-muted-foreground">FTEL · Nhân sự</div>
        </div>
      </div>
    </div>
  )
}

function ConvItem({ title, indent, active, onClick, pinned }: {
  title: string; indent?: boolean; active: boolean; onClick: () => void; pinned?: boolean
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] text-left transition-colors',
        indent && 'pl-7',
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}>
      <span className="flex-1 truncate">{title}</span>
      {pinned && <Pin size={11} />}
    </button>
  )
}
