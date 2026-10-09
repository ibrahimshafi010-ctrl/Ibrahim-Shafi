import React, { useState, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  Download,
  Eye,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  SlidersHorizontal,
  ChevronDown,
  ArrowLeftRight,
  Check,
} from 'lucide-react';
import { CANVAS_PRESETS } from '../../data/templates';
import { CanvasPreset } from '../../types';

interface TopBarProps {
  designName: string;
  onDesignNameChange: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
  onOpenPreview: () => void;
  onDownload: (format: 'png' | 'jpeg') => void;
  onBackToHome: () => void;
  currentPreset?: CanvasPreset;
  onSelectPreset: (preset: CanvasPreset) => void;
  onCustomSize: (width: number, height: number) => void;
  canvasWidth: number;
  canvasHeight: number;
  isExporting: boolean;
  isSaved?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  designName,
  onDesignNameChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  onFitToScreen,
  onOpenPreview,
  onDownload,
  onBackToHome,
  currentPreset,
  onSelectPreset,
  onCustomSize,
  canvasWidth,
  canvasHeight,
  isExporting,
  isSaved = true,
}) => {
  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [presetDropdown, setPresetDropdown] = useState(false);
  const [customW, setCustomW] = useState(canvasWidth);
  const [customH, setCustomH] = useState(canvasHeight);

  useEffect(() => {
    setCustomW(canvasWidth);
    setCustomH(canvasHeight);
  }, [canvasWidth, canvasHeight]);

  const handleSwapCustom = () => {
    const temp = customW;
    setCustomW(customH);
    setCustomH(temp);
  };

  const handleApplyCustom = () => {
    if (customW > 0 && customH > 0) {
      onCustomSize(customW, customH);
      setPresetDropdown(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 relative z-30 select-none">
      {/* Left side: Back button & Title & Preset Picker */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBackToHome}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          title="Volver al inicio"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Design Name Input */}
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={designName}
            onChange={(e) => onDesignNameChange(e.target.value)}
            className="font-bold text-sm text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 border border-transparent rounded-lg px-2.5 py-1 transition-all max-w-[160px] sm:max-w-[220px] truncate"
            title="Haz clic para renombrar el diseño"
          />

          {/* Auto-save badge */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60" title="Guardado automáticamente en este navegador">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Guardado</span>
          </div>

          {/* Size / Preset Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setPresetDropdown(!presetDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <span>{currentPreset?.name || `${canvasWidth}×${canvasHeight}`}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {presetDropdown && (
              <div className="absolute left-0 mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                {/* Custom size section */}
                <div className="px-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tamaño personalizado
                    </span>
                    <button
                      type="button"
                      onClick={handleSwapCustom}
                      className="flex items-center gap-1 text-[10px] text-violet-700 font-bold hover:underline cursor-pointer"
                      title="Intercambiar ancho y alto"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Invertir</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 font-medium">Ancho (px)</label>
                      <input
                        type="number"
                        min="100"
                        max="5000"
                        value={customW}
                        onChange={(e) => setCustomW(Math.max(50, Number(e.target.value)))}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                    <span className="text-slate-400 font-bold pt-3">×</span>
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 font-medium">Alto (px)</label>
                      <input
                        type="number"
                        min="100"
                        max="5000"
                        value={customH}
                        onChange={(e) => setCustomH(Math.max(50, Number(e.target.value)))}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCustom}
                    className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Aplicar tamaño personalizado
                  </button>
                </div>

                <div className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Presets recomendados
                </div>
                <div className="max-h-52 overflow-y-auto py-1">
                  {CANVAS_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPreset(p);
                        setPresetDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-violet-50 ${
                        currentPreset?.id === p.id
                          ? 'bg-violet-50 text-violet-700 font-bold'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{p.name}</span>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {p.width}×{p.height}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-3 ml-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition-colors ${
              canUndo
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
                : 'text-slate-400 cursor-not-allowed'
            }`}
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition-colors ${
              canRedo
                ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95'
                : 'text-slate-400 cursor-not-allowed'
            }`}
            title="Rehacer (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Zoom controls */}
      <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl text-xs font-semibold text-slate-700">
        <button
          onClick={() => onZoomChange(Math.max(0.2, zoom - 0.1))}
          className="p-1 hover:bg-white rounded-md text-slate-600 hover:text-slate-900"
          title="Alejar"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
          className="p-1 hover:bg-white rounded-md text-slate-600 hover:text-slate-900"
          title="Acercar"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onFitToScreen}
          className="p-1 hover:bg-white rounded-md text-slate-600 hover:text-slate-900 ml-1 border-l border-slate-200 pl-1.5"
          title="Ajustar a la pantalla"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right side: Preview & Download */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          title="Vista previa del diseño"
        >
          <Eye className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Vista previa</span>
        </button>

        {/* Download Button + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDownloadDropdown(!downloadDropdown)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-violet-500/25 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Descargando...' : 'Descargar'}</span>
            <ChevronDown className="w-3 h-3 text-violet-200" />
          </button>

          {downloadDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onDownload('png');
                  setDownloadDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs hover:bg-violet-50 flex items-center justify-between text-slate-800"
              >
                <div>
                  <span className="font-bold block">Descargar PNG</span>
                  <span className="text-[10px] text-slate-600">Recomendado para web y redes</span>
                </div>
              </button>
              <button
                onClick={() => {
                  onDownload('jpeg');
                  setDownloadDropdown(false);
                }}
                className="w-full px-3.5 py-2 text-left text-xs hover:bg-violet-50 flex items-center justify-between text-slate-800 border-t border-slate-100"
              >
                <div>
                  <span className="font-bold block">Descargar JPG</span>
                  <span className="text-[10px] text-slate-600">Archivo más ligero</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
