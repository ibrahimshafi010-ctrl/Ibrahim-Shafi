export type ViewMode = 'home' | 'templates' | 'editor' | 'tools' | 'pricing';

export type ToolType = 'resize' | 'compress' | 'convert' | 'qr' | 'palette' | 'wordcount';

export type ElementType = 'text' | 'shape' | 'image';

export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'square'
  | 'ellipse'
  | 'rounded-rect'
  | 'pill'
  | 'triangle'
  | 'triangle-inverted'
  | 'star'
  | 'star-8'
  | 'star-12'
  | 'heart'
  | 'diamond'
  | 'hexagon'
  | 'octagon'
  | 'pentagon'
  | 'arrow-right'
  | 'arrow-double'
  | 'line'
  | 'line-arrow'
  | 'cross'
  | 'lightning'
  | 'cloud'
  | 'speech-bubble'
  | 'semicircle'
  | 'arc'
  | 'badge';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number; // in canvas px coordinate system
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  
  // Shadow
  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;

  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: 'normal' | '600' | 'bold' | '800';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  textBackground?: string;

  // Shape specific
  shapeType?: ShapeType;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;

  // Image specific
  src?: string;
  imageAlt?: string;
  objectFit?: 'cover' | 'contain';
}

export interface CanvasPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: string;
  aspectRatioLabel: string;
}

export interface DesignTemplate {
  id: string;
  title: string;
  category: 'instagram' | 'story' | 'youtube' | 'wallpaper' | 'poster' | 'presentation' | 'banner' | 'square';
  categoryLabel: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  backgroundColor: string;
  backgroundGradient?: string;
  elements: CanvasElement[];
  previewAccentColor: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning';
}

export interface SavedProject {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
  updatedAt: number;
}
