import React, { useState } from 'react';
import { Type, Copy, Trash2, Clock, Sparkles } from 'lucide-react';
import { ToastMessage } from '../../types';

interface WordCounterProps {
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

export const WordCounter: React.FC<WordCounterProps> = ({ onShowToast }) => {
  const [text, setText] = useState<string>(
    'PIXORA es la plataforma de diseño online pensada para creadores, diseñadores y marcas que buscan agilidad sin sacrificar calidad visual. Diseña lo que imaginas con libertad absoluta.'
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Reading time (~200 wpm) & speaking time (~130 wpm)
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));
  const speakingTimeMinutes = Math.max(1, Math.ceil(words / 130));

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onShowToast({
      title: 'Texto copiado al portapapeles',
      type: 'success',
    });
  };

  const handleClear = () => {
    setText('');
    onShowToast({
      title: 'Texto limpiado',
      type: 'info',
    });
  };

  const handleUpperCase = () => {
    setText(text.toUpperCase());
  };

  const handleLowerCase = () => {
    setText(text.toLowerCase());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Contador de palabras y caracteres</h3>
          <p className="text-xs text-slate-500">
            Analiza la extensión, tiempo de lectura y métricas de tus textos para carteles, posts y copys.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-100 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-violet-700 block">
            {words}
          </span>
          <span className="text-xs font-bold text-slate-600">Palabras</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 block">
            {charsWithSpaces}
          </span>
          <span className="text-xs font-bold text-slate-600">Caracteres (con espacios)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 block">
            {charsNoSpaces}
          </span>
          <span className="text-xs font-bold text-slate-600">Caracteres (sin espacios)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 block">
            {sentences}
          </span>
          <span className="text-xs font-bold text-slate-600">Oraciones</span>
        </div>
      </div>

      {/* Reading Time Estimation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-600" />
          <span>
            Tiempo de lectura estimado:{' '}
            <strong className="text-slate-900 font-bold">~{readingTimeMinutes} min</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>
            Tiempo de locución oral:{' '}
            <strong className="text-slate-900 font-bold">~{speakingTimeMinutes} min</strong>
          </span>
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe o pega aquí tu texto..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:outline-none transition-all leading-relaxed"
        />

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleUpperCase}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              MAYÚSCULAS
            </button>
            <button
              onClick={handleLowerCase}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              minúsculas
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar texto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
