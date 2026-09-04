'use client';

import { useCallback, type CSSProperties } from 'react';
import { Rnd } from 'react-rnd';
import { useEditorStore, ROOT_ID } from './store';
import type { UIInstance } from '@/lib/engine/types';
import { cn } from '@/lib/utils';

function textAlignStyle(inst: UIInstance): CSSProperties {
  const x = inst.props.textXAlignment ?? 'Center';
  const y = inst.props.textYAlignment ?? 'Center';
  return {
    justifyContent: x === 'Left' ? 'flex-start' : x === 'Right' ? 'flex-end' : 'center',
    alignItems: y === 'Top' ? 'flex-start' : y === 'Bottom' ? 'flex-end' : 'center',
  };
}

function InstancePreview({
  inst,
  selectedId,
  onSelect,
  onLayoutEnd,
}: {
  inst: UIInstance;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onLayoutEnd: (id: string, layout: { x: number; y: number; width: number; height: number }) => void;
}) {
  const [x, y] = inst.props.position.offset;
  const [w, h] = inst.props.size.offset;
  const isSelected = selectedId === inst.id;
  const r = inst.props.cornerRadius ?? 0;
  const border = inst.props.borderSize ?? 0;
  const textTypes = ['TextLabel', 'TextButton', 'TextBox'] as const;
  const showText = textTypes.includes(inst.type as (typeof textTypes)[number]);

  return (
    <Rnd
      size={{ width: w, height: h }}
      position={{ x, y }}
      bounds="parent"
      onDragStop={(_e, d) => onLayoutEnd(inst.id, { x: d.x, y: d.y, width: w, height: h })}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onLayoutEnd(inst.id, { x: pos.x, y: pos.y, width: ref.offsetWidth, height: ref.offsetHeight })
      }
      className={cn('absolute box-border', isSelected && 'ring-2 ring-violet-500 ring-offset-2')}
      style={{
        backgroundColor: inst.props.backgroundColor,
        opacity: 1 - inst.props.backgroundTransparency,
        zIndex: inst.props.zIndex,
        transform: `rotate(${inst.props.rotation}deg)`,
        borderRadius: r,
        border: border > 0 ? `${border}px solid ${inst.props.borderColor}` : undefined,
        padding: inst.props.padding,
        boxShadow: isSelected ? '0 4px 20px rgba(124,58,237,0.25)' : '0 1px 3px rgba(0,0,0,0.08)',
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(inst.id);
      }}
    >
      {showText && (
        <div
          className="flex h-full w-full select-none px-1"
          style={{
            ...textAlignStyle(inst),
            color: inst.props.textColor ?? '#fff',
            fontSize: inst.props.textScaled ? undefined : inst.props.textSize ?? 14,
          }}
        >
          <span>{inst.props.text || inst.type}</span>
        </div>
      )}
      {(inst.type === 'ImageLabel' || inst.type === 'ImageButton') && (
        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">Image</div>
      )}
    </Rnd>
  );
}

export function Viewport() {
  const instances = useEditorStore((s) => s.instances);
  const selectedId = useEditorStore((s) => s.selectedId);
  const zoom = useEditorStore((s) => s.zoom);
  const showGrid = useEditorStore((s) => s.showGrid);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const updateLayout = useEditorStore((s) => s.updateLayout);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const onLayoutEnd = useCallback(
    (id: string, layout: { x: number; y: number; width: number; height: number }) => {
      pushHistory();
      updateLayout(id, layout);
    },
    [pushHistory, updateLayout]
  );

  const flat: UIInstance[] = [];
  const walk = (id: string) => {
    const node = instances[id];
    if (!node) return;
    if (id !== ROOT_ID) flat.push(node);
    node.children.forEach(walk);
  };
  instances[ROOT_ID]?.children.forEach((c) => walk(c));

  return (
    <div className="flex h-full min-h-[480px] flex-col">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2">
        <span className="text-xs font-medium text-zinc-500">Canvas · 960×540</span>
        {selectedId && (
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            {instances[selectedId]?.name}
          </span>
        )}
      </div>
      <div
        className="relative flex flex-1 items-center justify-center overflow-auto bg-zinc-100/80 p-8"
        onMouseDown={() => setSelectedId(null)}
      >
        <div
          className="relative h-[540px] w-[960px] shrink-0 rounded-xl bg-white shadow-inner ring-1 ring-zinc-200/80"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            backgroundImage: showGrid
              ? 'linear-gradient(#e4e4e7 1px, transparent 1px), linear-gradient(90deg, #e4e4e7 1px, transparent 1px)'
              : undefined,
            backgroundSize: showGrid ? '16px 16px' : undefined,
          }}
        >
          {flat.map((inst) => (
            <InstancePreview
              key={inst.id}
              inst={inst}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onLayoutEnd={onLayoutEnd}
            />
          ))}
          {flat.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
              Sol panelden eleman veya şablon ekle
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
