import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Sparkles, Link, Type, Palette } from 'lucide-react';
import { ToastMessage } from '../../types';

interface QrGeneratorProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const QrGenerator: React.FC<QrGeneratorProps> = ({ onShowToast }) => {
  const [content, setContent] = useState<string>('https://pixora.design');
  const [darkColor, setDarkColor] = useState<string>('#0f172a');
  const [lightColor, setLightColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<number>(300);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!content.trim()) return;

    QRCode.toDataURL(content, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [content, darkColor, lightColor, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `codigo_qr_pixora_${size}x${size}.png`;
    link.click();
    onShowToast({
      title: 'Código QR descargado',
      message: 'Listo para imprimir o insertar en tus diseños',
      type: 'success',
    });
  };

  const colorPresets = [
    { name: 'Pixora Violet', dark: '#7c3aed', light: '#ffffff' },
    { name: 'Negro Clásico', dark: '#000000', light: '#ffffff' },
    { name: 'Azul Marino', dark: '#0f172a', light: '#f8fafc' },
    { name: 'Esmeralda Tech', dark: '#047857', light: '#ffffff' },
    { name: 'Rosa Magenta', dark: '#db2777', light: '#ffffff' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">Generador de Códigos QR</h3>
        <p className="text-xs text-slate-500">
          Crea códigos QR nítidos para enlaces web, redes sociales, cartas digitales o texto libre.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Inputs & Controls */}
        <div className="md:col-span-7 space-y-5">
          {/* Content input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-violet-600" />
              <span>Contenido o Enlace URL</span>
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="https://tupagina.com o cualquier texto"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Estilos de color recomendados
            </span>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setDarkColor(preset.dark);
                    setLightColor(preset.light);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-violet-400 flex items-center gap-2 transition-all bg-white"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: preset.dark }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Color del código</span>
                <span className="text-[10px] text-slate-500 font-mono">{darkColor}</span>
              </div>
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Color de fondo</span>
                <span className="text-[10px] text-slate-500 font-mono">{lightColor}</span>
              </div>
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>
          </div>

          {/* Resolution / Size */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Resolución de descarga</span>
              <span className="font-mono text-violet-600">{size} × {size} px</span>
            </div>
            <input
              type="range"
              min="180"
              max="600"
              step="20"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right QR Preview Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200 mb-4 inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Código QR"
                className="w-48 h-48 object-contain rounded"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-300">
                <QrCode className="w-12 h-12" />
              </div>
            )}
          </div>

          <button
            onClick={handleDownload}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-md shadow-violet-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Código QR (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
