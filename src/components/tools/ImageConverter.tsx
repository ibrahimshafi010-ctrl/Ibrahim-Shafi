import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileCode, Check } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ImageConverterProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

type Format = 'png' | 'jpeg' | 'webp';

export const ImageConverter: React.FC<ImageConverterProps> = ({ onShowToast }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('imagen');
  const [targetFormat, setTargetFormat] = useState<Format>('webp');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target?.result as string);
      onShowToast({ title: 'Imagen lista para convertir', type: 'info' });
    };
    reader.readAsDataURL(file);
  };

  const handleConvertAndDownload = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mimeType =
        targetFormat === 'webp'
          ? 'image/webp'
          : targetFormat === 'jpeg'
          ? 'image/jpeg'
          : 'image/png';

      const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
      const dataUrl = canvas.toDataURL(mimeType, 0.92);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${originalName}_convertido.${extension}`;
      link.click();

      onShowToast({
        title: 'Imagen convertida con éxito',
        message: `Formato exportado: .${extension.toUpperCase()}`,
        type: 'success',
      });
    };
    img.src = imageSrc;
  };

  const formats: { id: Format; label: string; desc: string }[] = [
    { id: 'webp', label: 'WEBP', desc: 'Formato moderno para web con máxima compresión y transparencia.' },
    { id: 'png', label: 'PNG', desc: 'Ideal para gráficos, logos y diseños con fondo transparente.' },
    { id: 'jpeg', label: 'JPG / JPEG', desc: 'Estándar universal perfecto para fotografías y redes.' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Convertir imagen</h3>
          <p className="text-xs text-slate-500">
            Cambia el formato de tus archivos entre PNG, JPG y WebP de forma instantánea.
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
            id="convert-file-upload"
          />
          <label htmlFor="convert-file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-3 shadow-md shadow-violet-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-800">
              Selecciona una imagen para convertir
            </span>
            <span className="text-xs text-slate-500 mt-1">
              Conversión sin pérdida de resolución
            </span>
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200">
            <img
              src={imageSrc}
              alt="Vista previa"
              className="max-w-full max-h-full object-contain rounded shadow-xs"
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-3">
                Selecciona el formato de salida deseado:
              </label>
              <div className="space-y-2.5">
                {formats.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setTargetFormat(fmt.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      targetFormat === fmt.id
                        ? 'border-violet-600 bg-violet-50/60 ring-2 ring-violet-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 block">
                        {fmt.label}
                      </span>
                      <span className="text-xs text-slate-500">{fmt.desc}</span>
                    </div>
                    {targetFormat === fmt.id && (
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConvertAndDownload}
              className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Convertir y descargar en {targetFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
