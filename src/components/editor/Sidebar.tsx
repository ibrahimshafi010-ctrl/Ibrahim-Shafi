import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Star,
  PaintBucket,
  Upload,
  Search,
  Plus,
  Trash2,
  Sparkles,
  Save,
  FolderOpen,
  Hash,
  Check,
  Palette,
  Shapes,
} from 'lucide-react';
import { DesignTemplate, ShapeType, SavedProject } from '../../types';
import { TEMPLATES } from '../../data/templates';
import { SHAPE_DEFINITIONS } from '../../utils/shapeDefinitions';
import { COLOR_FAMILIES, RECENT_KEY } from './PixoraColorPicker';

interface GradientPreset {
  name: string;
  category: 'soft' | 'vibrant' | 'dark';
  css: string;
}

const GRADIENT_PRESETS: GradientPreset[] = [
  // SUAVES / PASTEL
  { name: 'Amanecer Pastel', category: 'soft', css: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { name: 'Brisa Melocotón', category: 'soft', css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { name: 'Lavanda Suave', category: 'soft', css: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { name: 'Menta Fresca', category: 'soft', css: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
  { name: 'Rosa Nube', category: 'soft', css: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)' },
  { name: 'Cielo Claro', category: 'soft', css: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' },
  { name: 'Arena Dorada', category: 'soft', css: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' },
  { name: 'Perla de Plata', category: 'soft', css: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },

  // VIBRANTES / MODERNOS
  { name: 'Violeta Pixora', category: 'vibrant', css: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)' },
  { name: 'Atardecer Fuego', category: 'vibrant', css: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' },
  { name: 'Cyber Neón', category: 'vibrant', css: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
  { name: 'Océano Eléctrico', category: 'vibrant', css: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)' },
  { name: 'Tropical Esmeralda', category: 'vibrant', css: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
  { name: 'Sol Ardiente', category: 'vibrant', css: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
  { name: 'Furia Carmesí', category: 'vibrant', css: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)' },
  { name: 'Púrpura Galáctico', category: 'vibrant', css: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)' },
  { name: 'Fucsia Pop', category: 'vibrant', css: 'linear-gradient(135deg, #d946ef 0%, #6366f1 100%)' },
  { name: 'Mango Sunset', category: 'vibrant', css: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },

  // OSCUROS / ELEGANTES
  { name: 'Medianoche Azul', category: 'dark', css: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { name: 'Espacio Profundo', category: 'dark', css: 'linear-gradient(135deg, #09090b 0%, #27272a 100%)' },
  { name: 'Fibra de Carbono', category: 'dark', css: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)' },
  { name: 'Púrpura Nocturno', category: 'dark', css: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
  { name: 'Zafiro Abisal', category: 'dark', css: 'linear-gradient(135deg, #082f49 0%, #0f172a 100%)' },
  { name: 'Esmeralda Noir', category: 'dark', css: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)' },
  { name: 'Vino Imperial', category: 'dark', css: 'linear-gradient(135deg, #450a0a 0%, #1c1917 100%)' },
  { name: 'Crepúsculo Sombrío', category: 'dark', css: 'linear-gradient(135deg, #2e1065 0%, #0f172a 100%)' },
];

interface SidebarProps {
  activeTab: 'templates' | 'text' | 'images' | 'elements' | 'background';
  onTabChange: (tab: 'templates' | 'text' | 'images' | 'elements' | 'background') => void;
  onSelectTemplate: (template: DesignTemplate) => void;
  onAddText: (type: 'title' | 'subtitle' | 'body' | 'badge') => void;
  onAddShape: (shape: ShapeType) => void;
  onAddImage: (src: string, alt?: string) => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  savedProjects?: SavedProject[];
  onSaveCurrentProject?: () => void;
  onLoadProject?: (project: SavedProject) => void;
  onDeleteProject?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onSelectTemplate,
  onAddText,
  onAddShape,
  onAddImage,
  backgroundColor,
  onBackgroundColorChange,
  savedProjects = [],
  onSaveCurrentProject,
  onLoadProject,
  onDeleteProject,
}) => {
  const [templateSearch, setTemplateSearch] = useState('');
  const [templatesMode, setTemplatesMode] = useState<'templates' | 'my-designs'>('templates');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated stock photos & textures
  const stockImages = [
    {
      src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      label: 'Abstract Violet Flow',
    },
    {
      src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      label: 'Geometric Paint Art',
    },
    {
      src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
      label: 'Dark Modern Gradient',
    },
    {
      src: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      label: 'Minimal Workspace',
    },
    {
      src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      label: 'Aurora Lights',
    },
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      label: 'Tech Silicon Microchip',
    },
  ];

  const solidColors = [
    '#ffffff',
    '#f8fafc',
    '#f1f5f9',
    '#e2e8f0',
    '#0f172a',
    '#09090b',
    '#18181b',
    '#7c3aed',
    '#8b5cf6',
    '#6366f1',
    '#3b82f6',
    '#0ea5e9',
    '#10b981',
    '#14b8a6',
    '#f59e0b',
    '#f97316',
    '#ef4444',
    '#ec4899',
    '#d946ef',
    '#a855f7',
  ];

  // Shape library state
  const [shapeSearch, setShapeSearch] = useState('');
  const [shapeCategory, setShapeCategory] = useState<'all' | 'basic' | 'geometric' | 'arrows' | 'symbols'>('all');

  // Background tab state
  const [bgType, setBgType] = useState<'solid' | 'gradients'>(
    backgroundColor && backgroundColor.includes('gradient') ? 'gradients' : 'solid'
  );
  const [gradientFilter, setGradientFilter] = useState<'all' | 'soft' | 'vibrant' | 'dark'>('all');
  const [bgHexInput, setBgHexInput] = useState(
    backgroundColor.startsWith('#') ? backgroundColor : '#ffffff'
  );
  const [activeBgFamily, setActiveBgFamily] = useState<string>('Morados y Violetas');

  const [recentBgColors, setRecentBgColors] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return ['#ffffff', '#0f172a', '#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ef4444'];
  });

  useEffect(() => {
    if (backgroundColor.startsWith('#')) {
      setBgHexInput(backgroundColor);
    }
  }, [backgroundColor]);

  const handleApplySolidBg = (newColor: string) => {
    onBackgroundColorChange(newColor);
    setBgHexInput(newColor);
    setRecentBgColors((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== newColor.toLowerCase());
      const updated = [newColor, ...filtered].slice(0, 14);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setUploadedImages((prev) => [result, ...prev]);
        onAddImage(result, file.name);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredTemplates = TEMPLATES.filter((tpl) =>
    tpl.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
    tpl.categoryLabel.toLowerCase().includes(templateSearch.toLowerCase())
  );

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none h-[calc(100vh-4rem)]">
      {/* Tab Navigation Icons */}
      <div className="grid grid-cols-5 border-b border-slate-200 bg-slate-50/80 p-1 gap-1">
        <button
          onClick={() => onTabChange('templates')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === 'templates'
              ? 'bg-white text-violet-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Plantillas"
        >
          <Layers className="w-4 h-4 mb-1 text-violet-600" />
          <span>Plantillas</span>
        </button>

        <button
          onClick={() => onTabChange('text')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === 'text'
              ? 'bg-white text-violet-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Texto"
        >
          <Type className="w-4 h-4 mb-1 text-violet-600" />
          <span>Texto</span>
        </button>

        <button
          onClick={() => onTabChange('images')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === 'images'
              ? 'bg-white text-violet-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Imágenes"
        >
          <ImageIcon className="w-4 h-4 mb-1 text-violet-600" />
          <span>Imágenes</span>
        </button>

        <button
          onClick={() => onTabChange('elements')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === 'elements'
              ? 'bg-white text-violet-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Elementos"
        >
          <Square className="w-4 h-4 mb-1 text-violet-600" />
          <span>Formas</span>
        </button>

        <button
          onClick={() => onTabChange('background')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-semibold transition-all ${
            activeTab === 'background'
              ? 'bg-white text-violet-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title="Fondo"
        >
          <PaintBucket className="w-4 h-4 mb-1 text-violet-600" />
          <span>Fondo</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: PLANTILLAS Y MIS DISEÑOS */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Mode Switcher: Plantillas vs Mis Diseños */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setTemplatesMode('templates')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  templatesMode === 'templates'
                    ? 'bg-white text-violet-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Plantillas
              </button>
              <button
                type="button"
                onClick={() => setTemplatesMode('my-designs')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  templatesMode === 'my-designs'
                    ? 'bg-white text-violet-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Mis diseños</span>
                {savedProjects.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-700 font-extrabold">
                    {savedProjects.length}
                  </span>
                )}
              </button>
            </div>

            {templatesMode === 'my-designs' ? (
              <div className="space-y-3">
                {/* Save Current Design Button */}
                <button
                  type="button"
                  onClick={onSaveCurrentProject}
                  className="w-full py-2.5 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-violet-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar diseño actual</span>
                </button>

                {savedProjects.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                    <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Sin diseños guardados</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Guarda tus proyectos para recuperarlos en cualquier momento en este navegador sin necesidad de cuenta.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-violet-400 bg-white transition-all shadow-2xs group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {p.width}×{p.height} px • {p.elements.length} elementos
                            </p>
                          </div>
                          <span
                            className="w-4 h-4 rounded-full border border-slate-200 shrink-0"
                            style={{ backgroundColor: p.backgroundColor }}
                            title={`Fondo: ${p.backgroundColor}`}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(p.updatedAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onLoadProject && onLoadProject(p)}
                              className="px-2 py-1 text-[11px] font-bold text-violet-700 hover:bg-violet-50 rounded-md transition-colors cursor-pointer"
                            >
                              Abrir
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteProject && onDeleteProject(p.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                              title="Eliminar proyecto guardado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Buscar plantillas..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div className="space-y-3">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => onSelectTemplate(template)}
                      className="group p-3 rounded-xl border border-slate-200 hover:border-violet-400 bg-white hover:bg-violet-50/20 cursor-pointer transition-all duration-200 shadow-2xs"
                    >
                      <div
                        className="w-full aspect-video rounded-lg p-2.5 flex flex-col justify-between mb-2 text-white relative overflow-hidden"
                        style={{ backgroundColor: template.backgroundColor }}
                      >
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 w-max backdrop-blur-xs font-bold">
                          {template.categoryLabel}
                        </span>
                        <p className="text-xs font-extrabold truncate">
                          {template.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 truncate">
                          {template.title}
                        </span>
                        <span className="text-[10px] text-violet-600 font-bold group-hover:underline">
                          Cargar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: TEXTO */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Añadir texto al lienzo
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => onAddText('title')}
                  className="w-full p-3.5 text-left rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200 hover:border-violet-300 transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-lg font-extrabold text-slate-900 group-hover:text-violet-700 block">
                      Añadir un título
                    </span>
                    <span className="text-xs text-slate-500">
                      Encabezado principal (64px)
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => onAddText('subtitle')}
                  className="w-full p-3 text-left rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200 hover:border-violet-300 transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-violet-700 block">
                      Añadir un subtítulo
                    </span>
                    <span className="text-xs text-slate-500">
                      Texto secundario (36px)
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => onAddText('body')}
                  className="w-full p-2.5 text-left rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200 hover:border-violet-300 transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-medium text-slate-700 group-hover:text-violet-700 block">
                      Añadir texto de párrafo
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cuerpo de lectura (24px)
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
                </button>

                <button
                  onClick={() => onAddText('badge')}
                  className="w-full p-2.5 text-left rounded-xl bg-violet-50 hover:bg-violet-100/70 border border-violet-200 transition-all group flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-violet-800 block">
                      Etiqueta destacada
                    </span>
                    <span className="text-[11px] text-violet-600">
                      Ideal para promociones y badges
                    </span>
                  </div>
                  <Sparkles className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">
                💡 Consejo: También puedes hacer doble clic en cualquier texto del lienzo para editarlo directamente.
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: IMÁGENES */}
        {activeTab === 'images' && (
          <div className="space-y-5">
            {/* File Upload Trigger */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Subir desde el ordenador
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-file-upload"
              />

              <label
                htmlFor="image-file-upload"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-violet-300 hover:border-violet-500 bg-violet-50/40 hover:bg-violet-50/80 rounded-2xl cursor-pointer transition-all duration-200 text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-violet-700">
                  Haz clic para subir imagen
                </span>
                <span className="text-[10px] text-slate-500 mt-1">
                  PNG, JPG, WebP o SVG
                </span>
              </label>
            </div>

            {/* User Uploads History */}
            {uploadedImages.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">
                  Tus archivos subidos
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((src, index) => (
                    <button
                      key={index}
                      onClick={() => onAddImage(src, `Subida ${index + 1}`)}
                      className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 hover:border-violet-500 transition-all shadow-xs"
                    >
                      <img
                        src={src}
                        alt="Subida"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Curated Stock Library */}
            <div className="pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Fondos y texturas libres
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {stockImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => onAddImage(img.src, img.label)}
                    className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 hover:border-violet-500 transition-all shadow-xs text-left"
                    title={img.label}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 p-1.5 flex flex-col justify-end">
                      <span className="text-[10px] text-white font-medium truncate">
                        {img.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ELEMENTOS / FORMAS */}
        {activeTab === 'elements' && (() => {
          const filteredShapes = SHAPE_DEFINITIONS.filter((shape) => {
            const matchesSearch =
              shapeSearch.trim() === '' ||
              shape.name.toLowerCase().includes(shapeSearch.toLowerCase());
            const matchesCat = shapeCategory === 'all' || shape.category === shapeCategory;
            return matchesSearch && matchesCat;
          });

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Biblioteca de Formas
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  {filteredShapes.length} formas
                </span>
              </div>

              {/* Shape Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={shapeSearch}
                  onChange={(e) => setShapeSearch(e.target.value)}
                  placeholder="Buscar formas (ej. estrella, flecha)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Shape Category Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {(
                  [
                    { id: 'all', label: 'Todas' },
                    { id: 'basic', label: 'Básicas' },
                    { id: 'geometric', label: 'Geométr.' },
                    { id: 'arrows', label: 'Flechas' },
                    { id: 'symbols', label: 'Símbolos' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setShapeCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      shapeCategory === cat.id
                        ? 'bg-violet-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Visual Shapes Grid */}
              <div className="grid grid-cols-3 gap-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                {filteredShapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => onAddShape(shape.id)}
                    className="p-2.5 bg-slate-50 hover:bg-violet-50/80 border border-slate-200 hover:border-violet-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                    title={`Añadir ${shape.name}`}
                  >
                    <div className="w-9 h-9 flex items-center justify-center text-violet-600 group-hover:text-violet-700">
                      <svg viewBox="0 0 100 100" className="w-8 h-8 group-hover:scale-110 transition-transform">
                        <path d={shape.path} fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 group-hover:text-violet-900 truncate w-full text-center">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* TAB 5: FONDO */}
        {activeTab === 'background' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fondo del lienzo
            </h3>

            {/* Type Toggle: Sólido vs Gradientes */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setBgType('solid')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bgType === 'solid'
                    ? 'bg-white text-violet-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Color sólido
              </button>
              <button
                type="button"
                onClick={() => setBgType('gradients')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  bgType === 'gradients'
                    ? 'bg-white text-violet-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gradientes
              </button>
            </div>

            {bgType === 'solid' ? (
              <div className="space-y-4">
                {/* Custom Hex & Preview Box */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div
                    className="w-10 h-10 rounded-lg border border-slate-300 shadow-2xs shrink-0"
                    style={{ background: backgroundColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Código HEX personalizado
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-white border border-slate-200 rounded-md px-2 py-1 flex-1">
                        <Hash className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                        <input
                          type="text"
                          value={bgHexInput}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith('#') && val.length > 0) val = '#' + val;
                            setBgHexInput(val);
                            if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(val)) {
                              handleApplySolidBg(val);
                            }
                          }}
                          placeholder="#FFFFFF"
                          className="w-full text-xs font-mono font-bold text-slate-800 bg-transparent focus:outline-none uppercase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(bgHexInput)) {
                            handleApplySolidBg(bgHexInput);
                          }
                        }}
                        className="px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-md shadow-2xs cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </div>

                {/* Colores recientes */}
                {recentBgColors.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 mb-1.5 block">
                      Colores recientes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recentBgColors.map((hex, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplySolidBg(hex)}
                          className={`w-7 h-7 rounded-lg border shadow-2xs transition-transform cursor-pointer ${
                            backgroundColor.toLowerCase() === hex.toLowerCase()
                              ? 'ring-2 ring-violet-500 scale-110 border-slate-900'
                              : 'border-slate-300 hover:scale-110'
                          }`}
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Familias de color */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">
                      Paleta por tonalidades
                    </span>
                  </div>

                  {/* Selector de familia */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {COLOR_FAMILIES.map((fam) => (
                      <button
                        key={fam.name}
                        type="button"
                        onClick={() => setActiveBgFamily(fam.name)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          activeBgFamily === fam.name
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {fam.name}
                      </button>
                    ))}
                  </div>

                  {/* Tonos de la familia activa */}
                  {COLOR_FAMILIES.filter((f) => f.name === activeBgFamily).map((fam) => (
                    <div key={fam.name} className="space-y-1.5">
                      <div className="grid grid-cols-5 gap-1.5">
                        {fam.colors.map((hex, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleApplySolidBg(hex)}
                            className={`w-full aspect-square rounded-lg border shadow-2xs transition-all cursor-pointer relative group flex items-center justify-center ${
                              backgroundColor.toLowerCase() === hex.toLowerCase()
                                ? 'ring-2 ring-violet-600 scale-110 border-slate-900 z-10'
                                : 'border-slate-200 hover:scale-110'
                            }`}
                            style={{ backgroundColor: hex }}
                            title={hex}
                          >
                            {backgroundColor.toLowerCase() === hex.toLowerCase() && (
                              <Check className="w-3.5 h-3.5 text-violet-700 drop-shadow-md stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* GRADIENTES */
              <div className="space-y-3">
                {/* Category filters */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      { id: 'all', label: 'Todos' },
                      { id: 'soft', label: 'Suaves' },
                      { id: 'vibrant', label: 'Vibrantes' },
                      { id: 'dark', label: 'Oscuros' },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setGradientFilter(f.id)}
                      className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        gradientFilter === f.id
                          ? 'bg-violet-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Gradients Grid */}
                <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                  {GRADIENT_PRESETS.filter(
                    (g) => gradientFilter === 'all' || g.category === gradientFilter
                  ).map((grad, i) => {
                    const isActive = backgroundColor === grad.css;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onBackgroundColorChange(grad.css)}
                        className={`group p-2 rounded-xl border text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs relative overflow-hidden ${
                          isActive
                            ? 'border-violet-600 ring-2 ring-violet-500/40 bg-violet-50/20'
                            : 'border-slate-200 hover:border-violet-300 bg-white'
                        }`}
                        title={grad.name}
                      >
                        <div
                          className="w-full h-12 rounded-lg mb-1.5 shadow-inner transition-transform group-hover:scale-[1.02] flex items-center justify-center"
                          style={{ background: grad.css }}
                        >
                          {isActive && (
                            <div className="w-5 h-5 rounded-full bg-white/95 text-violet-700 shadow-md flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 group-hover:text-violet-700 block truncate">
                          {grad.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
