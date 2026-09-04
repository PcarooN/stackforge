'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Explorer } from './Explorer';
import { Viewport } from './Viewport';
import { Properties } from './Properties';
import { Toolbar } from './Toolbar';
import { useEditorStore } from './store';
import { exportInstancesToRbxmx, downloadRbxmx } from '@/lib/engine/export-rbxmx';

export function EditorShell() {
  const projectName = useEditorStore((s) => s.projectName);
  const setProjectName = useEditorStore((s) => s.setProjectName);

  const handleExport = () => {
    try {
      const { instances } = useEditorStore.getState();
      const xml = exportInstancesToRbxmx(instances);
      const safeName = projectName.replace(/[^\w.-]+/g, '_') || 'ShopGui';
      downloadRbxmx(xml, `${safeName}.rbxmx`);
      toast.success('Studio dosyası indirildi');
    } catch {
      toast.error('Export başarısız');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-[#eef0f4] text-zinc-900">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/editor"
            className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-zinc-900">UI Editor</p>
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-44 border-none bg-transparent text-xs text-zinc-500 outline-none focus:text-zinc-800"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toast.success('Kaydedildi')}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Save className="mr-1.5 inline h-4 w-4" />
            Kaydet
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/25 hover:bg-violet-700"
          >
            <Download className="mr-1.5 inline h-4 w-4" />
            Export
          </button>
        </div>
      </header>

      <Toolbar />

      <div className="flex min-h-0 flex-1 gap-0 p-3">
        <aside className="w-60 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm lg:w-64">
          <Explorer />
        </aside>
        <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
          <Viewport />
        </div>
        <aside className="hidden w-72 shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm xl:flex xl:flex-col">
          <div className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-800">
            Özellikler
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Properties />
          </div>
        </aside>
      </div>
    </div>
  );
}
