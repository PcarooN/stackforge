'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import type { EditorSnapshot, InstanceType, UIInstance } from '@/lib/engine/types';
import { createDefaultProps } from '@/lib/engine/defaults';

const ROOT_ID = 'root';
const MAX_HISTORY = 40;

function createRoot(): UIInstance {
  return {
    id: ROOT_ID,
    name: 'ShopGui',
    type: 'ScreenGui',
    parentId: null,
    children: [],
    props: createDefaultProps('ScreenGui'),
  };
}

function cloneSnapshot(instances: EditorSnapshot): EditorSnapshot {
  return JSON.parse(JSON.stringify(instances)) as EditorSnapshot;
}

function canParent(type: InstanceType): boolean {
  return type === 'ScreenGui' || type === 'Frame' || type === 'ScrollingFrame';
}

type EditorState = {
  instances: EditorSnapshot;
  selectedId: string | null;
  projectName: string;
  zoom: number;
  snapToGrid: boolean;
  showGrid: boolean;
  history: EditorSnapshot[];
  future: EditorSnapshot[];
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  setProjectName: (name: string) => void;
  setZoom: (z: number) => void;
  setSnapToGrid: (v: boolean) => void;
  setShowGrid: (v: boolean) => void;
  loadTemplate: (snapshot: EditorSnapshot, name: string) => void;
  addInstance: (type: InstanceType, parentId?: string) => void;
  duplicateInstance: (id: string) => void;
  updateProps: (id: string, patch: Partial<UIInstance['props']>) => void;
  updateLayout: (id: string, layout: { x: number; y: number; width: number; height: number }) => void;
  setSelectedId: (id: string | null) => void;
  renameInstance: (id: string, name: string) => void;
  removeInstance: (id: string) => void;
  moveInstanceOrder: (id: string, direction: 'up' | 'down') => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  instances: { [ROOT_ID]: createRoot() },
  selectedId: null,
  projectName: 'Untitled_Shop_UI',
  zoom: 1,
  snapToGrid: true,
  showGrid: true,
  history: [],
  future: [],

  pushHistory: () =>
    set((state) => ({
      history: [...state.history.slice(-MAX_HISTORY + 1), cloneSnapshot(state.instances)],
      future: [],
    })),

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        instances: prev,
        history: state.history.slice(0, -1),
        future: [cloneSnapshot(state.instances), ...state.future],
        selectedId: null,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return {
        instances: next,
        future: rest,
        history: [...state.history, cloneSnapshot(state.instances)],
        selectedId: null,
      };
    }),

  setProjectName: (name) => set({ projectName: name }),
  setZoom: (z) => set({ zoom: Math.min(2, Math.max(0.5, z)) }),
  setSnapToGrid: (v) => set({ snapToGrid: v }),
  setShowGrid: (v) => set({ showGrid: v }),

  loadTemplate: (snapshot, name) => {
    get().pushHistory();
    set({ instances: cloneSnapshot(snapshot), projectName: name, selectedId: null });
  },

  addInstance: (type, parentId) => {
    const parentKey = parentId ?? ROOT_ID;
    const parent = get().instances[parentKey];
    if (!parent || !canParent(parent.type)) return;

    get().pushHistory();
    set(
      produce((state: EditorState) => {
        const id = `inst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        state.instances[id] = {
          id,
          name: type,
          type,
          parentId: parentKey,
          children: [],
          props: createDefaultProps(type),
        };
        state.instances[parentKey].children.push(id);
        state.selectedId = id;
      })
    );
  },

  duplicateInstance: (id) => {
    const src = get().instances[id];
    if (!src || !src.parentId || id === ROOT_ID) return;
    get().pushHistory();
    set(
      produce((state: EditorState) => {
        const newId = `inst_${Date.now()}_dup`;
        const cloned = JSON.parse(JSON.stringify(src)) as UIInstance;
        state.instances[newId] = {
          ...cloned,
          id: newId,
          children: [],
          name: `${src.name}_Copy`,
          props: {
            ...cloned.props,
            position: {
              ...cloned.props.position,
              offset: [
                cloned.props.position.offset[0] + 16,
                cloned.props.position.offset[1] + 16,
              ],
            },
          },
        };
        state.instances[src.parentId!].children.push(newId);
        state.selectedId = newId;
      })
    );
  },

  updateProps: (id, patch) => {
    set(
      produce((state: EditorState) => {
        const inst = state.instances[id];
        if (!inst) return;
        inst.props = { ...inst.props, ...patch };
      })
    );
  },

  updateLayout: (id, { x, y, width, height }) => {
    const snap = get().snapToGrid ? 8 : 1;
    const sx = Math.round(x / snap) * snap;
    const sy = Math.round(y / snap) * snap;
    const sw = Math.round(width / snap) * snap;
    const sh = Math.round(height / snap) * snap;

    set(
      produce((state: EditorState) => {
        const inst = state.instances[id];
        if (!inst || id === ROOT_ID) return;
        inst.props.position.offset = [sx, sy];
        inst.props.size.offset = [Math.max(24, sw), Math.max(24, sh)];
      })
    );
  },

  setSelectedId: (id) => set({ selectedId: id }),

  renameInstance: (id, name) => {
    set(
      produce((state: EditorState) => {
        if (state.instances[id]) state.instances[id].name = name;
      })
    );
  },

  removeInstance: (id) => {
    if (id === ROOT_ID) return;
    get().pushHistory();
    set(
      produce((state: EditorState) => {
        const inst = state.instances[id];
        if (!inst?.parentId) return;
        const removeTree = (nodeId: string) => {
          const node = state.instances[nodeId];
          if (!node) return;
          [...node.children].forEach(removeTree);
          delete state.instances[nodeId];
        };
        const parent = state.instances[inst.parentId];
        if (parent) parent.children = parent.children.filter((c) => c !== id);
        removeTree(id);
        if (state.selectedId === id) state.selectedId = null;
      })
    );
  },

  moveInstanceOrder: (id, direction) => {
    const inst = get().instances[id];
    if (!inst?.parentId) return;
    get().pushHistory();
    set(
      produce((state: EditorState) => {
        const parent = state.instances[inst.parentId!];
        const idx = parent.children.indexOf(id);
        if (idx < 0) return;
        const swap = direction === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= parent.children.length) return;
        const arr = [...parent.children];
        [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
        parent.children = arr;
      })
    );
  },
}));

export { ROOT_ID };
