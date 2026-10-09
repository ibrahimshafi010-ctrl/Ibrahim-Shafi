import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Pencil } from 'lucide-react';
import { CanvasElement } from '../../types';
import { getShapeDefinition } from '../../utils/shapeDefinitions';

interface CanvasWorkspaceProps {
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  zoom: number;
  onCommitHistory?: () => void;
  editingTextId?: string | null;
  onSetEditingTextId?: (id: string | null) => void;
}

type ResizeHandle = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  width,
  height,
  backgroundColor,
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  zoom,
  onCommitHistory,
  editingTextId: externalEditingTextId,
  onSetEditingTextId: externalSetEditingTextId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalEditingTextId, setInternalEditingTextId] = useState<string | null>(null);

  const editingTextId = externalEditingTextId !== undefined ? externalEditingTextId : internalEditingTextId;
  const setEditingTextId = externalSetEditingTextId || setInternalEditingTextId;

  // Dragging state
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  // Resizing state
  const [resizeState, setResizeState] = useState<{
    elementId: string;
    handle: ResizeHandle;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
  } | null>(null);

  // Rotating state
  const [rotateState, setRotateState] = useState<{
    elementId: string;
    centerX: number;
    centerY: number;
    startMouseAngle: number;
    initialRotation: number;
  } | null>(null);

  // Mouse move handler for Drag, Resize, and Rotate
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) {
        const deltaX = (e.clientX - dragState.startX) / zoom;
        const deltaY = (e.clientY - dragState.startY) / zoom;

        onUpdateElement(dragState.elementId, {
          x: Math.round(dragState.initialX + deltaX),
          y: Math.round(dragState.initialY + deltaY),
        });
      } else if (resizeState) {
        const deltaX = (e.clientX - resizeState.startX) / zoom;
        const deltaY = (e.clientY - resizeState.startY) / zoom;

        let newX = resizeState.initialX;
        let newY = resizeState.initialY;
        let newW = resizeState.initialWidth;
        let newH = resizeState.initialHeight;

        const { handle } = resizeState;

        if (handle.includes('e')) {
          newW = Math.max(20, resizeState.initialWidth + deltaX);
        }
        if (handle.includes('s')) {
          newH = Math.max(20, resizeState.initialHeight + deltaY);
        }
        if (handle.includes('w')) {
          const maxDelta = resizeState.initialWidth - 20;
          const clampedDelta = Math.min(maxDelta, deltaX);
          newX = resizeState.initialX + clampedDelta;
          newW = resizeState.initialWidth - clampedDelta;
        }
        if (handle.includes('n')) {
          const maxDelta = resizeState.initialHeight - 20;
          const clampedDelta = Math.min(maxDelta, deltaY);
          newY = resizeState.initialY + clampedDelta;
          newH = resizeState.initialHeight - clampedDelta;
        }

        onUpdateElement(resizeState.elementId, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
      } else if (rotateState) {
        const rad = Math.atan2(e.clientY - rotateState.centerY, e.clientX - rotateState.centerX);
        const currentAngle = (rad * 180) / Math.PI;
        const deltaAngle = currentAngle - rotateState.startMouseAngle;
        let newRotation = Math.round((rotateState.initialRotation + deltaAngle) % 360);
        if (newRotation < 0) newRotation += 360;

        // Snapping to common angles within 3 degrees
        const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        for (const snap of snapAngles) {
          if (Math.abs(newRotation - snap) <= 3) {
            newRotation = snap % 360;
            break;
          }
        }

        onUpdateElement(rotateState.elementId, { rotation: newRotation });
      }
    };

    const handleMouseUp = () => {
      if (dragState || resizeState || rotateState) {
        setDragState(null);
        setResizeState(null);
        setRotateState(null);
        if (onCommitHistory) {
          onCommitHistory();
        }
      }
    };

    if (dragState || resizeState || rotateState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, rotateState, zoom, onUpdateElement, onCommitHistory]);

  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    onSelectElement(el.id);

    if (editingTextId === el.id) return;

    setDragState({
      elementId: el.id,
      startX: e.clientX,
      startY: e.clientY,
      initialX: el.x,
      initialY: el.y,
    });
  };

  const handleResizeHandleMouseDown = (
    e: React.MouseEvent,
    handle: ResizeHandle,
    el: CanvasElement
  ) => {
    e.stopPropagation();
    setResizeState({
      elementId: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialX: el.x,
      initialY: el.y,
      initialWidth: el.width,
      initialHeight: el.height,
    });
  };

  const handleRotateHandleMouseDown = (
    e: React.MouseEvent,
    el: CanvasElement
  ) => {
    e.stopPropagation();
    const target = e.currentTarget.closest('[data-canvas-element="true"]') as HTMLElement;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const startMouseAngle = (rad * 180) / Math.PI;

    setRotateState({
      elementId: el.id,
      centerX,
      centerY,
      startMouseAngle,
      initialRotation: el.rotation || 0,
    });
  };

  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => {
        onSelectElement(null);
        setEditingTextId(null);
      }}
      className="flex-1 bg-slate-200/80 canvas-checkerboard relative overflow-auto p-8 sm:p-12 flex items-center justify-center select-none"
    >
      {/* Scaled Canvas Wrapper */}
      <div
        style={{
          width: `${width * zoom}px`,
          height: `${height * zoom}px`,
          position: 'relative',
        }}
        className="transition-transform duration-75 origin-center"
      >
        {/* Actual Canvas */}
        <div
          onContextMenu={(e) => e.preventDefault()}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            background: backgroundColor || '#ffffff',
          }}
          className="shadow-2xl absolute top-0 left-0 overflow-hidden ring-1 ring-black/5"
        >
          {/* Render Elements */}
          {sortedElements.map((el) => {
            const isSelected = selectedId === el.id;
            const isEditing = editingTextId === el.id;

            return (
              <div
                key={el.id}
                data-canvas-element="true"
                onMouseDown={(e) => handleElementMouseDown(e, el)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (el.type === 'text') {
                    setEditingTextId(el.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: `${el.x}px`,
                  top: `${el.y}px`,
                  width: `${el.width}px`,
                  height: `${el.height}px`,
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  opacity: el.opacity !== undefined ? el.opacity : 1,
                  zIndex: el.zIndex || 1,
                  cursor: isSelected ? 'move' : 'pointer',
                  filter: el.shadowEnabled
                    ? `drop-shadow(${el.shadowOffsetX || 0}px ${el.shadowOffsetY || 6}px ${el.shadowBlur || 14}px ${el.shadowColor || 'rgba(0,0,0,0.35)'})`
                    : undefined,
                }}
                className={`group transition-shadow ${
                  isSelected ? 'ring-2 ring-violet-600 ring-offset-1 ring-offset-white/80' : 'hover:ring-1 hover:ring-violet-400/60'
                }`}
              >
                {/* 1. TEXT ELEMENT */}
                {el.type === 'text' && (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    {isEditing ? (
                      <div className="w-full h-full relative z-50">
                        <textarea
                          autoFocus
                          value={el.text || ''}
                          onChange={(e) => onUpdateElement(el.id, { text: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              setEditingTextId(null);
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setEditingTextId(null);
                            }
                          }}
                          onBlur={() => setEditingTextId(null)}
                          style={{
                            fontSize: `${el.fontSize || 32}px`,
                            fontFamily: el.fontFamily || 'Plus Jakarta Sans',
                            fontWeight: el.fontWeight || 'normal',
                            fontStyle: el.fontStyle || 'normal',
                            color: el.color || '#000000',
                            textAlign: el.textAlign || 'left',
                            lineHeight: el.lineHeight || 1.2,
                          }}
                          className="w-full h-full bg-white/95 p-1 border-2 border-violet-600 rounded resize-none focus:outline-none shadow-2xl"
                        />
                        <div className="absolute top-full left-0 mt-1 bg-slate-900/95 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                          ↵ Enter para confirmar • Shift+Enter nueva línea • Esc cancelar
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: `${el.fontSize || 32}px`,
                          fontFamily: el.fontFamily || 'Plus Jakarta Sans',
                          fontWeight: el.fontWeight || 'normal',
                          fontStyle: el.fontStyle || 'normal',
                          color: el.color || '#000000',
                          textAlign: el.textAlign || 'left',
                          lineHeight: el.lineHeight || 1.2,
                          width: '100%',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {el.text}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. SHAPE ELEMENT */}
                {el.type === 'shape' && (
                  <div className="w-full h-full relative">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="w-full h-full overflow-visible"
                    >
                      <path
                        d={getShapeDefinition(el.shapeType || 'rectangle').path}
                        fill={el.fillColor || '#7c3aed'}
                        stroke={el.borderWidth ? el.borderColor || '#000000' : 'transparent'}
                        strokeWidth={el.borderWidth || 0}
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {/* 3. IMAGE ELEMENT */}
                {el.type === 'image' && el.src && (
                  <div
                    className="w-full h-full overflow-hidden"
                    style={{ borderRadius: `${el.borderRadius || 0}px` }}
                  >
                    <img
                      src={el.src}
                      alt={el.imageAlt || 'Diseño'}
                      className="w-full h-full pointer-events-none select-none object-cover"
                      draggable={false}
                    />
                  </div>
                )}

                {/* RESIZE & ROTATION HANDLES (Rendered only when selected) */}
                {isSelected && (
                  <>
                    {/* Circular Rotation Handle */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-50 pointer-events-auto">
                      <div
                        onMouseDown={(e) => handleRotateHandleMouseDown(e, el)}
                        className="w-5 h-5 bg-white border-2 border-violet-600 rounded-full cursor-grab active:cursor-grabbing shadow-md hover:scale-125 transition-transform flex items-center justify-center text-violet-700"
                        title="Rotar elemento (arrastra o usa grados en la barra)"
                      >
                        <RotateCw className="w-2.5 h-2.5 text-violet-600" />
                      </div>
                      <div className="w-0.5 h-3 bg-violet-600" />
                    </div>

                    {/* Top-Left */}
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'nw', el)}
                      className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-violet-600 rounded-full cursor-nwse-resize z-50 shadow-xs hover:scale-125"
                    />
                    {/* Top-Right */}
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'ne', el)}
                      className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-violet-600 rounded-full cursor-nesw-resize z-50 shadow-xs hover:scale-125"
                    />
                    {/* Bottom-Right */}
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'se', el)}
                      className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-violet-600 rounded-full cursor-nwse-resize z-50 shadow-xs hover:scale-125"
                    />
                    {/* Bottom-Left */}
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'sw', el)}
                      className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-violet-600 rounded-full cursor-nesw-resize z-50 shadow-xs hover:scale-125"
                    />

                    {/* Edge middle handles */}
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'n', el)}
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-violet-600 rounded-xs cursor-ns-resize z-50"
                    />
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 's', el)}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-violet-600 rounded-xs cursor-ns-resize z-50"
                    />
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'e', el)}
                      className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-4 bg-white border border-violet-600 rounded-xs cursor-ew-resize z-50"
                    />
                    <div
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, 'w', el)}
                      className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-4 bg-white border border-violet-600 rounded-xs cursor-ew-resize z-50"
                    />

                    {/* Floating Info & Edit Action Badge */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md text-[10px] font-semibold shadow-lg whitespace-nowrap z-50 pointer-events-auto">
                      <span>
                        {el.type === 'text'
                          ? 'Texto'
                          : el.type === 'shape'
                          ? getShapeDefinition(el.shapeType || 'rectangle').name
                          : 'Imagen'}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {Math.round(el.width)}×{Math.round(el.height)}
                      </span>
                      {el.type === 'text' && !isEditing && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTextId(el.id);
                          }}
                          className="ml-1 px-1.5 py-0.2 rounded bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Editar texto"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                          <span>Editar</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
