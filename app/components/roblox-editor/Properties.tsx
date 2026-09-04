'use client';

import { produce } from 'immer';
import { PROPERTIES_SCHEMA } from '@/lib/engine/constanst';
import type { TextAlignX, TextAlignY } from '@/lib/engine/types';
import { useEditorStore, ROOT_ID } from './store';

const TEXT_TYPES = new Set(['TextLabel', 'TextButton', 'TextBox']);

export function Properties() {
  const instances = useEditorStore((s) => s.instances);
  const selectedId = useEditorStore((s) => s.selectedId);
  const updateProps = useEditorStore((s) => s.updateProps);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const el = selectedId ? instances[selectedId] : null;
  if (!el || el.id === ROOT_ID) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-400">
        Bir eleman seç
      </div>
    );
  }

  const patch = (p: Parameters<typeof updateProps>[1]) => {
    pushHistory();
    updateProps(el.id, p);
  };

  const setName = (name: string) => {
    useEditorStore.setState(
      produce((state) => {
        if (state.instances[el.id]) state.instances[el.id].name = name;
      })
    );
  };

  const isText = TEXT_TYPES.has(el.type);

  return (
    <div className="space-y-5 p-4 text-sm">
      <label className="block">
        <span className="text-xs font-medium text-zinc-500">İsim</span>
        <input
          value={el.name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => pushHistory()}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
      </label>

      {Object.entries(PROPERTIES_SCHEMA).map(([section, keys]) => (
        <div key={section}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">{section}</h3>
          <div className="space-y-3">
            {keys.includes('backgroundColor') && (
              <label className="block">
                <span className="text-xs text-zinc-500">Arka plan</span>
                <input
                  type="color"
                  value={el.props.backgroundColor}
                  onChange={(e) => patch({ backgroundColor: e.target.value })}
                  className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-zinc-200"
                />
              </label>
            )}
            {keys.includes('backgroundTransparency') && (
              <label className="block">
                <span className="text-xs text-zinc-500">Saydamlık</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={el.props.backgroundTransparency}
                  onChange={(e) => patch({ backgroundTransparency: Number(e.target.value) })}
                  className="mt-1 w-full accent-violet-600"
                />
              </label>
            )}
            {keys.includes('cornerRadius') && (
              <label className="block">
                <span className="text-xs text-zinc-500">Köşe ({el.props.cornerRadius}px)</span>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={el.props.cornerRadius}
                  onChange={(e) => patch({ cornerRadius: Number(e.target.value) })}
                  className="mt-1 w-full accent-violet-600"
                />
              </label>
            )}
            {keys.includes('borderSize') && (
              <>
                <label className="block">
                  <span className="text-xs text-zinc-500">Kenarlık</span>
                  <input
                    type="range"
                    min={0}
                    max={8}
                    value={el.props.borderSize}
                    onChange={(e) => patch({ borderSize: Number(e.target.value) })}
                    className="mt-1 w-full accent-violet-600"
                  />
                </label>
                {el.props.borderSize > 0 && (
                  <input
                    type="color"
                    value={el.props.borderColor}
                    onChange={(e) => patch({ borderColor: e.target.value })}
                    className="h-9 w-full rounded-xl border border-zinc-200"
                  />
                )}
              </>
            )}
            {keys.includes('zIndex') && (
              <label className="block">
                <span className="text-xs text-zinc-500">Z-Index</span>
                <input
                  type="number"
                  value={el.props.zIndex}
                  onChange={(e) => patch({ zIndex: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
                />
              </label>
            )}
            {keys.includes('visible') && (
              <label className="flex items-center gap-2 text-zinc-600">
                <input
                  type="checkbox"
                  checked={el.props.visible}
                  onChange={(e) => patch({ visible: e.target.checked })}
                  className="rounded accent-violet-600"
                />
                Görünür
              </label>
            )}
            {isText && keys.includes('text') && (
              <label className="block">
                <span className="text-xs text-zinc-500">Metin</span>
                <input
                  value={el.props.text ?? ''}
                  onChange={(e) => updateProps(el.id, { text: e.target.value })}
                  onBlur={() => pushHistory()}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
                />
              </label>
            )}
            {isText && keys.includes('textColor') && (
              <input
                type="color"
                value={el.props.textColor ?? '#ffffff'}
                onChange={(e) => patch({ textColor: e.target.value })}
                className="h-9 w-full rounded-xl border border-zinc-200"
              />
            )}
            {isText && keys.includes('textSize') && (
              <input
                type="number"
                min={8}
                max={72}
                value={el.props.textSize ?? 14}
                onChange={(e) => patch({ textSize: Number(e.target.value) })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
              />
            )}
            {isText && keys.includes('textXAlignment') && (
              <select
                value={el.props.textXAlignment ?? 'Center'}
                onChange={(e) => patch({ textXAlignment: e.target.value as TextAlignX })}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                <option value="Left">Sol</option>
                <option value="Center">Orta</option>
                <option value="Right">Sağ</option>
              </select>
            )}
            {keys.includes('image') && (el.type === 'ImageLabel' || el.type === 'ImageButton') && (
              <input
                value={el.props.image ?? ''}
                placeholder="rbxassetid://"
                onChange={(e) => updateProps(el.id, { image: e.target.value })}
                onBlur={() => pushHistory()}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs"
              />
            )}
          </div>
        </div>
      ))}

      <div className="rounded-xl bg-zinc-50 p-3 text-xs text-zinc-500">
        {el.props.position.offset[0]}×{el.props.position.offset[1]} · {el.props.size.offset[0]}×
        {el.props.size.offset[1]}
      </div>
    </div>
  );
}
