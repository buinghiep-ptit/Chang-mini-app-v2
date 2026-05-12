import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Grid2x2, Home, ListTodo, MessageCircle, User } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useChatStore, getChangResponse } from '@/store/chat-store'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { location } = useRouterState()
  const navigate = useNavigate()
  const conversations = useChatStore((s) => s.conversations)
  const createConversation = useChatStore((s) => s.createConversation)
  const addChangMsg = useChatStore((s) => s.addChangMsg)

  function newChat() {
    // If there's an idle conversation, just go home; else create one
    const latest = conversations[0]
    if (latest) {
      navigate({ to: '/chat/$chatId', params: { chatId: latest.id } })
      return
    }
    const id = nanoid(8)
    createConversation(id, 'Xin chào Chang!')
    setTimeout(() => {
      const res = getChangResponse('hello')
      addChangMsg(id, res.content)
    }, 1200)
    navigate({ to: '/chat/$chatId', params: { chatId: id } })
  }

  const isChat = location.pathname.startsWith('/chat')

  return (
    <nav className="md:hidden shrink-0 flex items-stretch border-t border-border bg-background/80 backdrop-blur-lg">
      {/* Home */}
      <Link to="/"
        className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
          location.pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
        <Home size={22} strokeWidth={location.pathname === '/' ? 2.2 : 1.75} />
        Trang chủ
      </Link>

      {/* Chang chat */}
      <button onClick={newChat}
        className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
          isChat ? 'text-primary' : 'text-muted-foreground')}>
        <MessageCircle size={22} strokeWidth={isChat ? 2.2 : 1.75} />
        Chang
      </button>

      {/* Apps */}
      <Link to="/apps"
        className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
          location.pathname === '/apps' ? 'text-primary' : 'text-muted-foreground')}>
        <Grid2x2 size={22} strokeWidth={location.pathname === '/apps' ? 2.2 : 1.75} />
        Ứng dụng
      </Link>

      {/* Tasks */}
      <Link to="/tasks"
        className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
          location.pathname === '/tasks' ? 'text-primary' : 'text-muted-foreground')}>
        <ListTodo size={22} strokeWidth={location.pathname === '/tasks' ? 2.2 : 1.75} />
        Công việc
      </Link>

      {/* Menu */}
      <Link to="/menu"
        className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
          location.pathname === '/menu' ? 'text-primary' : 'text-muted-foreground')}>
        <User size={22} strokeWidth={location.pathname === '/menu' ? 2.2 : 1.75} />
        Menu
      </Link>
    </nav>
  )
}
