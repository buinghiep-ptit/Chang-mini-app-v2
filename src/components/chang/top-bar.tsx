import { Bell, Command, Moon, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title?: string
  className?: string
}

export function ChangTopBar({ title, className }: TopBarProps) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className={cn('frost h-14 px-3 flex items-center gap-2 border-b border-border shrink-0', className)}>
      <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
        <Command size={18} />
      </button>

      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-muted">
        <div className="w-7 h-7 rounded-md bg-warning/15 flex items-center justify-center text-warning">
          <User size={16} />
        </div>
        <span className="font-semibold text-[15px]">{title ?? 'Chang'}</span>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <Bell size={18} />
        </button>
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
        >
          {resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </div>
  )
}
