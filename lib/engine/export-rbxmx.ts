import type { UIInstance } from './types';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hexToRgb3(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full.padEnd(6, '0').slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function udim2(prop: UIInstance['props']['size']): string {
  return `<UDim2 xmlns="http://www.roblox.com/roblox.xsd"><XS>${prop.scale[0]}</XS><XO>${prop.offset[0]}</XO><YS>${prop.scale[1]}</YS><YO>${prop.offset[1]}</YO></UDim2>`;
}

function color3(hex: string): string {
  const [r, g, b] = hexToRgb3(hex);
  return `<Color3 xmlns="http://www.roblox.com/roblox.xsd"><R>${r}</R><G>${g}</G><B>${b}</B></Color3>`;
}

function itemForInstance(inst: UIInstance): string {
  const p = inst.props;
  const lines: string[] = [
    `<string name="Name">${escapeXml(inst.name)}</string>`,
    `<bool name="Visible">${p.visible}</bool>`,
    `<float name="Rotation">${p.rotation}</float>`,
    `<int name="ZIndex">${p.zIndex}</int>`,
    `<token name="Size">${udim2(p.size)}</token>`,
    `<token name="Position">${udim2(p.position)}</token>`,
    `<Color3 name="BackgroundColor3">${color3(p.backgroundColor)}</Color3>`,
    `<float name="BackgroundTransparency">${p.backgroundTransparency}</float>`,
  ];

  if (p.text !== undefined) {
    lines.push(`<string name="Text">${escapeXml(p.text)}</string>`);
  }
  if (p.textColor) {
    lines.push(`<Color3 name="TextColor3">${color3(p.textColor)}</Color3>`);
  }
  if (p.textSize !== undefined) {
    lines.push(`<float name="TextSize">${p.textSize}</float>`);
  }
  if (p.textScaled !== undefined) {
    lines.push(`<bool name="TextScaled">${p.textScaled}</bool>`);
  }
  if (p.image) {
    lines.push(`<string name="Image">${escapeXml(p.image)}</string>`);
  }

  const propsXml = lines.map((l) => `      ${l}`).join('\n');
  return `    <Item class="${inst.type}" referent="${inst.id}">\n${propsXml}\n    </Item>`;
}

/** Roblox Studio imports .rbxmx (XML). Binary .rbxm can be added in a later pass. */
export function exportInstancesToRbxmx(
  instances: Record<string, UIInstance>,
  rootId = 'root'
): string {
  const root = instances[rootId];
  if (!root) throw new Error('Root ScreenGui not found');

  const ordered: UIInstance[] = [];
  const walk = (id: string) => {
    const node = instances[id];
    if (!node) return;
    ordered.push(node);
    node.children.forEach(walk);
  };
  walk(rootId);

  const items = ordered.map(itemForInstance).join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
  <External>null</External>
  <External>nil</External>
  <Item class="Folder" referent="RBX0">
    <Properties>
      <string name="Name">StackForgeExport</string>
    </Properties>
${items}
  </Item>
</roblox>`;
}

export function downloadRbxmx(xml: string, filename = 'ShopGui.rbxmx') {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
