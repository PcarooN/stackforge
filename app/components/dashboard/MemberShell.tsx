'use client';

import { usePathname } from 'next/navigation';
import { DashboardProvider } from './DashboardProvider';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreenEditor = pathname?.startsWith('/dashboard/editor/roblox');

  if (fullscreenEditor) {
    return <>{children}</>;
  }

  return (
    <DashboardProvider>
      <div className="dashboard-shell relative flex min-h-screen overflow-hidden bg-[#f8f9fc] text-zinc-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(139,92,246,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(16,185,129,0.08),transparent)]" />
        <DashboardSidebar />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
