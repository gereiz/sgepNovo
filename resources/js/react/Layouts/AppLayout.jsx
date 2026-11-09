import React from 'react';
import { Head } from '@inertiajs/react';
import { Navbar } from '@/react/Components/Navbar';
import { Separator } from '@/react/Components/ui/separator';
import { cn } from '@/react/lib/utils';

export function AppLayout({
  children,
  title = 'SGEP • React',
  breadcrumbs = null,
  notificationCount = 0,
  extraHeader = null,
  activeTab = 'vendas',
}) {
  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface antialiased flex flex-col selection:bg-primary selection:text-primary-on overflow-x-hidden max-w-[100vw] w-full">
      <Head title={title} />

      <Navbar
        activeTab={activeTab}
        notificationCount={notificationCount}
      />

      {/* Spacer para header fixo (altura: 56px navbar) */}
      <div className="h-14 w-full"></div>

      {/* Breadcrumb */}
      {breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
        <div className="bg-surface-container-lowest border-b border-outline-variant px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-outline">/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-primary transition-colors font-medium">
                    {b.label}
                  </a>
                ) : (
                  <span className={cn(i === breadcrumbs.length - 1 ? 'text-on-surface font-semibold' : '')}>
                    {b.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {extraHeader}

      {/* Conteúdo principal */}
      <main className="relative flex-1 w-full max-w-[100vw] overflow-x-hidden px-2 md:px-4 py-4 lg:py-6 min-w-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest px-4 py-3 text-[11px] text-on-surface-variant flex flex-wrap items-center justify-between gap-2">
        <div>© {new Date().getFullYear()} Equipe Propaganda • SGEP</div>
        <Separator className="hidden sm:block w-px h-4" orientation="vertical" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container text-primary-on-container text-[10px] font-bold">
            React + Inertia + shadcn/ui
          </span>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
