'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useDashboard } from './DashboardProvider';

const LABELS: Record<string, string> = {
  '/dashboard': 'Ana sayfa',
  '/dashboard/downloads': 'İndirmeler',
  '/dashboard/subs': 'Abonelik',
  '/dashboard/keys': 'API Keys',
  '/dashboard/settings': 'Ayarlar',
  '/dashboard/editor': 'UI Editor',
};

function title(pathname: string) {
  if (LABELS[pathname]) return LABELS[pathname];
  if (pathname.startsWith('/dashboard/assets/')) {
    const cat = pathname.split('/').pop() ?? '';
    return `${cat.charAt(0).toUpperCase()}${cat.slice(1)}`;
  }
  return 'Dashboard';
}

export function DashboardHeader() {
  const pathname = usePathname();
  const { profile, hasActiveSubscription } = useDashboard();
  const name = profile?.full_name?.split(' ')[0] || 'Merhaba';
  const initial = (profile?.full_name?.[0] || 'S').toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-zinc-200/80 bg-white/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-900">{title(pathname)}</h1>
        <p className="text-sm text-zinc-500">Hoş geldin, {name}</p>
      </div>

      <div className="hidden max-w-xs flex-1 md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            placeholder="Ara..."
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-violet-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:flex ${
            hasActiveSubscription
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${hasActiveSubscription ? 'bg-emerald-500' : 'bg-amber-500'}`}
          />
          {hasActiveSubscription ? 'Aktif' : 'Pasif'}
        </span>

        <button
          type="button"
          className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 hover:bg-zinc-50"
          aria-label="Bildirimler"
        >
          <Bell className="h-4 w-4" />
        </button>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <span className="hidden text-sm font-medium text-zinc-800 sm:block">{name}</span>
        </Link>
      </div>
    </header>
  );
}
