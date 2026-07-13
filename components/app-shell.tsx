import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';

/**
 * The Moonaria app shell — sidebar + top bar wrapping every internal screen.
 * Rendered by the (app) route group layout.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'flex h-screen w-full overflow-hidden',
        'bg-background text-foreground'
      )}
    >
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-surface-sunken p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
