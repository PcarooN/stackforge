'use client';

import { ChevronDown, ChevronRight, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';
import { PALETTE_ITEMS } from '@/lib/engine/constanst';
import type { InstanceType } from '@/lib/engine/types';
import { useEditorStore, ROOT_ID } from './store';
import { TemplatePicker } from './TemplatePicker';
import { cn } from '@/lib/utils';

function TreeNode({ id, depth }: { id: string; depth: number }) {
  const [open, setOpen] = useState(true);
  const instances = useEditorStore((s) => s.instances);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const removeInstance = useEditorStore((s) => s.removeInstance);
  const moveInstanceOrder = useEditorStore((s) => s.moveInstanceOrder);

  const node = instances[id];
  if (!node) return null;

  return (
    <div>
      <div
        className={cn(
          'group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 pr-1 text-sm',
          selectedId === id ? 'bg-violet-100 text-violet-800' : 'text-zinc-600 hover:bg-zinc-50'
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={() => setSelectedId(id)}
      >
        <button
          type="button"
          className="p-0.5 text-zinc-400"
          onClick={(e) => {
            e.stopPropagation();
            if (node.children.length) setOpen((o) => !o);
          }}
        >
          {node.children.length ? (
            open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <span className="inline-block w-3.5" />
          )}
        </button>
        <span className="flex-1 truncate font-medium">{node.name}</span>
        {id !== ROOT_ID && (
          <div className="flex opacity-0 group-hover:opacity-100">
            <button type="button" onClick={(e) => { e.stopPropagation(); moveInstanceOrder(id, 'up'); }} className="p-1 text-zinc-400 hover:text-zinc-700">
              <ArrowUp className="h-3 w-3" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); moveInstanceOrder(id, 'down'); }} className="p-1 text-zinc-400 hover:text-zinc-700">
              <ArrowDown className="h-3 w-3" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); removeInstance(id); }} className="p-1 text-red-500">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      {open && node.children.map((cid) => <TreeNode key={cid} id={cid} depth={depth + 1} />)}
    </div>
  );
}

export function Explorer() {
  const addInstance = useEditorStore((s) => s.addInstance);
  const selectedId = useEditorStore((s) => s.selectedId);
  const instances = useEditorStore((s) => s.instances);

  const parentId = (() => {
    if (!selectedId) return ROOT_ID;
    const sel = instances[selectedId];
    if (sel && ['Frame', 'ScrollingFrame', 'ScreenGui'].includes(sel.type)) return selectedId;
    return sel?.parentId ?? ROOT_ID;
  })();

  return (
    <div className="flex h-full flex-col">
      <TemplatePicker />
      <div className="border-b border-zinc-100 p-4">
        <p className="mb-3 text-xs font-semibold text-zinc-500">Eleman ekle</p>
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_ITEMS.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => addInstance(type as InstanceType, parentId)}
              className="rounded-xl border border-zinc-100 bg-white py-2 text-xs font-medium text-zinc-700 shadow-sm hover:border-violet-200 hover:text-violet-700"
            >
              + {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">→ {instances[parentId]?.name}</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-1 text-xs font-semibold text-zinc-500">Katmanlar</p>
        <TreeNode id={ROOT_ID} depth={0} />
      </div>
    </div>
  );
}
