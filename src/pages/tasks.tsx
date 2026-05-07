import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Check, Command, Ellipsis, Globe, Lock, User, X, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'
import { ChangComposer } from '@/components/chang/composer'
import { ChangTopBar } from '@/components/chang/top-bar'
import { useChatStore, getChangResponse } from '@/store/chat-store'
import { cn } from '@/lib/utils'

type TaskStatus = 'pending' | 'approved' | 'rejected'

type TaskItem = {
  id: string
  icon: LucideIcon
  color: number
  title: string
  subtitle: string
  actions?: boolean
  status: TaskStatus
}

type TaskGroup = { group: string; items: TaskItem[] }

const INITIAL: TaskGroup[] = [
  {
    group: 'Dịch vụ nhân sự',
    items: [
      { id: 't1', icon: User, color: 0, title: 'Bồi thường bảo hiểm của TienNT34', subtitle: 'Đang đối chiếu quyền lợi bảo hiểm và anh PhongNT31 sẽ đưa ra quyết định chấp thuận hoặc từ chối.', status: 'pending' },
    ],
  },
  {
    group: 'Cấp quyền VPN',
    items: [
      { id: 't2', icon: Lock, color: 5, title: 'Cấp quyền VPN cho ThangPV', subtitle: 'Đã đối chiếu quy định, anh ThangPV đủ điều kiện cấp VPN. Anh hãy đưa ra quyết định chấp thuận hoặc từ chối.', actions: true, status: 'pending' },
    ],
  },
  {
    group: 'Di chuyển',
    items: [
      { id: 't3', icon: Globe, color: 6, title: 'Đặt vé máy bay cho PhongNT31', subtitle: 'Đã hoàn thành tiếp nhận và xử lý các thông tin của PhongNT31 với hãng, đang thực hiện các thủ tục đặt vé máy bay.', status: 'pending' },
    ],
  },
  { group: 'Hỗ trợ Kinh doanh', items: [] },
]

function TaskCard({ task, onApprove, onReject }: { task: TaskItem; onApprove: () => void; onReject: () => void }) {
  const { icon: Icon, color, title, subtitle, actions, status } = task
  return (
    <motion.div
      layout
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="p-3 flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `hsl(var(--chart-${color}) / 0.18)`, color: `hsl(var(--chart-${color}))` }}>
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[15px] leading-tight">{title}</div>
          <div className="text-[13px] text-muted-foreground mt-1 leading-snug">{subtitle}</div>
        </div>
        {status !== 'pending' && (
          <div className={cn(
            'shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full',
            status === 'approved' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
          )}>
            {status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
          </div>
        )}
      </div>

      {actions && status === 'pending' && (
        <div className="grid grid-cols-[1fr_1fr_auto] border-t border-border">
          <button onClick={onApprove}
            className="py-2.5 flex items-center justify-center gap-1.5 text-success border-r border-border hover:bg-success/5 transition-colors text-[13px] font-medium">
            <Check size={15} />Duyệt
          </button>
          <button onClick={onReject}
            className="py-2.5 flex items-center justify-center gap-1.5 text-destructive border-r border-border hover:bg-destructive/5 transition-colors text-[13px] font-medium">
            <X size={15} />Từ chối
          </button>
          <button className="py-2.5 px-4 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <Ellipsis size={16} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

export function TasksPage() {
  const navigate = useNavigate()
  const { dispatch } = useChatStore()
  const [groups, setGroups] = useState(INITIAL)

  function handleSend(text: string) {
    const id = nanoid(8)
    dispatch({ type: 'CREATE', id, firstMessage: text })
    const res = getChangResponse(text)
    setTimeout(() => {
      dispatch({ type: 'ADD_CHANG_MSG', convId: id, content: res.content, tasks: res.tasks })
    }, 1800)
    navigate({ to: '/chat/$chatId', params: { chatId: id } })
  }

  function updateStatus(taskId: string, status: TaskStatus) {
    setGroups(gs => gs.map(g => ({
      ...g,
      items: g.items.map(t => t.id === taskId ? { ...t, status } : t),
    })))
  }

  return (
    <>
      <ChangTopBar />
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3 no-scrollbar md:px-6 md:py-4 md:max-w-2xl md:mx-auto md:w-full">
        <div className="flex items-center gap-3 px-1">
          <button onClick={() => navigate({ to: '/' })} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
          <div className="text-base font-semibold">Quản lý Công việc</div>
          <button className="ml-auto w-8 h-8 rounded-md bg-muted flex items-center justify-center">
            <Command size={16} />
          </button>
        </div>

        <AnimatePresence>
          {groups.map(g => (
            <div key={g.group} className="flex flex-col gap-2">
              <div className="px-3 py-2 rounded-xl border border-border bg-card text-[13px] font-medium">
                {g.group}
              </div>
              {g.items.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onApprove={() => updateStatus(task.id, 'approved')}
                  onReject={() => updateStatus(task.id, 'rejected')}
                />
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>
      <ChangComposer tabs onSend={handleSend} />
    </>
  )
}
