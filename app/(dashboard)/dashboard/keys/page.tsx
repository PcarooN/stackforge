'use client';

import { Copy, RefreshCw, History, KeyRound } from 'lucide-react';

export default function KeysPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">API Keys</h2>
        <p className="mt-1 text-sm text-zinc-500">Entegrasyon anahtarlarını yönet</p>
      </div>

      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold text-zinc-900">
            <KeyRound className="h-5 w-5 text-violet-500" /> Aktif anahtar
          </h3>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-800"
          >
            <RefreshCw className="h-4 w-4" /> Yenile
          </button>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4">
          <code className="text-sm font-medium text-violet-700">SF_LIVE_A9XJ_2201_99X</code>
          <Copy className="h-4 w-4 cursor-pointer text-zinc-400 hover:text-zinc-700" />
        </div>

        <h4 className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold text-zinc-800">
          <History className="h-4 w-4" /> Son aktivite
        </h4>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex justify-between border-b border-zinc-100 py-2 text-sm text-zinc-600 last:border-0"
            >
              <span>192.168.1.105</span>
              <span className="text-emerald-600">Başarılı</span>
              <span className="text-zinc-400">2 dk önce</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
