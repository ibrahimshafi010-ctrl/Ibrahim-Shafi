import React, { useState } from 'react';
import {
  Layers,
  Search,
  Sparkles,
  ArrowRight,
  Maximize2,
  Filter,
} from 'lucide-react';
import { DesignTemplate } from '../../types';
import { TEMPLATES } from '../../data/templates';

interface TemplatesViewProps {
  onSelectTemplate: (template: DesignTemplate) => void;
  onNewBlank: (presetId?: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
  onNewBlank,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Todas las plantillas' },
    { id: 'instagram', label: 'Post Instagram' },
    { id: 'youtube', label: 'Miniatura YouTube' },
    { id: 'poster', label: 'Cartel' },
    { id: 'wallpaper', label: 'Wallpaper' },
    { id: 'story', label: 'Historia' },
    { id: 'presentation', label: 'Presentación' },
    { id: 'banner', label: 'Banner' },
    { id: 'square', label: 'Publicación cuadrada' },
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesQuery =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>BIBLIOTECA CREATIVA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Plantillas de diseño
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Comienza con una composición profesional y adáptala a tu propio estilo.
            </p>
          </div>

          <button
            onClick={() => onNewBlank()}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 self-start md:self-auto active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Crear lienzo en blanco</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar plantilla o formato..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No se encontraron plantillas
            </h3>
            <p className="text-xs text-slate-500">
              Prueba con otro término de búsqueda o selecciona otra categoría.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-violet-600 hover:underline"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-violet-300 transition-all duration-300 flex flex-col"
              >
                {/* Visual Preview Box */}
                <div
                  className="aspect-square w-full p-6 flex flex-col justify-between relative overflow-hidden select-none cursor-pointer"
                  style={{ backgroundColor: template.backgroundColor }}
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  {/* Header badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      {template.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-white/80">
                      {template.width}×{template.height}
                    </span>
                  </div>

                  {/* Representative text preview */}
                  <div className="relative z-10 my-auto text-left">
                    <p className="text-white text-lg font-extrabold leading-tight line-clamp-3 drop-shadow-sm">
                      {template.title}
                    </p>
                    <p className="text-white/70 text-xs mt-1.5 line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Action banner overlay on hover */}
                  <div className="relative z-10 pt-2 flex items-center justify-between text-white/90 text-xs">
                    <span className="text-[11px] font-medium text-white/80">
                      {template.aspectRatio}
                    </span>
                    <span className="font-bold underline underline-offset-2 group-hover:text-violet-300 transition-colors flex items-center gap-1">
                      <span>Usar plantilla</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card bottom info & direct use button */}
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {template.categoryLabel}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs transition-all duration-200 shrink-0 flex items-center gap-1 active:scale-95"
                  >
                    <span>Editar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
