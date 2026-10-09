import React, { useState } from 'react';
import {
  Copy,
  Trash2,
  BringToFront,
  SendToBack,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Type,
  Palette,
  Minus,
  Plus,
  RotateCw,
  Pencil,
  Sparkles,
  Sun,
  Shield,
  Layers,
} from 'lucide-react';
import { CanvasElement } from '../../types';
import { PixoraColorPicker } from './PixoraColorPicker';

interface ElementPropertiesProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (updatedProps: Partial<CanvasElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onStartEditText?: () => void;
}

const AVAILABLE_FONTS = [
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Courier New', value: 'Courier New' },
];

export const ElementProperties: React.FC<ElementPropertiesProps> = ({
  selectedElement,
  onUpdateElement,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  onStartEditText,
}) => {
  if (!selectedElement) {
    return (
      <div className="h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500 select-none">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-violet-500" />
          <span className="font-medium text-slate-600">
            Haz clic en cualquier elemento del lienzo para editar sus propiedades o arrastra para moverlo.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400 font-medium">
          <span>Arrastrar = Mover</span>
          <span>•</span>
          <span>Tiradores = Redimensionar</span>
          <span>•</span>
          <span>Tirador superior = Rotar</span>
          <span>•</span>
          <span>Supr = Eliminar</span>
        </div>
      </div>
    );
  }

  const isText = selectedElement.type === 'text';
  const isShape = selectedElement.type === 'shape';
  const isImage = selectedElement.type === 'image';

  return (
    <div className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 overflow-x-auto select-none scrollbar-none">
      {/* Left side: Functional groups */}
      <div className="flex items-center gap-4 min-w-0">
        {/* ========================================= */}
        {/* GRUPO TEXTO (Solo si el elemento es texto) */}
        {/* ========================================= */}
        {isText && (
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Botón principal Editar texto */}
            <button
              type="button"
              onClick={onStartEditText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              title="Editar el contenido en el lienzo (o haz doble clic)"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar texto</span>
            </button>

            {/* Campo directo para escribir/editar texto */}
            <div
              className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1 border border-slate-200"
              title="Modificar contenido del texto directamente"
            >
              <Type className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                type="text"
                value={selectedElement.text || ''}
                onChange={(e) => onUpdateElement({ text: e.target.value })}
                placeholder="Escribe tu texto..."
                className="w-28 sm:w-40 text-xs font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
                title="Modificar el texto directamente"
              />
            </div>

            {/* Color del texto con selector PIXORA */}
            <PixoraColorPicker
              color={selectedElement.color || '#000000'}
              onChange={(c) => onUpdateElement({ color: c })}
              label="Color"
              showHexBadge={true}
            />

            {/* Selector de fuente */}
            <div
              className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200"
              title="Tipo de fuente tipográfica"
            >
              <select
                value={selectedElement.fontFamily || 'Plus Jakarta Sans'}
                onChange={(e) => onUpdateElement({ fontFamily: e.target.value })}
                className="bg-transparent text-xs font-bold text-slate-800 rounded px-2 py-1 focus:outline-none cursor-pointer"
                title="Cambiar familia tipográfica"
              >
                {AVAILABLE_FONTS.map((f) => (
                  <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tamaño de letra */}
            <div
              className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200"
              title="Tamaño de letra en píxeles"
            >
              <button
                type="button"
                onClick={() =>
                  onUpdateElement({
                    fontSize: Math.max(12, (selectedElement.fontSize || 32) - 4),
                  })
                }
                className="p-1 hover:bg-white rounded text-slate-700 transition-colors"
                title="Reducir tamaño de letra"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                value={selectedElement.fontSize || 32}
                onChange={(e) =>
                  onUpdateElement({ fontSize: Math.max(8, Number(e.target.value)) })
                }
                className="w-11 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                title="Tamaño de fuente"
              />
              <button
                type="button"
                onClick={() =>
                  onUpdateElement({
                    fontSize: Math.min(240, (selectedElement.fontSize || 32) + 4),
                  })
                }
                className="p-1 hover:bg-white rounded text-slate-700 transition-colors"
                title="Aumentar tamaño de letra"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Estilos: Negrita y Cursiva */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() =>
                  onUpdateElement({
                    fontWeight:
                      selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '800'
                        ? 'normal'
                        : 'bold',
                  })
                }
                className={`p-1.5 rounded transition-colors ${
                  selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '800'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
                title="Negrita (Bold)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateElement({
                    fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic',
                  })
                }
                className={`p-1.5 rounded transition-colors ${
                  selectedElement.fontStyle === 'italic'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
                title="Cursiva (Italic)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alineación de texto */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => onUpdateElement({ textAlign: 'left' })}
                className={`p-1.5 rounded transition-colors ${
                  selectedElement.textAlign === 'left' || !selectedElement.textAlign
                    ? 'bg-white text-violet-700 shadow-2xs font-bold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Alinear a la izquierda"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateElement({ textAlign: 'center' })}
                className={`p-1.5 rounded transition-colors ${
                  selectedElement.textAlign === 'center'
                    ? 'bg-white text-violet-700 shadow-2xs font-bold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Alinear al centro"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateElement({ textAlign: 'right' })}
                className={`p-1.5 rounded transition-colors ${
                  selectedElement.textAlign === 'right'
                    ? 'bg-white text-violet-700 shadow-2xs font-bold'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title="Alinear a la derecha"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Separador entre Texto y Apariencia */}
        {isText && <div className="h-6 w-px bg-slate-200 shrink-0" />}

        {/* ========================================= */}
        {/* GRUPO APARIENCIA (Relleno, Borde, Sombra, Opacidad, Rotación) */}
        {/* ========================================= */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Relleno para formas */}
          {isShape && (
            <div className="flex items-center gap-1.5">
              <PixoraColorPicker
                color={selectedElement.fillColor || '#7c3aed'}
                onChange={(c) => onUpdateElement({ fillColor: c })}
                label="Relleno"
                showHexBadge={true}
              />
            </div>
          )}

          {/* Bordes para formas */}
          {isShape && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  const hasBorder = (selectedElement.borderWidth || 0) > 0;
                  onUpdateElement({
                    borderWidth: hasBorder ? 0 : 3,
                    borderColor:
                      selectedElement.borderColor && selectedElement.borderColor !== 'transparent'
                        ? selectedElement.borderColor
                        : '#000000',
                  });
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  (selectedElement.borderWidth || 0) > 0
                    ? 'bg-violet-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
                title="Activar o desactivar borde"
              >
                Borde
              </button>

              {(selectedElement.borderWidth || 0) > 0 && (
                <>
                  <PixoraColorPicker
                    color={
                      selectedElement.borderColor && selectedElement.borderColor !== 'transparent'
                        ? selectedElement.borderColor
                        : '#000000'
                    }
                    onChange={(c) => onUpdateElement({ borderColor: c })}
                    showHexBadge={false}
                  />
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={selectedElement.borderWidth || 1}
                    onChange={(e) =>
                      onUpdateElement({
                        borderWidth: Math.max(1, Math.min(40, Number(e.target.value))),
                      })
                    }
                    className="w-10 text-center text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-1 py-0.5"
                    title="Grosor del borde en píxeles"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">px</span>
                </>
              )}
            </div>
          )}

          {/* Esquinas redondeadas para rectángulos */}
          {isShape &&
            (selectedElement.shapeType === 'rounded-rect' || selectedElement.shapeType === 'rectangle') && (
              <div
                className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200"
                title="Curvatura de esquinas"
              >
                <span className="text-[11px] font-bold text-slate-600">Esquinas:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedElement.borderRadius || 0}
                  onChange={(e) => onUpdateElement({ borderRadius: Number(e.target.value) })}
                  className="w-16 accent-violet-600 cursor-pointer"
                  title="Radio de esquinas redondeadas"
                />
              </div>
            )}

          {/* Esquinas redondeadas para imágenes */}
          {isImage && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200"
              title="Curvatura de esquinas de la imagen"
            >
              <span className="text-[11px] font-bold text-slate-600">Esquinas:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedElement.borderRadius || 0}
                onChange={(e) => onUpdateElement({ borderRadius: Number(e.target.value) })}
                className="w-16 accent-violet-600 cursor-pointer"
              />
            </div>
          )}

          {/* Sombra proyectada (Drop Shadow toggle) */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() =>
                onUpdateElement({
                  shadowEnabled: !selectedElement.shadowEnabled,
                  shadowBlur: 14,
                  shadowOffsetY: 6,
                  shadowColor: 'rgba(0, 0, 0, 0.35)',
                })
              }
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                selectedElement.shadowEnabled
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
              title="Activar o desactivar sombra proyectada"
            >
              <Sparkles className="w-3 h-3" />
              <span>Sombra</span>
            </button>
          </div>

          {/* Opacidad */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600"
            title="Nivel de opacidad y transparencia del elemento"
          >
            <span className="text-[11px] font-bold">Opacidad:</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={selectedElement.opacity !== undefined ? selectedElement.opacity : 1}
              onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
              className="w-16 accent-violet-600 cursor-pointer"
              title="Ajustar opacidad del 10% al 100%"
            />
            <span className="text-[10px] font-mono font-bold w-7 text-right">
              {Math.round((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100)}%
            </span>
          </div>

          {/* Rotación en grados */}
          <div
            className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600"
            title="Ángulo de rotación del elemento en grados"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="number"
              min="0"
              max="360"
              value={selectedElement.rotation || 0}
              onChange={(e) => {
                let val = Number(e.target.value) % 360;
                if (val < 0) val += 360;
                onUpdateElement({ rotation: Math.round(val) });
              }}
              className="w-10 text-center text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded px-1 py-0.5"
              title="Introduce los grados exactos de rotación"
            />
            <span className="text-[11px] font-bold text-slate-500">°</span>
            <button
              type="button"
              onClick={() => {
                const next = ((selectedElement.rotation || 0) + 90) % 360;
                onUpdateElement({ rotation: next });
              }}
              className="px-1.5 py-0.5 text-[10px] font-bold bg-white hover:bg-violet-50 text-violet-700 border border-slate-200 rounded cursor-pointer"
              title="Girar rápidamente +90° en sentido horario"
            >
              +90°
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* GRUPO ELEMENTO (Capas, Duplicar, Eliminar) */}
      {/* ========================================= */}
      <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-200">
        <button
          type="button"
          onClick={onBringForward}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Traer al frente (avanzar una capa superior)"
        >
          <BringToFront className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onSendBackward}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Enviar al fondo (retroceder una capa inferior)"
        >
          <SendToBack className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-200 mx-0.5" />

        <button
          type="button"
          onClick={onDuplicate}
          className="flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-violet-700 hover:bg-violet-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          title="Duplicar elemento seleccionado (Atajo: Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Duplicar</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          title="Eliminar elemento seleccionado (Atajo: Supr o Backspace)"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>
    </div>
  );
};

