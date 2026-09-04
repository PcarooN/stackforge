import type { InstanceType, UIInstanceProps } from './types';

export function createDefaultProps(type: InstanceType): UIInstanceProps {
  const base: UIInstanceProps = {
    size: { scale: [0, 0], offset: [200, 120] },
    position: { scale: [0, 0], offset: [24, 24] },
    anchorPoint: [0, 0],
    backgroundColor: '#1e293b',
    backgroundTransparency: 0,
    rotation: 0,
    zIndex: 1,
    visible: true,
    cornerRadius: 8,
    borderSize: 0,
    borderColor: '#334155',
    padding: 8,
    imageTransparency: 0,
    scrollBarThickness: 6,
  };

  switch (type) {
    case 'ScreenGui':
      return {
        ...base,
        size: { scale: [1, 1], offset: [0, 0] },
        position: { scale: [0, 0], offset: [0, 0] },
        backgroundTransparency: 1,
        zIndex: 0,
        cornerRadius: 0,
      };
    case 'TextLabel':
      return {
        ...base,
        size: { scale: [0, 0], offset: [180, 44] },
        backgroundTransparency: 1,
        text: 'Shop Title',
        textColor: '#f8fafc',
        textSize: 20,
        textScaled: false,
        textXAlignment: 'Center',
        textYAlignment: 'Center',
        fontFace: 'GothamBold',
      };
    case 'TextButton':
      return {
        ...base,
        size: { scale: [0, 0], offset: [150, 48] },
        backgroundColor: '#2563eb',
        text: 'Satın Al',
        textColor: '#ffffff',
        textSize: 16,
        textScaled: false,
        textXAlignment: 'Center',
        textYAlignment: 'Center',
        cornerRadius: 10,
        fontFace: 'GothamMedium',
      };
    case 'ImageLabel':
      return {
        ...base,
        size: { scale: [0, 0], offset: [120, 120] },
        image: '',
        backgroundColor: '#334155',
        cornerRadius: 12,
      };
    case 'ImageButton':
      return {
        ...base,
        size: { scale: [0, 0], offset: [64, 64] },
        image: '',
        backgroundColor: '#475569',
        cornerRadius: 12,
      };
    case 'ScrollingFrame':
      return {
        ...base,
        size: { scale: [0, 0], offset: [320, 240] },
        backgroundColor: '#0f172a',
        cornerRadius: 12,
        borderSize: 1,
        borderColor: '#1e293b',
      };
    case 'TextBox':
      return {
        ...base,
        size: { scale: [0, 0], offset: [200, 40] },
        backgroundColor: '#1e293b',
        text: '',
        textColor: '#e2e8f0',
        textSize: 14,
        cornerRadius: 6,
        borderSize: 1,
        borderColor: '#475569',
      };
    default:
      return base;
  }
}
