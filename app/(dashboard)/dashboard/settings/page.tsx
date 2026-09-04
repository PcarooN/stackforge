'use client';

import { User, Globe, Bell } from 'lucide-react';
import { useDashboard } from '@/app/components/dashboard/DashboardProvider';

const inputClass =
  'mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20';

export default function SettingsPage() {
  const { profile } = useDashboard();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Ayarlar</h2>
        <p className="mt-1 text-sm text-zinc-500">Profil ve güvenlik tercihlerin</p>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
          <User className="h-5 w-5 text-violet-500" /> Profil
        </h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-zinc-500">Ad</span>
            <input className={inputClass} defaultValue={profile?.full_name ?? ''} />
          </label>
          <label className="block text-sm">
            <span className="text-zinc-500">E-posta</span>
            <input className={inputClass} type="email" placeholder="ornek@mail.com" />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
          <Globe className="h-5 w-5 text-violet-500" /> Güvenlik
        </h3>
        <label className="mt-4 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4">
          <span className="text-sm text-zinc-700">IP whitelist</span>
          <input type="checkbox" className="accent-violet-600" defaultChecked />
        </label>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
          <Bell className="h-5 w-5 text-violet-500" /> Bildirimler
        </h3>
        <label className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
          <input type="checkbox" className="accent-violet-600" defaultChecked />
          E-posta bildirimleri
        </label>
      </div>

      <button
        type="button"
        className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-600"
      >
        Kaydet
      </button>
    </div>
  );
}
