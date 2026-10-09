import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Smartphone, Monitor, Eye, Sparkles } from 'lucide-react';
import { CanvasElement } from '../../types';
import { renderDesignToCanvas } from '../../utils/canvasRenderer';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
  designName: string;
  onDownload: (format: 'png' | 'jpeg') => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  width,
  height,
  backgroundColor,
  elements,
  designName,
  onDownload,
}) => {
  const [deviceMockup, setDeviceMockup] = useState<'none' | 'phone' | 'screen'>('none');
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    renderDesignToCanvas(width, height, backgroundColor, elements)
      .then((canvas) => {
        if (isMounted) {
          setPreviewDataUrl(canvas.toDataURL('image/png'));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error generating preview', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, width, height, backgroundColor, elements]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">{designName}</h3>
              <p className="text-xs text-slate-400">
                Resolución: {width} × {height} px
              </p>
            </div>
          </div>

          {/* Device Mockup Toggle */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setDeviceMockup('none')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                deviceMockup === 'none' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Directo
            </button>
            <button
              onClick={() => setDeviceMockup('phone')}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceMockup === 'phone' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista previa en smartphone"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMockup('screen')}
              className={`p-1.5 rounded-lg transition-colors ${
                deviceMockup === 'screen' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista previa en pantalla"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview viewport */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/60 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium">Renderizando diseño...</span>
            </div>
          ) : (
            <div className="transition-all duration-300">
              {deviceMockup === 'none' && (
                <div className="max-w-md max-h-[500px] overflow-hidden rounded-xl shadow-2xl border border-slate-700">
                  <img
                    src={previewDataUrl}
                    alt={designName}
                    className="max-h-[500px] w-auto object-contain"
                  />
                </div>
              )}

              {deviceMockup === 'phone' && (
                <div className="w-[280px] h-[560px] bg-slate-800 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col justify-between">
                  {/* Phone notch */}
                  <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-2" />
                  <div className="flex-1 rounded-[32px] overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={previewDataUrl}
                      alt={designName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Phone home indicator */}
                  <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
                </div>
              )}

              {deviceMockup === 'screen' && (
                <div className="w-[520px] max-w-full bg-slate-800 rounded-2xl p-2.5 shadow-2xl border border-slate-700">
                  <div className="flex items-center gap-1.5 pb-2 px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={previewDataUrl}
                      alt={designName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900">
          <span className="text-xs text-slate-400">
            Exportación nítida a 72-300 DPI sin marcas de agua.
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownload('jpeg')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Descargar JPG
            </button>
            <button
              onClick={() => onDownload('png')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
