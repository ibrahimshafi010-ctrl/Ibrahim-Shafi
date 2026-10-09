import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Download,
  Palette,
  Layers,
  Wrench,
  Smartphone,
  Youtube,
  Monitor,
  FileText,
  Instagram,
  QrCode,
  Sliders,
  FileDown,
} from 'lucide-react';
import { ViewMode, DesignTemplate } from '../../types';
import { CANVAS_PRESETS, TEMPLATES } from '../../data/templates';
import { InteractiveHeroDemo } from './InteractiveHeroDemo';

interface HomeViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenEditorWithTemplate: (template: DesignTemplate) => void;
  onOpenEditorWithPreset: (presetId: string) => void;
  onNewDesign: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenEditorWithTemplate,
  onOpenEditorWithPreset,
  onNewDesign,
}) => {
  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-violet-500" />;
      case 'Youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-blue-500" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-emerald-500" />;
      default:
        return <Layers className="w-5 h-5 text-violet-500" />;
    }
  };

  const featuredTemplates = TEMPLATES.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-violet-50/60 via-white to-slate-50">
        {/* Subtle background radial grids */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 border border-violet-200 text-violet-800 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>NUEVA VERSIÓN 1.0 • DISEÑO SIN COMPLICACIONES</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Diseña lo que <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">imaginas.</span>
              </h1>

              {/* Text Description */}
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Una herramienta sencilla para crear diseños, posts, miniaturas, carteles y mucho más.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onNewDesign}
                  className="w-full sm:w-auto px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>Crear mi diseño</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('templates')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-base font-semibold border border-slate-200 shadow-xs hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4 text-violet-600" />
                  <span>Ver plantillas</span>
                </button>
              </div>

              {/* Small advantages requested */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gratis para empezar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600 shrink-0" />
                  <span>Diseños fáciles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Descarga tus diseños</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Editor Representation */}
            <div className="lg:col-span-6">
              <InteractiveHeroDemo onOpenEditor={onNewDesign} />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK PRESETS STRIP */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                ¿Qué deseas crear hoy?
              </h2>
              <p className="text-sm text-slate-500">
                Elige un lienzo con las medidas exactas optimizadas para cada plataforma.
              </p>
            </div>
            <button
              onClick={() => onNavigate('templates')}
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>Explorar todos los formatos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CANVAS_PRESETS.slice(0, 6).map((preset) => (
              <button
                key={preset.id}
                onClick={() => onOpenEditorWithPreset(preset.id)}
                className="group flex flex-col p-4 rounded-xl bg-slate-50 hover:bg-violet-50/50 border border-slate-200/80 hover:border-violet-300 text-left transition-all duration-200 shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {getPresetIcon(preset.icon)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-1">
                  {preset.name}
                </h3>
                <span className="text-xs text-slate-500 mt-0.5">
                  {preset.width} × {preset.height} px
                </span>
                <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Crear en blanco →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TEMPLATES SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                Inspiración instantánea
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Plantillas listas para personalizar
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Selecciona una plantilla editable y adáptala a tu marca en segundos.
              </p>
            </div>
            <button
              onClick={() => onNavigate('templates')}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-violet-400 text-slate-800 hover:text-violet-600 text-sm font-bold shadow-xs transition-colors self-start md:self-auto"
            >
              Ver todas las plantillas ({TEMPLATES.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-violet-300 transition-all duration-300 flex flex-col"
              >
                {/* Visual Preview Box */}
                <div
                  className="aspect-square w-full p-6 flex flex-col justify-between relative overflow-hidden select-none cursor-pointer"
                  style={{ backgroundColor: template.backgroundColor }}
                  onClick={() => onOpenEditorWithTemplate(template)}
                >
                  {/* Subtle inner grid effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  {/* Header badge */}
                  <div className="relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      {template.categoryLabel}
                    </span>
                  </div>

                  {/* Representative text preview */}
                  <div className="relative z-10 my-auto text-left">
                    <p className="text-white text-lg font-extrabold leading-tight line-clamp-3 drop-shadow-sm">
                      {template.title}
                    </p>
                    <p className="text-white/70 text-xs mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Hover action banner */}
                  <div className="relative z-10 pt-2 flex items-center justify-between text-white/90 text-xs">
                    <span className="font-mono text-[11px]">
                      {template.width}×{template.height}
                    </span>
                    <span className="font-bold underline underline-offset-2 group-hover:text-violet-300 transition-colors">
                      Editar plantilla →
                    </span>
                  </div>
                </div>

                {/* Card info */}
                <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {template.categoryLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenEditorWithTemplate(template)}
                    className="px-3 py-1.5 rounded-lg bg-violet-50 group-hover:bg-violet-600 text-violet-700 group-hover:text-white text-xs font-bold transition-all duration-200 shrink-0"
                  >
                    Usar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS HIGHLIGHT */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
              Suite de utilidades
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Herramientas rápidas para tus imágenes
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Optimiza, redimensiona, genera códigos QR y crea paletas cromáticas sin salir de PIXORA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Redimensionar y Comprimir
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Ajusta las dimensiones de cualquier foto o reduce su peso sin perder nitidez visual.
              </p>
              <button
                onClick={() => onNavigate('tools')}
                className="mt-4 text-xs font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1"
              >
                <span>Probar herramientas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Generador de Códigos QR
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Crea códigos QR personalizados para enlaces o textos con tus colores favoritos y descarga en PNG.
              </p>
              <button
                onClick={() => onNavigate('tools')}
                className="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Crear código QR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Paletas Armónicas & Contraste
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Descubre combinaciones de colores vibrantes y verifica el ratio de contraste para accesibilidad.
              </p>
              <button
                onClick={() => onNavigate('tools')}
                className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Explorar paletas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 bg-gradient-to-tr from-slate-950 via-slate-900 to-violet-950 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Listo para empezar en tu navegador</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Comienza a diseñar tu próximo proyecto hoy
          </h2>

          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Sin registro obligatorio, sin marcas de agua intrusivas y con exportación directa en alta resolución.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNewDesign}
              className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-base font-bold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all flex items-center gap-2 group active:scale-95"
            >
              <span>Abrir editor de PIXORA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
