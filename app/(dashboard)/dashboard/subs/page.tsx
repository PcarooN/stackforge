'use client';

import Link from 'next/link';
import { CreditCard, ShieldCheck, FileText, Sparkles } from 'lucide-react';
import { useDashboard } from '@/app/components/dashboard/DashboardProvider';

export default function SubscriptionsPage() {
  const { tier, hasActiveSubscription, profile } = useDashboard();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Aktif plan</p>
            <h2 className="mt-1 text-2xl font-bold text-zinc-900">{tier}</h2>
            <p className="mt-2 text-sm text-zinc-500">{profile?.subscription_plan || 'Free'}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              hasActiveSubscription ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            {hasActiveSubscription ? 'Aktif' : 'Pasif'}
          </span>
        </div>
        {!hasActiveSubscription && (
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Sparkles className="h-4 w-4" /> Abonelik başlat
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <p className="mt-3 font-medium text-zinc-900">Lisans doğrulandı</p>
          <p className="text-sm text-zinc-500">Ödeme altyapısı Stripe ile güvende</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
          <CreditCard className="h-5 w-5 text-violet-500" />
          <p className="mt-3 font-medium text-zinc-900">Faturalandırma</p>
          <p className="text-sm text-zinc-500">Aylık yenileme</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-6 py-4">
          <FileText className="h-4 w-4 text-zinc-400" />
          <h3 className="font-semibold text-zinc-900">Fatura geçmişi</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-500">
            <tr>
              <th className="px-6 py-3 font-medium">Fatura</th>
              <th className="px-6 py-3 font-medium">Tarih</th>
              <th className="px-6 py-3 font-medium">Tutar</th>
              <th className="px-6 py-3 font-medium">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {[
              { id: 'INV-9921', date: '21 May 2026', amt: '$79', status: 'Ödendi' },
              { id: 'INV-9920', date: '21 Apr 2026', amt: '$79', status: 'Ödendi' },
            ].map((row) => (
              <tr key={row.id} className="text-zinc-700">
                <td className="px-6 py-4 font-medium text-violet-600">{row.id}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.amt}</td>
                <td className="px-6 py-4 text-emerald-600">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
