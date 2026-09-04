'use client';

import { Copy, Grid3X3, Magnet, Redo2, Trash2, Undo2, ZoomIn, ZoomOut } from 'lucide-react';
import { useEditorStore } from './store';

export function Toolbar() {
  const {
    zoom,
    snapToGrid,
    showGrid,
    selectedId,
    setZoom,
    setSnapToGrid,
    setShowGrid,
    undo,
    redo,
    duplicateInstance,
    removeInstance,
    history,
    future,
  } = useEditorStore();

  const btn =
    'rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-30';
  const pill = (on: boolean) =>
    `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
      on ? 'bg-violet-100 text-violet-700' : 'bg-white text-zinc-500 border border-zinc-200'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200/80 bg-white px-4 py-2">
      <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
        <button type="button" disabled={history.length === 0} onClick={undo} className={btn}>
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" disabled={future.length === 0} onClick={redo} className={btn}>
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
        <button type="button" onClick={() => setZoom(zoom - 0.1)} className={btn}>
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] text-center text-xs font-medium text-zinc-600">
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" onClick={() => setZoom(zoom + 0.1)} className={btn}>
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      <button type="button" onClick={() => setSnapToGrid(!snapToGrid)} className={pill(snapToGrid)}>
        <Magnet className="h-3.5 w-3.5" /> Snap
      </button>
      <button type="button" onClick={() => setShowGrid(!showGrid)} className={pill(showGrid)}>
        <Grid3X3 className="h-3.5 w-3.5" /> Grid
      </button>

      {selectedId && (
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => duplicateInstance(selectedId)}
            className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
          >
            <Copy className="h-3.5 w-3.5" /> Kopyala
          </button>
          <button
            type="button"
            onClick={() => removeInstance(selectedId)}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" /> Sil
          </button>
        </div>
      )}
    </div>
  );
}
