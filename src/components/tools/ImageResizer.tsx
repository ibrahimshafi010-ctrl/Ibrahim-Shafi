import React, { useState, useRef } from 'react';
import { Upload, Download, Lock, Unlock, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ImageResizerProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({ onShowToast }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [newWidth, setNewWidth] = useState<number>(0);
  const [newHeight, setNewHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>('imagen');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setOrigWidth(img.naturalWidth);
        setOrigHeight(img.naturalHeight);
        setNewWidth(img.naturalWidth);
        setNewHeight(img.naturalHeight);
        onShowToast({ title: 'Imagen cargada correctamente', type: 'success' });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    const w = Math.max(1, val);
    setNewWidth(w);
    if (lockAspect && origWidth > 0) {
      const ratio = origHeight / origWidth;
      setNewHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const h = Math.max(1, val);
    setNewHeight(h);
    if (lockAspect && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setNewWidth(Math.round(h * ratio));
    }
  };

  const handleReset = () => {
    setNewWidth(origWidth);
    setNewHeight(origHeight);
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const link = document.createElement('a');
      link.download = `${fileName}_${newWidth}x${newHeight}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onShowToast({
        title: 'Imagen redimensionada descargada',
        message: `${newWidth} × ${newHeight} px`,
        type: 'success',
      });
    };
    img.src = imageSrc;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Redimensionar imagen</h3>
          <p className="text-xs text-slate-500">
            Modifica la anchura y altura con o sin restricción de proporciones.
          </p>
        </div>
        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Cambiar imagen
          </button>
        )}
      </div>

      {!imageSrc ? (
        <div className="p-8 border-2 border-dashed border-violet-200 rounded-2xl bg-violet-50/30 text-center hover:bg-violet-50/60 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="resize-file-upload"
          />
          <label htmlFor="resize-file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-3 shadow-md shadow-violet-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Selecciona una imagen desde tu equipo
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Soporta PNG, JPEG, WebP y GIF
            </span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Preview Box */}
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200">
            <img
              src={imageSrc}
              alt="Vista previa"
              className="max-w-full max-h-full object-contain rounded shadow-xs"
            />
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex justify-between">
              <span className="text-slate-500 font-medium">Dimensiones originales:</span>
              <span className="font-mono font-bold text-slate-800">
                {origWidth} × {origHeight} px
              </span>
            </div>

            {/* Inputs */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ancho (px)
                </label>
                <input
                  type="number"
                  value={newWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`mt-5 p-2.5 rounded-xl border transition-colors ${
                  lockAspect
                    ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
                title={lockAspect ? 'Proporción bloqueada' : 'Proporción libre'}
              >
                {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>

              <div className="flex-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alto (px)
                </label>
                <input
                  type="number"
                  value={newHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick preset percentage buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Rápido:</span>
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    const factor = pct / 100;
                    setNewWidth(Math.round(origWidth * factor));
                    setNewHeight(Math.round(origHeight * factor));
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                >
                  {pct}%
                </button>
              ))}
              <button
                onClick={handleReset}
                className="p-1 text-slate-400 hover:text-slate-700 ml-auto"
                title="Restablecer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar imagen redimensionada</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
