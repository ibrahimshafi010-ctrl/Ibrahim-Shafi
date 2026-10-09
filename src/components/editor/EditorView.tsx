import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CanvasElement,
  CanvasPreset,
  DesignTemplate,
  ShapeType,
  ToastMessage,
  SavedProject,
} from '../../types';
import { CANVAS_PRESETS, TEMPLATES } from '../../data/templates';
import { downloadDesign } from '../../utils/canvasRenderer';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ElementProperties } from './ElementProperties';
import { CanvasWorkspace } from './CanvasWorkspace';
import { PreviewModal } from './PreviewModal';

interface EditorViewProps {
  initialTemplate?: DesignTemplate | null;
  initialPresetId?: string | null;
  onBackToHome: () => void;
  onShowToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

interface CanvasStateSnapshot {
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
}

const AUTOSAVE_KEY = 'pixora_autosave_design';
const SAVED_PROJECTS_KEY = 'pixora_saved_projects';

export const EditorView: React.FC<EditorViewProps> = ({
  initialTemplate,
  initialPresetId,
  onBackToHome,
  onShowToast,
}) => {
  // Determine initial preset
  const defaultPreset = CANVAS_PRESETS.find((p) => p.id === (initialPresetId || 'instagram-post')) || CANVAS_PRESETS[0];

  // Helper to load autosaved draft if not opening a specific template or preset
  const getInitialDesignState = () => {
    if (initialTemplate) {
      return {
        preset: {
          id: initialTemplate.id,
          name: initialTemplate.title,
          width: initialTemplate.width,
          height: initialTemplate.height,
          icon: 'Layers',
          aspectRatioLabel: initialTemplate.aspectRatio,
        },
        name: initialTemplate.title,
        width: initialTemplate.width,
        height: initialTemplate.height,
        backgroundColor: initialTemplate.backgroundColor,
        elements: JSON.parse(JSON.stringify(initialTemplate.elements)),
      };
    }
    if (initialPresetId) {
      const p = CANVAS_PRESETS.find((pr) => pr.id === initialPresetId) || defaultPreset;
      return {
        preset: p,
        name: 'Mi diseño sin título',
        width: p.width,
        height: p.height,
        backgroundColor: '#ffffff',
        elements: [],
      };
    }

    try {
      const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.width && parsed.height && Array.isArray(parsed.elements)) {
          return {
            preset: {
              id: 'autosaved',
              name: parsed.designName || 'Borrador recuperado',
              width: parsed.width,
              height: parsed.height,
              icon: 'Layers',
              aspectRatioLabel: `${parsed.width}:${parsed.height}`,
            },
            name: parsed.designName || 'Mi diseño sin título',
            width: parsed.width,
            height: parsed.height,
            backgroundColor: parsed.backgroundColor || '#ffffff',
            elements: parsed.elements,
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      preset: defaultPreset,
      name: 'Mi diseño sin título',
      width: defaultPreset.width,
      height: defaultPreset.height,
      backgroundColor: '#ffffff',
      elements: [],
    };
  };

  const initialDesign = getInitialDesignState();

  const [currentPreset, setCurrentPreset] = useState<CanvasPreset>(initialDesign.preset);
  const [designName, setDesignName] = useState<string>(initialDesign.name);
  const [width, setWidth] = useState<number>(initialDesign.width);
  const [height, setHeight] = useState<number>(initialDesign.height);
  const [backgroundColor, setBackgroundColor] = useState<string>(initialDesign.backgroundColor);
  const [elements, setElements] = useState<CanvasElement[]>(initialDesign.elements);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'templates' | 'text' | 'images' | 'elements' | 'background'
  >('templates');
  const [zoom, setZoom] = useState<number>(0.5);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isAutosaved, setIsAutosaved] = useState(true);

  // Copied element clipboard in memory
  const copiedElementRef = useRef<CanvasElement | null>(null);

  // Saved projects from localStorage
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_PROJECTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return [];
  });

  // Undo / Redo History
  const [history, setHistory] = useState<CanvasStateSnapshot[]>([
    {
      width: initialDesign.width,
      height: initialDesign.height,
      backgroundColor: initialDesign.backgroundColor,
      elements: JSON.parse(JSON.stringify(initialDesign.elements)),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback(
    (newElements: CanvasElement[], newBg: string = backgroundColor) => {
      setHistory((prev) => {
        const nextHistory = prev.slice(0, historyIndex + 1);
        return [
          ...nextHistory,
          {
            width,
            height,
            backgroundColor: newBg,
            elements: JSON.parse(JSON.stringify(newElements)),
          },
        ].slice(-25); // keep last 25 states
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 24));
    },
    [backgroundColor, width, height, historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetState = history[prevIndex];
      setElements(JSON.parse(JSON.stringify(targetState.elements)));
      setBackgroundColor(targetState.backgroundColor);
      setWidth(targetState.width);
      setHeight(targetState.height);
      setHistoryIndex(prevIndex);
      setSelectedId(null);
      onShowToast({ title: 'Deshecho', type: 'info' });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetState = history[nextIndex];
      setElements(JSON.parse(JSON.stringify(targetState.elements)));
      setBackgroundColor(targetState.backgroundColor);
      setWidth(targetState.width);
      setHeight(targetState.height);
      setHistoryIndex(nextIndex);
      setSelectedId(null);
      onShowToast({ title: 'Rehecho', type: 'info' });
    }
  };

  // Auto-fit zoom based on container & canvas dimension
  const handleFitToScreen = useCallback(() => {
    const availableWidth = window.innerWidth > 1024 ? window.innerWidth - 360 : window.innerWidth - 40;
    const availableHeight = window.innerHeight - 180;
    const scaleX = (availableWidth * 0.75) / width;
    const scaleY = (availableHeight * 0.75) / height;
    const bestScale = Math.min(scaleX, scaleY, 0.9);
    setZoom(Math.max(0.2, Math.round(bestScale * 100) / 100));
  }, [width, height]);

  useEffect(() => {
    handleFitToScreen();
  }, [width, height, handleFitToScreen]);

  // Load a full template
  const handleSelectTemplate = (template: DesignTemplate) => {
    setWidth(template.width);
    setHeight(template.height);
    setBackgroundColor(template.backgroundColor);
    const newEls = JSON.parse(JSON.stringify(template.elements));
    setElements(newEls);
    setDesignName(template.title);
    setSelectedId(null);
    pushHistory(newEls, template.backgroundColor);
    onShowToast({
      title: 'Plantilla aplicada',
      message: template.title,
      type: 'success',
    });
  };

  // Change preset size
  const handleSelectPreset = (preset: CanvasPreset) => {
    setCurrentPreset(preset);
    setWidth(preset.width);
    setHeight(preset.height);
    pushHistory(elements, backgroundColor);
    onShowToast({
      title: 'Tamaño actualizado',
      message: `${preset.name} (${preset.width}×${preset.height})`,
      type: 'info',
    });
  };

  // Change custom size (ancho x alto)
  const handleCustomSize = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
    setCurrentPreset({
      id: 'custom',
      name: `Personalizado (${newWidth}×${newHeight})`,
      width: newWidth,
      height: newHeight,
      icon: 'SlidersHorizontal',
      aspectRatioLabel: `${newWidth}:${newHeight}`,
    });
    pushHistory(elements, backgroundColor);
    onShowToast({
      title: 'Tamaño personalizado aplicado',
      message: `${newWidth} × ${newHeight} px`,
      type: 'info',
    });
  };

  // Auto-save design to localStorage debounced
  useEffect(() => {
    setIsAutosaved(false);
    const timer = setTimeout(() => {
      try {
        const payload = {
          designName,
          width,
          height,
          backgroundColor,
          elements,
          updatedAt: Date.now(),
        };
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
        setIsAutosaved(true);
      } catch (e) {
        // LocalStorage quota or blocked
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [designName, width, height, backgroundColor, elements]);

  // Mis Diseños - Save current design
  const handleSaveCurrentProject = () => {
    const newProject: SavedProject = {
      id: `proj-${Date.now()}`,
      name: designName || 'Diseño sin título',
      width,
      height,
      backgroundColor,
      elements: JSON.parse(JSON.stringify(elements)),
      updatedAt: Date.now(),
    };

    setSavedProjects((prev) => {
      const updated = [newProject, ...prev.filter((p) => p.name !== newProject.name)].slice(0, 30);
      try {
        localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving to localStorage', err);
      }
      return updated;
    });

    onShowToast({
      title: 'Diseño guardado en Mis Diseños',
      message: newProject.name,
      type: 'success',
    });
  };

  // Mis Diseños - Load design
  const handleLoadProject = (project: SavedProject) => {
    setWidth(project.width);
    setHeight(project.height);
    setBackgroundColor(project.backgroundColor);
    const newEls = JSON.parse(JSON.stringify(project.elements));
    setElements(newEls);
    setDesignName(project.name);
    setSelectedId(null);
    setCurrentPreset({
      id: `saved-${project.id}`,
      name: project.name,
      width: project.width,
      height: project.height,
      icon: 'FolderOpen',
      aspectRatioLabel: `${project.width}:${project.height}`,
    });
    pushHistory(newEls, project.backgroundColor);
    onShowToast({
      title: 'Proyecto cargado',
      message: project.name,
      type: 'success',
    });
  };

  // Mis Diseños - Delete design
  const handleDeleteProject = (id: string) => {
    setSavedProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving to localStorage', err);
      }
      return updated;
    });
    onShowToast({
      title: 'Proyecto eliminado de Mis Diseños',
      type: 'info',
    });
  };

  // Add text element
  const handleAddText = (type: 'title' | 'subtitle' | 'body' | 'badge') => {
    const id = `text-${Date.now()}`;
    let newElement: CanvasElement;

    const centerX = Math.max(40, width / 2 - 300);
    const centerY = Math.max(40, height / 2 - 50);

    if (type === 'title') {
      newElement = {
        id,
        type: 'text',
        text: 'Añade tu título aquí',
        fontSize: 64,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '800',
        color: '#0f172a',
        textAlign: 'center',
        x: centerX,
        y: centerY,
        width: 600,
        height: 120,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length + 1,
      };
    } else if (type === 'subtitle') {
      newElement = {
        id,
        type: 'text',
        text: 'Subtítulo atractivo para tu diseño',
        fontSize: 36,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'bold',
        color: '#475569',
        textAlign: 'center',
        x: centerX,
        y: centerY,
        width: 600,
        height: 80,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length + 1,
      };
    } else if (type === 'badge') {
      newElement = {
        id,
        type: 'text',
        text: '★ OFERTA EXCLUSIVA ★',
        fontSize: 24,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: '800',
        color: '#7c3aed',
        textAlign: 'center',
        x: Math.max(40, width / 2 - 180),
        y: centerY,
        width: 360,
        height: 50,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length + 1,
      };
    } else {
      newElement = {
        id,
        type: 'text',
        text: 'Escribe aquí tu texto descriptivo. Puedes personalizar el estilo, alineación y colores fácilmente.',
        fontSize: 24,
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 'normal',
        color: '#64748b',
        textAlign: 'left',
        x: centerX,
        y: centerY,
        width: 600,
        height: 100,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length + 1,
      };
    }

    const updated = [...elements, newElement];
    setElements(updated);
    setSelectedId(id);
    pushHistory(updated);
    onShowToast({ title: 'Texto añadido al lienzo', type: 'success' });
  };

  // Add shape
  const handleAddShape = (shapeType: ShapeType) => {
    const id = `shape-${Date.now()}`;
    const baseSize = Math.min(width, height) * 0.25;

    let shapeW = baseSize;
    let shapeH = baseSize;
    if (shapeType === 'rectangle') {
      shapeW = baseSize * 1.5;
      shapeH = baseSize * 0.85;
    } else if (shapeType === 'pill') {
      shapeW = baseSize * 1.6;
      shapeH = baseSize * 0.65;
    } else if (shapeType === 'ellipse') {
      shapeW = baseSize * 1.4;
      shapeH = baseSize * 0.85;
    } else if (shapeType === 'line' || shapeType === 'line-arrow') {
      shapeW = baseSize * 1.6;
      shapeH = 28;
    } else if (shapeType === 'arrow-right' || shapeType === 'arrow-double') {
      shapeW = baseSize * 1.4;
      shapeH = baseSize * 0.7;
    } else if (shapeType === 'semicircle' || shapeType === 'arc') {
      shapeW = baseSize * 1.3;
      shapeH = baseSize * 0.75;
    }

    const centerX = Math.max(40, width / 2 - shapeW / 2);
    const centerY = Math.max(40, height / 2 - shapeH / 2);

    const newElement: CanvasElement = {
      id,
      type: 'shape',
      shapeType,
      x: centerX,
      y: centerY,
      width: shapeW,
      height: shapeH,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      fillColor: '#7c3aed',
      borderRadius: shapeType === 'rounded-rect' ? 24 : 0,
    };

    const updated = [...elements, newElement];
    setElements(updated);
    setSelectedId(id);
    pushHistory(updated);
    onShowToast({ title: 'Forma geométrica añadida', type: 'success' });
  };

  // Add image
  const handleAddImage = (src: string, alt: string = 'Imagen') => {
    const id = `img-${Date.now()}`;
    const imgWidth = Math.min(width * 0.6, 600);
    const imgHeight = imgWidth * 0.66;
    const centerX = Math.max(20, width / 2 - imgWidth / 2);
    const centerY = Math.max(20, height / 2 - imgHeight / 2);

    const newElement: CanvasElement = {
      id,
      type: 'image',
      src,
      imageAlt: alt,
      x: centerX,
      y: centerY,
      width: imgWidth,
      height: imgHeight,
      rotation: 0,
      opacity: 1,
      zIndex: elements.length + 1,
      borderRadius: 16,
    };

    const updated = [...elements, newElement];
    setElements(updated);
    setSelectedId(id);
    pushHistory(updated);
    onShowToast({ title: 'Imagen añadida al diseño', type: 'success' });
  };

  // Update element properties
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const handleUpdateSelectedProps = (updates: Partial<CanvasElement>) => {
    if (!selectedId) return;
    handleUpdateElement(selectedId, updates);
    pushHistory(
      elements.map((el) => (el.id === selectedId ? { ...el, ...updates } : el))
    );
  };

  // Duplicate element
  const handleDuplicateSelected = () => {
    if (!selectedId) return;
    const target = elements.find((el) => el.id === selectedId);
    if (!target) return;

    const duplicated: CanvasElement = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.type}-${Date.now()}`,
      x: target.x + 30,
      y: target.y + 30,
      zIndex: elements.length + 1,
    };

    const updated = [...elements, duplicated];
    setElements(updated);
    setSelectedId(duplicated.id);
    pushHistory(updated);
    onShowToast({ title: 'Elemento duplicado', type: 'success' });
  };

  // Delete element
  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const updated = elements.filter((el) => el.id !== selectedId);
    setElements(updated);
    setSelectedId(null);
    pushHistory(updated);
    onShowToast({ title: 'Elemento eliminado', type: 'info' });
  };

  // Bring forward / Send backward
  const handleBringForward = () => {
    if (!selectedId) return;
    const updated = [...elements];
    const index = updated.findIndex((el) => el.id === selectedId);
    if (index < updated.length - 1) {
      const temp = updated[index].zIndex || index;
      updated[index].zIndex = (updated[index + 1].zIndex || index + 1) + 1;
      setElements(updated);
      pushHistory(updated);
    }
  };

  const handleSendBackward = () => {
    if (!selectedId) return;
    const updated = [...elements];
    const index = updated.findIndex((el) => el.id === selectedId);
    if (index > 0) {
      const newZ = Math.max(0, (updated[index - 1].zIndex || 1) - 1);
      updated[index].zIndex = newZ;
      setElements(updated);
      pushHistory(updated);
    }
  };

  // Change background color
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    pushHistory(elements, color);
  };

  // Export / Download
  const handleDownload = async (format: 'png' | 'jpeg' = 'png') => {
    try {
      setIsExporting(true);
      await downloadDesign(width, height, backgroundColor, elements, designName, format);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });
      onShowToast({
        title: '¡Diseño descargado con éxito!',
        message: `Guardado como ${format.toUpperCase()}`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
      onShowToast({
        title: 'Error al exportar diseño',
        message: 'Por favor, intenta de nuevo.',
        type: 'warning',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Keyboard shortcuts (Delete, Escape, Ctrl+Z, Ctrl+D, Ctrl+C, Ctrl+V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedId) {
          e.preventDefault();
          const target = elements.find((el) => el.id === selectedId);
          if (target) {
            copiedElementRef.current = JSON.parse(JSON.stringify(target));
            onShowToast({
              title: 'Elemento copiado',
              message: 'Presiona Ctrl+V para pegar',
              type: 'info',
            });
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (copiedElementRef.current) {
          e.preventDefault();
          const target = copiedElementRef.current;
          const pasted: CanvasElement = {
            ...JSON.parse(JSON.stringify(target)),
            id: `${target.type}-${Date.now()}`,
            x: Math.min(width - 40, target.x + 24),
            y: Math.min(height - 40, target.y + 24),
            zIndex: elements.length + 1,
          };
          const updated = [...elements, pasted];
          setElements(updated);
          setSelectedId(pasted.id);
          pushHistory(updated);
          onShowToast({ title: 'Elemento pegado', type: 'success' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Paste image directly from system clipboard into the canvas
  useEffect(() => {
    const handleClipboardPaste = (e: ClipboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
              const result = uploadEvent.target?.result as string;
              if (result) {
                handleAddImage(result, 'Imagen pegada');
                onShowToast({
                  title: 'Imagen pegada desde el portapapeles',
                  type: 'success',
                });
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handleClipboardPaste);
    return () => window.removeEventListener('paste', handleClipboardPaste);
  });

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 overflow-hidden">
      {/* 1. TOP BAR */}
      <TopBar
        designName={designName}
        onDesignNameChange={setDesignName}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        onFitToScreen={handleFitToScreen}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onDownload={handleDownload}
        onBackToHome={onBackToHome}
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onCustomSize={handleCustomSize}
        canvasWidth={width}
        canvasHeight={height}
        isExporting={isExporting}
        isSaved={isAutosaved}
      />

      {/* 2. MAIN WORKSPACE ROW */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeSidebarTab}
          onTabChange={setActiveSidebarTab}
          onSelectTemplate={handleSelectTemplate}
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={handleBackgroundColorChange}
          savedProjects={savedProjects}
          onSaveCurrentProject={handleSaveCurrentProject}
          onLoadProject={handleLoadProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* Center Canvas Area + Contextual Properties */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Contextual Properties toolbar */}
          <ElementProperties
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateSelectedProps}
            onDuplicate={handleDuplicateSelected}
            onDelete={handleDeleteSelected}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onStartEditText={() => {
              if (selectedId) {
                setEditingTextId(selectedId);
              }
            }}
          />

          {/* Interactive Canvas CanvasWorkspace */}
          <CanvasWorkspace
            width={width}
            height={height}
            backgroundColor={backgroundColor}
            elements={elements}
            selectedId={selectedId}
            onSelectElement={(id) => {
              setSelectedId(id);
              if (!id || id !== editingTextId) {
                setEditingTextId(null);
              }
            }}
            onUpdateElement={handleUpdateElement}
            zoom={zoom}
            onCommitHistory={() => pushHistory(elements, backgroundColor)}
            editingTextId={editingTextId}
            onSetEditingTextId={setEditingTextId}
          />
        </div>
      </div>

      {/* 3. PREVIEW MODAL */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        elements={elements}
        designName={designName}
        onDownload={handleDownload}
      />
    </div>
  );
};
