export type InstanceType =
  | 'ScreenGui'
  | 'Frame'
  | 'TextLabel'
  | 'TextButton'
  | 'ImageLabel'
  | 'ImageButton'
  | 'ScrollingFrame'
  | 'TextBox';

export type TextAlignX = 'Left' | 'Center' | 'Right';
export type TextAlignY = 'Top' | 'Center' | 'Bottom';

export interface UIInstanceProps {
  size: { scale: [number, number]; offset: [number, number] };
  position: { scale: [number, number]; offset: [number, number] };
  anchorPoint: [number, number];
  backgroundColor: string;
  backgroundTransparency: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
  cornerRadius: number;
  borderSize: number;
  borderColor: string;
  padding: number;
  text?: string;
  textColor?: string;
  textSize?: number;
  textScaled?: boolean;
  textXAlignment?: TextAlignX;
  textYAlignment?: TextAlignY;
  fontFace?: string;
  image?: string;
  imageTransparency?: number;
  scrollBarThickness?: number;
}

export interface UIInstance {
  readonly id: string;
  name: string;
  type: InstanceType;
  parentId: string | null;
  children: string[];
  props: UIInstanceProps;
}

export type EditorSnapshot = Record<string, UIInstance>;
