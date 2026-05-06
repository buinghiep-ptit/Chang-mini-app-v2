import { Outlet } from '@tanstack/react-router'
import { BottomNav } from './bottom-nav'
import { SidebarNav } from './sidebar-nav'

/**
 * Responsive shell:
 *  mobile  (<md)  → full-screen, bottom nav
 *  tablet  (md+)  → sidebar 272px + content area (no phone frame)
 *  desktop (lg+)  → wider sidebar 300px + constrained content
 */
export function AppLayout() {
  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* ── Sidebar: tablet & desktop only ── */}
      <aside className="hidden md:flex md:w-68 lg:w-72 shrink-0 flex-col border-r border-border bg-card overflow-hidden">
        <SidebarNav />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* On mobile → simple stack; on md+ → scrollable content fills width */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </main>

        {/* Bottom nav: mobile only */}
        <BottomNav />
      </div>
    </div>
  )
}
