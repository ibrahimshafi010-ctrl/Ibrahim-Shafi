import React, { useState } from 'react';
import { Sparkles, Move, Type, Palette, Download, MousePointer } from 'lucide-react';

interface InteractiveHeroDemoProps {
  onOpenEditor: () => void;
}

export const InteractiveHeroDemo: React.FC<InteractiveHeroDemoProps> = ({ onOpenEditor }) => {
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [headline, setHeadline] = useState('LANZAMIENTO 2026');
  const [selectedElement, setSelectedElement] = useState<'title' | 'box' | 'badge' | null>('title');

  const colorOptions = [
    { label: 'Violeta Pixora', value: '#8b5cf6' },
    { label: 'Esmeralda Tech', value: '#10b981' },
    { label: 'Azul Electric', value: '#3b82f6' },
    { label: 'Coral Vivo', value: '#f43f5e' },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Decorative background glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 transition duration-1000 group-hover:opacity-40 animate-pulse" />

      {/* Editor Mockup Window Container */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-violet-500/10">
        {/* Top Window Bar */}
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-medium text-slate-400 font-mono hidden sm:inline">
              pixora_canvas_1080x1080
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-800 text-violet-300 font-medium px-2 py-0.5 rounded-full border border-violet-500/20">
              100% Zoom
            </span>
            <button
              onClick={onOpenEditor}
              className="flex items-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white px-2.5 py-1 rounded-lg transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Abrir editor</span>
            </button>
          </div>
        </div>

        {/* Mini Editor Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 mr-2 text-[11px] uppercase tracking-wider">
              Color clave:
            </span>
            <div className="flex items-center gap-1.5">
              {colorOptions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAccentColor(c.value)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    accentColor === c.value ? 'scale-110 border-slate-900 shadow-xs' : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <MousePointer className="w-3.5 h-3.5 text-violet-600" />
            <span>Haz clic en un elemento</span>
          </div>
        </div>

        {/* Interactive Canvas Area */}
        <div className="p-6 bg-slate-100 flex items-center justify-center min-h-[360px] sm:min-h-[400px]">
          <div
            className="w-full max-w-[340px] aspect-square rounded-2xl bg-white shadow-lg relative p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 select-none border border-slate-200"
            style={{
              background: `radial-gradient(circle at 90% 10%, ${accentColor}18 0%, #ffffff 70%)`,
            }}
          >
            {/* Background geometric accents */}
            <div
              className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-40 transition-colors duration-500 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            {/* Top Interactive Badge */}
            <div
              onClick={() => setSelectedElement('badge')}
              className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all duration-200 ${
                selectedElement === 'badge'
                  ? 'ring-2 ring-violet-500 ring-offset-2 scale-105 shadow-md'
                  : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>PIXORA STUDIO</span>
            </div>

            {/* Central Interactive Typography */}
            <div
              onClick={() => setSelectedElement('title')}
              className={`my-auto p-3 rounded-xl transition-all cursor-pointer relative group ${
                selectedElement === 'title'
                  ? 'border border-dashed border-violet-600 bg-violet-50/50 shadow-xs'
                  : 'hover:bg-slate-50'
              }`}
            >
              {selectedElement === 'title' && (
                <div className="absolute -top-2.5 left-2 bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Move className="w-2.5 h-2.5" />
                  <span>Elemento de Texto</span>
                </div>
              )}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                Diseñado en vivo con interfaz fluida y exportación ultra nítida.
              </p>
            </div>

            {/* Bottom Card Element */}
            <div
              onClick={() => setSelectedElement('box')}
              className={`rounded-xl p-3 flex items-center justify-between text-white cursor-pointer transition-all duration-200 ${
                selectedElement === 'box'
                  ? 'ring-2 ring-violet-500 ring-offset-2 scale-[1.02] shadow-md'
                  : 'hover:opacity-95'
              }`}
              style={{ backgroundColor: accentColor }}
            >
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-white/90" />
                <span className="text-xs font-bold tracking-wide">Comienza a crear gratis</span>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                →
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Quick Bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setHeadline(
                  headline === 'LANZAMIENTO 2026'
                    ? 'DISEÑA TU HISTORIA'
                    : headline === 'DISEÑA TU HISTORIA'
                    ? 'ARTE & GEOMETRÍA'
                    : 'LANZAMIENTO 2026'
                )
              }
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
            >
              <Type className="w-3 h-3 text-violet-600" />
              <span>Cambiar texto demo</span>
            </button>

            <button
              onClick={() =>
                setAccentColor(colorOptions[(colorOptions.findIndex(c => c.value === accentColor) + 1) % colorOptions.length].value)
              }
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
            >
              <Palette className="w-3 h-3 text-violet-600" />
              <span>Girar paleta</span>
            </button>
          </div>

          <button
            onClick={onOpenEditor}
            className="text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
          >
            Abrir en Editor Completo →
          </button>
        </div>
      </div>
    </div>
  );
};
