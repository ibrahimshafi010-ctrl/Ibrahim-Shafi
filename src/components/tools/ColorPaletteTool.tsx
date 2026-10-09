import React, { useState } from 'react';
import { Palette, Copy, RefreshCw, Check, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ColorPaletteToolProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

interface PalettePreset {
  name: string;
  colors: string[];
}

export const ColorPaletteTool: React.FC<ColorPaletteToolProps> = ({ onShowToast }) => {
  const defaultPalettes: PalettePreset[] = [
    {
      name: 'Pixora Modern Violet',
      colors: ['#0f172a', '#3b0764', '#7c3aed', '#a78bfa', '#f8fafc'],
    },
    {
      name: 'Cyber Neon Tech',
      colors: ['#09090b', '#0369a1', '#06b6d4', '#67e8f9', '#ffffff'],
    },
    {
      name: 'Sunset Minimal',
      colors: ['#1e1b4b', '#e11d48', '#f97316', '#fbbf24', '#fffbeb'],
    },
    {
      name: 'Forest Editorial',
      colors: ['#064e3b', '#047857', '#10b981', '#a7f3d0', '#f0fdf4'],
    },
    {
      name: 'Elegancia Neutra',
      colors: ['#18181b', '#3f3f46', '#71717a', '#d4d4d8', '#fafafa'],
    },
    {
      name: 'Candy Dream Pop',
      colors: ['#4c1d95', '#db2777', '#f43f5e', '#fb7185', '#fff1f2'],
    },
  ];

  const [activePaletteIndex, setActivePaletteIndex] = useState(0);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Contrast tester state
  const [testTextColor, setTestTextColor] = useState('#ffffff');
  const [testBgColor, setTestBgColor] = useState('#7c3aed');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
    onShowToast({
      title: 'Color copiado al portapapeles',
      message: hex.toUpperCase(),
      type: 'success',
    });
  };

  // Calculate luminance & contrast
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (hex1: string, hex2: string) => {
    try {
      const [r1, g1, b1] = hexToRgb(hex1);
      const [r2, g2, b2] = hexToRgb(hex2);
      const l1 = getLuminance(r1, g1, b1);
      const l2 = getLuminance(r2, g2, b2);
      const brighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (brighter + 0.05) / (darker + 0.05);
    } catch {
      return 1;
    }
  };

  const ratio = getContrastRatio(testTextColor, testBgColor);
  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7.0;

  const currentColors = defaultPalettes[activePaletteIndex].colors;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Crear colores y paletas</h3>
          <p className="text-xs text-slate-500">
            Genera combinaciones cromáticas profesionales y comprueba la legibilidad de tus textos.
          </p>
        </div>
        <button
          onClick={() =>
            setActivePaletteIndex((prev) => (prev + 1) % defaultPalettes.length)
          }
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Siguiente paleta</span>
        </button>
      </div>

      {/* Palette Showcase */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Paleta activa: {defaultPalettes[activePaletteIndex].name}
          </span>
          <span className="text-xs text-slate-400">
            Haz clic en cualquier muestra para copiar su código HEX
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {currentColors.map((color, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(color)}
              className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-200 text-left bg-white"
            >
              <div
                className="h-28 w-full flex items-center justify-center relative transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: color }}
              >
                {copiedHex === color ? (
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white rounded-md text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado</span>
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-black/60 text-white rounded-md text-[11px] font-semibold flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </span>
                )}
              </div>
              <div className="p-3 bg-white">
                <span className="font-mono text-xs font-bold text-slate-800 uppercase block">
                  {color}
                </span>
                <span className="text-[10px] text-slate-400">
                  {i === 0 ? 'Fondo base' : i === 2 ? 'Acento' : `Tono ${i + 1}`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contrast Checker Tool */}
      <div className="pt-6 border-t border-slate-200">
        <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span>Comprobador de Contraste y Accesibilidad (WCAG)</span>
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Asegúrate de que tus títulos y textos en posts o miniaturas sean legibles para todos los usuarios.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">Color del Texto</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={testTextColor}
                    onChange={(e) => setTestTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={testTextColor}
                    onChange={(e) => setTestTextColor(e.target.value)}
                    className="w-24 font-mono text-xs font-bold uppercase bg-white border border-slate-200 px-2 py-1 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">Color de Fondo</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={testBgColor}
                    onChange={(e) => setTestBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={testBgColor}
                    onChange={(e) => setTestBgColor(e.target.value)}
                    className="w-24 font-mono text-xs font-bold uppercase bg-white border border-slate-200 px-2 py-1 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Score Badges */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex-1">
                <span className="text-xs text-slate-500 block">Ratio de contraste:</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {ratio.toFixed(2)}:1
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    passesAA
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {passesAA ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Nivel AA</span>
                </div>

                <div
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    passesAAA
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {passesAAA ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>Nivel AAA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Preview Box */}
          <div
            className="md:col-span-6 p-6 rounded-2xl shadow-inner border border-slate-200 flex flex-col justify-center min-h-[140px] transition-colors"
            style={{ backgroundColor: testBgColor }}
          >
            <h5
              className="text-lg font-extrabold mb-1 transition-colors"
              style={{ color: testTextColor }}
            >
              Diseña lo que imaginas en PIXORA
            </h5>
            <p
              className="text-xs font-medium transition-colors"
              style={{ color: testTextColor }}
            >
              Este texto de ejemplo demuestra la legibilidad en vivo con la combinación seleccionada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
