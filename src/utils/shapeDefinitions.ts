import { ShapeType } from '../types';

export interface ShapeDefinition {
  id: ShapeType;
  name: string;
  category: 'basic' | 'geometric' | 'arrows' | 'symbols';
  path: string;
}

export const SHAPE_DEFINITIONS: ShapeDefinition[] = [
  // BÁSICAS
  {
    id: 'square',
    name: 'Cuadrado',
    category: 'basic',
    path: 'M 6 6 H 94 V 94 H 6 Z',
  },
  {
    id: 'rectangle',
    name: 'Rectángulo',
    category: 'basic',
    path: 'M 6 18 H 94 V 82 H 6 Z',
  },
  {
    id: 'rounded-rect',
    name: 'Rectángulo redondeado',
    category: 'basic',
    path: 'M 22 10 H 78 C 88 10 94 16 94 26 V 74 C 94 84 88 90 78 90 H 22 C 12 90 6 84 6 74 V 26 C 6 16 12 10 22 10 Z',
  },
  {
    id: 'pill',
    name: 'Píldora / Botón',
    category: 'basic',
    path: 'M 30 18 H 70 C 88 18 94 32 94 50 C 94 68 88 82 70 82 H 30 C 12 82 6 68 6 50 C 6 32 12 18 30 18 Z',
  },
  {
    id: 'circle',
    name: 'Círculo',
    category: 'basic',
    path: 'M 50,50 m -44,0 a 44,44 0 1,0 88,0 a 44,44 0 1,0 -88,0',
  },
  {
    id: 'ellipse',
    name: 'Elipse',
    category: 'basic',
    path: 'M 50,50 m -45,0 a 45,28 0 1,0 90,0 a 45,28 0 1,0 -90,0',
  },
  {
    id: 'semicircle',
    name: 'Semicírculo',
    category: 'basic',
    path: 'M 6 84 A 44 44 0 0 1 94 84 Z',
  },
  {
    id: 'arc',
    name: 'Arco',
    category: 'basic',
    path: 'M 8 82 A 42 42 0 0 1 92 82 L 80 82 A 30 30 0 0 0 20 82 Z',
  },

  // GEOMÉTRICAS
  {
    id: 'triangle',
    name: 'Triángulo',
    category: 'geometric',
    path: 'M 50 8 L 94 92 H 6 Z',
  },
  {
    id: 'triangle-inverted',
    name: 'Triángulo invertido',
    category: 'geometric',
    path: 'M 6 10 L 94 10 L 50 94 Z',
  },
  {
    id: 'diamond',
    name: 'Rombo',
    category: 'geometric',
    path: 'M 50 6 L 94 50 L 50 94 L 6 50 Z',
  },
  {
    id: 'pentagon',
    name: 'Pentágono',
    category: 'geometric',
    path: 'M 50 6 L 94 38 L 77 92 L 23 92 L 6 38 Z',
  },
  {
    id: 'hexagon',
    name: 'Hexágono',
    category: 'geometric',
    path: 'M 25 8 L 75 8 L 94 50 L 75 92 L 25 92 L 6 50 Z',
  },
  {
    id: 'octagon',
    name: 'Octógono',
    category: 'geometric',
    path: 'M 30 6 L 70 6 L 94 30 L 94 70 L 70 94 L 30 94 L 6 70 L 6 30 Z',
  },

  // SÍMBOLOS Y FORMAS ESPECIALES
  {
    id: 'star',
    name: 'Estrella (5 puntas)',
    category: 'symbols',
    path: 'M 50 6 L 63 35 L 94 38 L 71 59 L 78 92 L 50 74 L 22 92 L 29 59 L 6 38 L 37 35 Z',
  },
  {
    id: 'star-8',
    name: 'Estrella (8 puntas)',
    category: 'symbols',
    path: 'M 50 6 L 61 24 L 82 18 L 76 39 L 94 50 L 76 61 L 82 82 L 61 76 L 50 94 L 39 76 L 18 82 L 24 61 L 6 50 L 24 39 L 18 18 L 39 24 Z',
  },
  {
    id: 'star-12',
    name: 'Estrella destello (12 puntas)',
    category: 'symbols',
    path: 'M 50 6 L 57 23 L 73 14 L 72 32 L 89 31 L 80 47 L 94 57 L 78 64 L 84 81 L 68 78 L 64 94 L 50 84 L 36 94 L 32 78 L 16 81 L 22 64 L 6 57 L 20 47 L 11 31 L 28 32 L 27 14 L 43 23 Z',
  },
  {
    id: 'heart',
    name: 'Corazón',
    category: 'symbols',
    path: 'M 50 88 C 20 65 6 46 6 28 C 6 13 18 6 32 6 C 41 6 47 10 50 17 C 53 10 59 6 68 6 C 82 6 94 13 94 28 C 94 46 80 65 50 88 Z',
  },
  {
    id: 'cross',
    name: 'Cruz',
    category: 'symbols',
    path: 'M 35 6 H 65 V 35 H 94 V 65 H 65 V 94 H 35 V 65 H 6 V 35 H 35 Z',
  },
  {
    id: 'lightning',
    name: 'Rayo',
    category: 'symbols',
    path: 'M 54 4 L 14 56 H 48 L 40 96 L 86 44 H 52 Z',
  },
  {
    id: 'cloud',
    name: 'Nube',
    category: 'symbols',
    path: 'M 28 80 C 16 80 6 70 6 58 C 6 48 13 40 23 38 C 25 22 38 12 53 12 C 67 12 79 21 82 34 C 90 35 94 42 94 50 C 94 60 87 68 77 68 L 77 80 Z',
  },
  {
    id: 'speech-bubble',
    name: 'Burbuja de diálogo',
    category: 'symbols',
    path: 'M 14 14 H 86 C 91 14 94 18 94 24 V 64 C 94 70 91 74 86 74 H 48 L 26 92 L 30 74 H 14 C 9 74 6 70 6 64 V 24 C 6 18 9 14 14 14 Z',
  },
  {
    id: 'badge',
    name: 'Emblema / Badge',
    category: 'symbols',
    path: 'M 50 6 L 62 14 L 78 12 L 84 25 L 94 34 L 92 49 L 98 64 L 88 74 L 86 88 L 71 90 L 61 98 L 50 91 L 39 98 L 29 90 L 14 88 L 12 74 L 2 64 L 8 49 L 6 34 L 16 25 L 22 12 L 38 14 Z',
  },

  // FLECHAS Y LÍNEAS
  {
    id: 'arrow-right',
    name: 'Flecha derecha',
    category: 'arrows',
    path: 'M 6 36 H 54 V 16 L 94 50 L 54 84 V 64 H 6 Z',
  },
  {
    id: 'arrow-double',
    name: 'Flecha doble',
    category: 'arrows',
    path: 'M 6 50 L 28 22 V 38 H 72 V 22 L 94 50 L 72 78 V 62 H 28 V 78 Z',
  },
  {
    id: 'line',
    name: 'Línea recta',
    category: 'arrows',
    path: 'M 4 45 H 96 V 55 H 4 Z',
  },
  {
    id: 'line-arrow',
    name: 'Línea con flecha',
    category: 'arrows',
    path: 'M 6 47 H 68 V 30 L 94 50 L 68 70 V 53 H 6 Z',
  },
];

export function getShapeDefinition(type: ShapeType): ShapeDefinition {
  const found = SHAPE_DEFINITIONS.find((s) => s.id === type);
  return found || SHAPE_DEFINITIONS[0];
}
