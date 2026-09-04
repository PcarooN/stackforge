import type { EditorSnapshot } from './types';
import { createDefaultProps } from './defaults';

const ROOT = 'root';

function shopTemplate(name: string, children: EditorSnapshot): EditorSnapshot {
  return {
    [ROOT]: {
      id: ROOT,
      name,
      type: 'ScreenGui',
      parentId: null,
      children: Object.keys(children).filter((id) => id !== ROOT),
      props: createDefaultProps('ScreenGui'),
    },
    ...children,
  };
}

/** Hazır shop GUI iskeletleri */
export const SHOP_TEMPLATES: { id: string; label: string; description: string; build: () => EditorSnapshot }[] = [
  {
    id: 'minimal',
    label: 'Minimal Shop',
    description: 'Başlık + satın al butonu',
    build: () => {
      const main = 'main';
      const title = 'title';
      const btn = 'btn';
      return shopTemplate('MinimalShop', {
        [main]: {
          id: main,
          name: 'MainFrame',
          type: 'Frame',
          parentId: ROOT,
          children: [title, btn],
          props: {
            ...createDefaultProps('Frame'),
            position: { scale: [0.5, 0.5], offset: [-200, -140] },
            size: { scale: [0, 0], offset: [400, 280] },
            backgroundColor: '#0f172a',
            cornerRadius: 16,
            borderSize: 1,
            borderColor: '#334155',
          },
        },
        [title]: {
          id: title,
          name: 'Title',
          type: 'TextLabel',
          parentId: main,
          children: [],
          props: {
            ...createDefaultProps('TextLabel'),
            position: { scale: [0, 0], offset: [24, 24] },
            size: { scale: [0, 0], offset: [352, 48] },
            text: 'Premium Shop',
            textSize: 24,
          },
        },
        [btn]: {
          id: btn,
          name: 'BuyButton',
          type: 'TextButton',
          parentId: main,
          children: [],
          props: {
            ...createDefaultProps('TextButton'),
            position: { scale: [0.5, 1], offset: [-75, -72] },
            size: { scale: [0, 0], offset: [150, 48] },
            text: 'Purchase',
            backgroundColor: '#4f46e5',
          },
        },
      });
    },
  },
  {
    id: 'grid',
    label: 'Item Grid',
    description: 'Scroll liste + 3 ürün kartı',
    build: () => {
      const main = 'main';
      const scroll = 'scroll';
      const cards = ['c1', 'c2', 'c3'];
      const snapshot: EditorSnapshot = shopTemplate('GridShop', {
        [main]: {
          id: main,
          name: 'ShopPanel',
          type: 'Frame',
          parentId: ROOT,
          children: [scroll],
          props: {
            ...createDefaultProps('Frame'),
            position: { scale: [0.5, 0.5], offset: [-220, -180] },
            size: { scale: [0, 0], offset: [440, 360] },
            backgroundColor: '#111827',
            cornerRadius: 20,
          },
        },
        [scroll]: {
          id: scroll,
          name: 'ItemList',
          type: 'ScrollingFrame',
          parentId: main,
          children: cards,
          props: {
            ...createDefaultProps('ScrollingFrame'),
            position: { scale: [0, 0], offset: [20, 20] },
            size: { scale: [0, 0], offset: [400, 320] },
            backgroundColor: '#1f2937',
          },
        },
      });
      cards.forEach((id, i) => {
        snapshot[id] = {
          id,
          name: `Item_${i + 1}`,
          type: 'Frame',
          parentId: scroll,
          children: [],
          props: {
            ...createDefaultProps('Frame'),
            position: { scale: [0, 0], offset: [12, 12 + i * 100] },
            size: { scale: [0, 0], offset: [376, 88] },
            backgroundColor: '#374151',
            cornerRadius: 12,
          },
        };
      });
      return snapshot;
    },
  },
];
