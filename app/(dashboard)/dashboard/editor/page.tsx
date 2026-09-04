'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, Lock, Sparkles, ArrowRight, Layers, Palette, Download } from 'lucide-react';
import { useDashboard } from '@/app/components/dashboard/DashboardProvider';

function EditorHubContent() {
  const searchParams = useSearchParams();
  const upgrade = searchParams.get('upgrade') === '1';
  const { tier, canUseEditor } = useDashboard();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Roblox UI Editor</h2>
        <p className="mt-2 text-zinc-500">Shop arayüzünü sürükle-bırak ile tasarla, Studio&apos;ya aktar.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Layers, t: 'Şablonlar', d: 'Hazır shop layout' },
          { icon: Palette, t: 'Stil', d: 'Renk, radius, stroke' },
          { icon: Download, t: 'Export', d: '.rbxmx dosyası' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-semibold text-zinc-900">{t}</p>
            <p className="text-sm text-zinc-500">{d}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        {canUseEditor ? (
          <div className="text-center sm:text-left">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 sm:mx-0">
              <LayoutGrid className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-900">Editör hazır</h3>
            <p className="mt-2 text-zinc-500">
              {tier} planın ile tüm özellikler açık. Tam ekranda çalışmaya başla.
            </p>
            <Link
              href="/dashboard/editor/roblox"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700"
            >
              Editörü aç <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-4 rounded-2xl bg-amber-50 p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">
                  {upgrade ? 'Bu özellik planında yok' : 'Enterprise plan gerekli'}
                </p>
                <p className="mt-1 text-sm text-amber-800/80">
                  Mevcut plan: {tier}. UI Editor Enterprise ve üzeri planlarda kullanılabilir.
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <Sparkles className="h-4 w-4" /> Planı yükselt
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditorHubPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-zinc-500">Yükleniyor...</div>}>
      <EditorHubContent />
    </Suspense>
  );
}
