import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { ViewMode } from '../types';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">PIXORA</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Plataforma de diseño online moderna, ágil y visual. Diseña lo que imaginas sin complicaciones técnicas.
            </p>
          </div>

          {/* Col 2: Explorar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('templates')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Biblioteca de plantillas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('editor')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Editor de diseño
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Planes y precios
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Herramientas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Herramientas
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Redimensionar imagen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Comprimir imagen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Generador de códigos QR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-violet-600 transition-colors"
                >
                  Paleta de colores & WCAG
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Formatos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Formatos populares
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Instagram 1080×1080</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Story 1080×1920</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">YouTube 1280×720</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Wallpaper 1920×1080</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md">Cartel 1080×1350</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PIXORA. Diseñado con elegancia y simplicidad.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para creadores visuales</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
