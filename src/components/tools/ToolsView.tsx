import React, { useState } from 'react';
import {
  Wrench,
  Maximize2,
  Sliders,
  RefreshCw,
  QrCode,
  Palette,
  Type,
  ArrowRight,
} from 'lucide-react';
import { ToolType, ToastMessage } from '../../types';
import { ImageResizer } from './ImageResizer';
import { ImageCompressor } from './ImageCompressor';
import { ImageConverter } from './ImageConverter';
import { QrGenerator } from './QrGenerator';
import { ColorPaletteTool } from './ColorPaletteTool';
import { WordCounter } from './WordCounter';

interface ToolsViewProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
  defaultTool?: ToolType;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  onShowToast,
  defaultTool = 'resize',
}) => {
  const [activeTool, setActiveTool] = useState<ToolType>(defaultTool);

  const toolsList = [
    {
      id: 'resize' as ToolType,
      title: 'Redimensionar imagen',
      description: 'Cambia el ancho y alto en píxeles manteniendo proporciones.',
      icon: Maximize2,
      badge: 'Pixel Perfect',
      color: 'text-violet-600 bg-violet-100',
    },
    {
      id: 'compress' as ToolType,
      title: 'Comprimir imagen',
      description: 'Reduce el peso de tus fotos sin pérdida de calidad apreciable.',
      icon: Sliders,
      badge: 'Hasta -75%',
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      id: 'convert' as ToolType,
      title: 'Convertir imagen',
      description: 'Convierte archivos entre PNG, JPG y WebP al instante.',
      icon: RefreshCw,
      badge: 'Ultra rápido',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      id: 'qr' as ToolType,
      title: 'Generador de códigos QR',
      description: 'Crea códigos QR personalizados para URLs y redes sociales.',
      icon: QrCode,
      badge: 'Descarga PNG',
      color: 'text-indigo-600 bg-indigo-100',
    },
    {
      id: 'palette' as ToolType,
      title: 'Crear colores y paletas',
      description: 'Explora paletas armónicas y comprueba accesibilidad WCAG.',
      icon: Palette,
      badge: 'Contraste AA/AAA',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      id: 'wordcount' as ToolType,
      title: 'Contador de palabras',
      description: 'Calcula caracteres, oraciones y tiempo de lectura de tus copys.',
      icon: Type,
      badge: 'Métricas en vivo',
      color: 'text-rose-600 bg-rose-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>CAJA DE HERRAMIENTAS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Herramientas para creadores
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Utilidades rápidas y 100% funcionales para preparar recursos visuales y contenido.
          </p>
        </div>

        {/* Tools Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-violet-600 shadow-md ring-2 ring-violet-500/20'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${tool.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1">
                    {tool.title}
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-2 block">
                  {tool.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tool Dynamic Container */}
        <div className="pt-2">
          {activeTool === 'resize' && <ImageResizer onShowToast={onShowToast} />}
          {activeTool === 'compress' && <ImageCompressor onShowToast={onShowToast} />}
          {activeTool === 'convert' && <ImageConverter onShowToast={onShowToast} />}
          {activeTool === 'qr' && <QrGenerator onShowToast={onShowToast} />}
          {activeTool === 'palette' && <ColorPaletteTool onShowToast={onShowToast} />}
          {activeTool === 'wordcount' && <WordCounter onShowToast={onShowToast} />}
        </div>
      </div>
    </div>
  );
};
