import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ImageCompressorProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({ onShowToast }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(0.75);
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('imagen');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      onShowToast({ title: 'Imagen lista para comprimir', type: 'info' });
    };
    reader.readAsDataURL(file);
  };

  // Re-compress when image or quality changes
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            if (compressedBlobUrl) URL.revokeObjectURL(compressedBlobUrl);
            setCompressedBlobUrl(URL.createObjectURL(blob));
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.src = imageSrc;
  }, [imageSrc, quality]);

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  const handleDownload = () => {
    if (!compressedBlobUrl) return;
    const link = document.createElement('a');
    link.href = compressedBlobUrl;
    link.download = `${fileName}_optimizado.jpg`;
    link.click();
    onShowToast({
      title: 'Imagen comprimida descargada',
      message: `Ahorro del ${savingsPercent}% (${formatSize(compressedSize)})`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Comprimir imagen</h3>
          <p className="text-xs text-slate-500">
            Reduce el peso en kilobytes de tus fotografías para una carga web ultra rápida.
          </p>
        </div>
        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null);
              setCompressedBlobUrl(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Subir otra
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
            id="compress-file-upload"
          />
          <label htmlFor="compress-file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-3 shadow-md shadow-violet-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Selecciona una imagen para comprimir
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Optimización en el cliente sin subir tus fotos a ningún servidor
            </span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Comparison Cards */}
          <div className="space-y-4">
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-200 relative">
              <img
                src={compressedBlobUrl || imageSrc}
                alt="Vista previa comprimida"
                className="max-w-full max-h-full object-contain rounded"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                Vista optimizada
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-medium text-slate-500 block">Tamaño original</span>
                <span className="text-sm font-bold text-slate-700">{formatSize(originalSize)}</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-medium text-emerald-700 block">Tamaño optimizado</span>
                <span className="text-sm font-extrabold text-emerald-800">
                  {formatSize(compressedSize)}
                </span>
              </div>
            </div>

            {savingsPercent > 0 && (
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-emerald-100/60 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>¡Ahorro del {savingsPercent}% en peso de archivo!</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Calidad de compresión</span>
                <span className="text-violet-600 font-mono">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Mayor compresión (menor peso)</span>
                <span>Máxima calidad</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-violet-900 block">💡 Recomendación Pixora:</span>
              <p>
                Una calidad entre 70% y 80% mantiene la calidad visual imperceptible al ojo humano y reduce el peso hasta un 70%.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar imagen comprimida</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
