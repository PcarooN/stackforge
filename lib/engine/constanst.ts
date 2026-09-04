export const PROPERTIES_SCHEMA = {
  Appearance: [
    'backgroundColor',
    'backgroundTransparency',
    'visible',
    'cornerRadius',
    'borderSize',
    'borderColor',
  ],
  Layout: ['size', 'position', 'anchorPoint', 'rotation', 'zIndex', 'padding'],
  Data: ['text', 'textColor', 'textSize', 'textScaled', 'textXAlignment', 'textYAlignment', 'fontFace', 'image'],
};

export const PALETTE_ITEMS: { type: import('./types').InstanceType; label: string; desc: string }[] = [
  { type: 'Frame', label: 'Frame', desc: 'Konteyner' },
  { type: 'TextButton', label: 'Button', desc: 'Tıklanabilir' },
  { type: 'TextLabel', label: 'Label', desc: 'Metin' },
  { type: 'ImageLabel', label: 'Image', desc: 'Görsel' },
  { type: 'ImageButton', label: 'ImgBtn', desc: 'Görsel btn' },
  { type: 'ScrollingFrame', label: 'Scroll', desc: 'Liste alanı' },
  { type: 'TextBox', label: 'Input', desc: 'Metin kutusu' },
];
