import React, { useState, useEffect, useRef } from 'react';
import { Check, Hash, RotateCcw, Sparkles } from 'lucide-react';

interface PixoraColorPickerProps {
  color: string;
  onChange: (newColor: string) => void;
  label?: string;
  showHexBadge?: boolean;
}

export const COLOR_FAMILIES = [
  {
    name: 'Rojos',
    colors: [
      '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350',
      '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c',
      '#880e4f', '#ff8a80', '#ff5252', '#ff1744', '#d50000',
    ],
  },
  {
    name: 'Naranjas',
    colors: [
      '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726',
      '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100',
      '#ff6e40', '#ff3d00', '#dd2c00', '#d97706', '#b45309',
    ],
  },
  {
    name: 'Amarillos',
    colors: [
      '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58',
      '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17',
      '#ffff8d', '#ffd600', '#eab308', '#ca8a04', '#a16207',
    ],
  },
  {
    name: 'Verdes',
    colors: [
      '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a',
      '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20',
      '#b9f6ca', '#69f0ae', '#00e676', '#10b981', '#059669',
    ],
  },
  {
    name: 'Cian y Turquesa',
    colors: [
      '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da',
      '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064',
      '#84ffff', '#18ffff', '#00e5ff', '#14b8a6', '#0f766e',
    ],
  },
  {
    name: 'Azules',
    colors: [
      '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5',
      '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1',
      '#82b1ff', '#448aff', '#2f80ed', '#2563eb', '#1e40af',
    ],
  },
  {
    name: 'Morados y Violetas',
    colors: [
      '#f3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc',
      '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c',
      '#ea80fc', '#e040fb', '#7c3aed', '#8b5cf6', '#6366f1',
    ],
  },
  {
    name: 'Rosas',
    colors: [
      '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a',
      '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f',
      '#ff80ab', '#ff4081', '#f43f5e', '#e11d48', '#9f1239',
    ],
  },
  {
    name: 'Marrones y Cálidos',
    colors: [
      '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63',
      '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723',
      '#fed7aa', '#fdba74', '#fb923c', '#9a3412', '#78350f',
    ],
  },
  {
    name: 'Grises, Blanco y Negro',
    colors: [
      '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1',
      '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b',
      '#0f172a', '#09090b', '#18181b', '#27272a', '#000000',
    ],
  },
];

export const RECENT_KEY = 'pixora_recent_colors';

export const PixoraColorPicker: React.FC<PixoraColorPickerProps> = ({
  color,
  onChange,
  label,
  showHexBadge = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFamily, setActiveFamily] = useState<string>('Morados y Violetas');
  const [hexInput, setHexInput] = useState(color || '#7c3aed');
  const [recentColors, setRecentColors] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return ['#000000', '#ffffff', '#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ef4444'];
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(color || '#000000');
  }, [color]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectColor = (c: string) => {
    const normalized = c.startsWith('#') ? c : `#${c}`;
    onChange(normalized);
    setHexInput(normalized);

    // Update recent colors
    setRecentColors((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
      const updated = [normalized, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleHexInputChange = (val: string) => {
    let clean = val.trim();
    if (!clean.startsWith('#')) clean = `#${clean}`;
    setHexInput(clean);

    // Validate 3 or 6 hex digits
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(clean)) {
      selectColor(clean);
    }
  };

  const currentFamilyColors =
    COLOR_FAMILIES.find((f) => f.name === activeFamily)?.colors || COLOR_FAMILIES[0].colors;

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer focus:outline-none"
        title={label || 'Elegir color'}
      >
        <span
          className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
          style={{ backgroundColor: color || '#000000' }}
        />
        {label && <span className="text-[11px] font-bold text-slate-700">{label}</span>}
        {showHexBadge && (
          <span className="text-[10px] font-mono text-slate-600 uppercase">
            {color || '#000000'}
          </span>
        )}
      </button>

      {/* Floating Color Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-76 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 select-none">
          {/* Header Preview & Custom HEX Input */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
            <span
              className="w-8 h-8 rounded-xl border border-slate-200 shadow-inner shrink-0"
              style={{ backgroundColor: color || '#000000' }}
            />
            <div className="flex-1 flex items-center bg-slate-100 rounded-lg px-2 py-1 border border-slate-200">
              <Hash className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
              <input
                type="text"
                value={hexInput.replace('#', '')}
                onChange={(e) => handleHexInputChange(e.target.value)}
                maxLength={7}
                placeholder="7C3AED"
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-none uppercase"
              />
            </div>
          </div>

          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                Colores recientes
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {recentColors.map((rc, idx) => (
                  <button
                    key={`${rc}-${idx}`}
                    type="button"
                    onClick={() => selectColor(rc)}
                    className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs hover:scale-125 transition-transform shrink-0 relative"
                    style={{ backgroundColor: rc }}
                    title={rc}
                  >
                    {color.toLowerCase() === rc.toLowerCase() && (
                      <Check
                        className={`w-3 h-3 absolute inset-0 m-auto ${
                          rc.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Family Selector Pills */}
          <div className="pt-2 pb-1.5">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px] font-bold">
              {COLOR_FAMILIES.map((family) => (
                <button
                  key={family.name}
                  type="button"
                  onClick={() => setActiveFamily(family.name)}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    activeFamily === family.name
                      ? 'bg-violet-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {family.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Shades for active family */}
          <div className="grid grid-cols-5 gap-1.5 py-1">
            {currentFamilyColors.map((c) => {
              const isSelected = color.toLowerCase() === c.toLowerCase();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectColor(c)}
                  className={`aspect-square rounded-lg border transition-all hover:scale-110 flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-violet-500 ring-offset-1 scale-105 border-slate-900 shadow-xs'
                      : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        c === '#ffffff' || c.startsWith('#fff') || c.startsWith('#f8') || c.startsWith('#f1')
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Grayscale / Black & White Bar */}
          <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Básicos:</span>
            <div className="flex items-center gap-1">
              {['#ffffff', '#cbd5e1', '#64748b', '#0f172a', '#000000'].map((basicColor) => (
                <button
                  key={basicColor}
                  type="button"
                  onClick={() => selectColor(basicColor)}
                  className="w-4 h-4 rounded-md border border-slate-300 hover:scale-125 transition-transform"
                  style={{ backgroundColor: basicColor }}
                  title={basicColor}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
