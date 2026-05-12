import { useNavigate } from '@tanstack/react-router'
import {
  ChevronDown,
  Clock,
  Command,
  Ellipsis,
  Globe,
  MessageCirclePlus,
  Moon,
  Pin,
  Sun,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Mascot } from '@/components/chang/mascot'
import { useChatStore } from '@/store/chat-store'
import { cn } from '@/lib/utils'

export function MenuSettingPage() {
  const navigate = useNavigate()
  const conversations = useChatStore((s) => s.conversations)
  const { resolvedTheme, setTheme } = useTheme()

  const grouped = conversations.reduce<Record<string, typeof conversations>>(
    (acc, c) => {
      const key = c.group ?? '__none__'
      ;(acc[key] ??= []).push(c)
      return acc
    },
    {},
  )

  return (
    <>
      {/* Header */}
      <div className="frost h-14 px-3 flex items-center gap-3 border-b border-border shrink-0">
        <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center overflow-hidden">
          <Mascot size={28} />
        </div>
        <div className="font-semibold text-[15px]">Nhà của Chang</div>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="w-9 h-9 rounded-lg bg-success/15 flex items-center justify-center text-success">
            <User size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1 no-scrollbar md:px-6 md:max-w-xl md:mx-auto md:w-full">
        {/* New conversation */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="rounded-xl border border-info/30 bg-info/5 py-3 flex items-center justify-center gap-2 text-info font-medium text-[15px] mb-3 hover:bg-info/10 transition-colors"
        >
          <MessageCirclePlus size={16} />Cuộc trò chuyện mới
        </button>

        {/* Assistants */}
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2 text-[15px] text-muted-foreground">
            <Clock size={16} />Trợ lý của tôi
          </div>
          <Ellipsis size={16} className="text-muted-foreground" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted">
          <div className="w-7 h-7 rounded-full bg-muted-foreground/30 flex items-center justify-center">
            <User size={14} className="text-muted-foreground" />
          </div>
          <span className="text-[15px]">Chang Bít Tất</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
          <div className="w-7 h-7 rounded-full bg-muted-foreground/30 flex items-center justify-center">
            <Command size={14} className="text-muted-foreground" />
          </div>
          <span className="text-[15px]">Bí Ngô Kể Sử FPT</span>
        </button>

        <div className="border-t border-border my-3" />
        <div className="px-2 py-1 text-[15px] text-muted-foreground">Cuộc trò chuyện</div>

        {/* Conversations from store */}
        {Object.entries(grouped).map(([group, convs]) =>
          group === '__none__' ? (
            convs.map(c => (
              <button
                key={c.id}
                onClick={() => navigate({ to: '/chat/$chatId', params: { chatId: c.id } })}
                className="flex items-center gap-2 px-3 py-2.5 text-left rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-[15px] flex-1 truncate">{c.title}</span>
              </button>
            ))
          ) : (
            <div key={group}>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 text-left rounded-lg hover:bg-muted transition-colors">
                <Globe size={14} className="text-muted-foreground shrink-0" />
                <span className="text-[15px] flex-1 truncate">{group}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {convs.map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate({ to: '/chat/$chatId', params: { chatId: c.id } })}
                  className="w-full flex items-center gap-2 pl-10 pr-3 py-2.5 text-left rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-[15px] flex-1 truncate">{c.title}</span>
                </button>
              ))}
            </div>
          ),
        )}

        {/* Extra static items */}
        {[
          { title: 'Bạn là chuyên gia tổng hợp thông t..', pinned: false },
          { title: 'Tra cứu mã số Bảo hiểm xã hội', pinned: false },
          { title: 'Tôi muốn biết có bao nhiêu con Mèo', pinned: false },
          { title: 'Bạn là chuyên gia tư vấn bảo hiểm hôn nhân', pinned: false },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 px-3 py-2.5 text-left rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-[15px] flex-1 truncate">{item.title}</span>
            {item.pinned && <Pin size={13} className={cn('text-info shrink-0')} />}
          </button>
        ))}
      </div>
    </>
  )
}
