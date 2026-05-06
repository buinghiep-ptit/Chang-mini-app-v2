import { cn } from '@/lib/utils'

/**
 * Mobile-first shell: full screen on phones, centered card on tablet/desktop.
 * Children must manage their own scroll; this wrapper only handles sizing.
 */
export function MobileShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-dvh bg-muted flex items-center justify-center md:p-6 lg:p-10">
      <div
        className={cn(
          // Mobile: fills screen
          'w-full h-dvh flex flex-col bg-background text-foreground overflow-hidden',
          // Tablet+: fixed width card with shadow
          'md:w-[390px] md:h-[844px] md:rounded-[2.5rem] md:shadow-xl',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
