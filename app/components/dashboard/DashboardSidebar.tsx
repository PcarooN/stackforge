'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  ChevronLeft,
  CreditCard,
  Download,
  KeyRound,
  LayoutGrid,
  Package,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from './DashboardProvider';

type NavItem = { href: string; label: string; icon: typeof BarChart3; badge?: string };

const NAV: { section: string; items: NavItem[] }[] = [
  { section: 'Ana menü', items: [{ href: '/dashboard', label: 'Ana sayfa', icon: BarChart3 }] },
  {
    section: 'Kütüphane',
    items: [
      { href: '/dashboard/downloads', label: 'İndirmeler', icon: Download },
      { href: '/dashboard/assets/roblox', label: 'Roblox', icon: Package },
      { href: '/dashboard/assets/minecraft', label: 'Minecraft', icon: Package },
      { href: '/dashboard/assets/fivem', label: 'FiveM', icon: Package },
    ],
  },
  {
    section: 'Stüdyo',
    items: [{ href: '/dashboard/editor', label: 'UI Editor', icon: LayoutGrid, badge: 'Pro' }],
  },
  {
    section: 'Hesap',
    items: [
      { href: '/dashboard/subs', label: 'Abonelik', icon: CreditCard },
      { href: '/dashboard/keys', label: 'API Keys', icon: KeyRound },
      { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { tier, canUseEditor, hasActiveSubscription } = useDashboard();

  return (
    <aside
      className={cn(
        'relative z-20 flex h-screen shrink-0 flex-col border-r border-zinc-200/80 bg-white/80 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-[76px]' : 'w-[260px]'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25">
              S
            </div>
            <span className="text-sm font-semibold tracking-tight text-zinc-900">StackForge</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {!collapsed && (
        <div className="mx-4 mb-2 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-4 text-white shadow-lg shadow-violet-500/20">
          <p className="text-xs font-medium text-white/80">Planın</p>
          <p className="mt-1 text-lg font-semibold">{tier}</p>
          <p className="mt-2 text-[11px] text-white/70">
            {hasActiveSubscription ? 'Tüm özellikler seninle' : 'Abonelik başlat'}
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        {NAV.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[11px] font-medium text-zinc-400">{group.section}</p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
                const Icon = item.icon;
                const locked = item.href === '/dashboard/editor' && !canUseEditor;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                      active
                        ? 'bg-violet-50 text-violet-700 shadow-sm shadow-violet-100'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
                      locked && !active && 'opacity-50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                        active ? 'bg-violet-600 text-white' : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-100 p-3">
        <Link
          href="/pricing"
          className={cn(
            'flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800',
            collapsed && 'px-2'
          )}
        >
          <Sparkles className="h-4 w-4" />
          {!collapsed && <span>Yükselt</span>}
        </Link>
      </div>
    </aside>
  );
}
