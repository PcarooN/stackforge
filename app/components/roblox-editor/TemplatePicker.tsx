'use client';

import { Layers } from 'lucide-react';
import { SHOP_TEMPLATES } from '@/lib/engine/templates';
import { useEditorStore } from './store';

export function TemplatePicker() {
  const loadTemplate = useEditorStore((s) => s.loadTemplate);

  return (
    <div className="border-b border-zinc-100 p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-zinc-500">
        <Layers className="h-4 w-4" /> Şablonlar
      </p>
      <div className="space-y-2">
        {SHOP_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => loadTemplate(t.build(), t.label)}
            className="w-full rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/50"
          >
            <p className="text-sm font-medium text-zinc-800">{t.label}</p>
            <p className="text-xs text-zinc-500">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
