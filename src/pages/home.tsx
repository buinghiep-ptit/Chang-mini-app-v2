import { useNavigate } from '@tanstack/react-router'
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Globe,
  Info,
  Lightbulb,
  Lock,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { nanoid } from 'nanoid'
import { ChangComposer } from '@/components/chang/composer'
import { ChangTopBar } from '@/components/chang/top-bar'
import { Mascot } from '@/components/chang/mascot'
import { useChatStore, getChangResponse } from '@/store/chat-store'
import { cn } from '@/lib/utils'

const CHART_COLORS: Record<number, string> = {
  0: 'hsl(var(--destructive))',
  1: 'hsl(var(--chart-1))',
  2: 'hsl(var(--chart-2))',
  3: 'hsl(var(--chart-3))',
  4: 'hsl(var(--chart-4))',
  5: 'hsl(var(--chart-5))',
  6: 'hsl(var(--chart-6))',
}

type Suggestion = { icon: LucideIcon; color: number; text: string; full?: boolean }

const SUGGESTIONS: Suggestion[] = [
  { icon: Lightbulb, color: 3, text: 'Tra cứu gói cước' },
  { icon: Info, color: 2, text: 'Thông tin hợp đồng' },
  { icon: AlertTriangle, color: 0, text: 'Vấn đề đường truyền theo Số điện thoại', full: true },
  { icon: Bell, color: 1, text: 'Nâng cấp gói cước cho Khách hàng' },
  { icon: Globe, color: 3, text: 'Tạm dừng dịch vụ' },
  { icon: CheckCircle, color: 4, text: 'Kịch bản tư vấn' },
  { icon: Sparkles, color: 0, text: 'Lấy QR hỗ trợ khách hàng' },
  { icon: Lock, color: 3, text: 'Khoá hợp đồng' },
  { icon: Info, color: 2, text: 'Clear Checklist' },
  { icon: AlertTriangle, color: 0, text: 'Các gói FPT Play' },
  { icon: Bell, color: 1, text: 'Lịch chiếu phim' },
  { icon: Globe, color: 3, text: 'Lịch thi đấu Giải bóng đá Ngoại hạng Anh', full: true },
]

export function HomePage() {
  const navigate = useNavigate()
  const createConversation = useChatStore((s) => s.createConversation)
  const addChangMsg = useChatStore((s) => s.addChangMsg)

  function startChat(text: string) {
    const id = nanoid(8)
    createConversation(id, text)
    navigate({ to: '/chat/$chatId', params: { chatId: id } })
    const res = getChangResponse(text)
    setTimeout(() => {
      addChangMsg(id, res.content, res.tasks)
    }, 1800)
  }

  return (
    <>
      <ChangTopBar />
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4 no-scrollbar md:px-6 md:py-6 md:max-w-2xl md:mx-auto md:w-full">
        {/* Welcome */}
        <div className="flex items-center gap-3 px-1">
          <Mascot size={36} className="md:hidden" />
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-foreground" />
            <h2 className="text-xl font-semibold tracking-tight text-muted-foreground md:text-2xl">
              Hôm nay bạn muốn biết điều gì?
            </h2>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => startChat(s.text)}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-3 rounded-xl border border-border bg-card text-[13px] text-left',
                'hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all',
                s.full && 'w-full',
              )}
            >
              <s.icon size={16} style={{ color: CHART_COLORS[s.color] }} />
              <span>{s.text}</span>
            </button>
          ))}
        </div>
      </div>

      <ChangComposer onSend={startChat} />
    </>
  )
}
