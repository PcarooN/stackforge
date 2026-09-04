'use client';

import { Download, Package, Clock } from 'lucide-react';

const products = [
  { id: 'PROD-001', name: 'StackForge Core', version: 'v2.4.1', size: '42 MB', date: '18 May 2026' },
  { id: 'PROD-002', name: 'UI Kit', version: 'v1.0.8', size: '12 MB', date: '22 Apr 2026' },
];

export default function DownloadsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">İndirmeler</h2>
        <p className="mt-1 text-sm text-zinc-500">Lisanslı paketlerin ve binary dosyaların</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900">{item.name}</h3>
            <p className="text-xs text-zinc-400">{item.id}</p>
            <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500">
              <span className="rounded-lg bg-zinc-100 px-2 py-1">{item.version}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {item.date}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">{item.size}</p>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-violet-600"
            >
              <Download className="h-4 w-4" /> İndir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
