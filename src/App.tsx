import React, { useState } from 'react';
import { ViewMode, DesignTemplate, ToastMessage } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { HomeView } from './components/home/HomeView';
import { TemplatesView } from './components/templates/TemplatesView';
import { ToolsView } from './components/tools/ToolsView';
import { PricingView } from './components/pricing/PricingView';
import { EditorView } from './components/editor/EditorView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [activeTemplate, setActiveTemplate] = useState<DesignTemplate | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleShowToast = (toastData: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { ...toastData, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenEditorWithTemplate = (template: DesignTemplate) => {
    setActiveTemplate(template);
    setActivePresetId(null);
    setCurrentView('editor');
    handleShowToast({
      title: 'Editor cargado con plantilla',
      message: template.title,
      type: 'info',
    });
  };

  const handleOpenEditorWithPreset = (presetId: string) => {
    setActiveTemplate(null);
    setActivePresetId(presetId);
    setCurrentView('editor');
  };

  const handleNewBlankDesign = () => {
    setActiveTemplate(null);
    setActivePresetId('instagram-post');
    setCurrentView('editor');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col text-slate-900 selection:bg-violet-500 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* When in Editor view, render the dedicated Full-Screen Editor */}
      {currentView === 'editor' ? (
        <EditorView
          initialTemplate={activeTemplate}
          initialPresetId={activePresetId}
          onBackToHome={() => setCurrentView('home')}
          onShowToast={handleShowToast}
        />
      ) : (
        <>
          {/* Main App Navigation */}
          <Navbar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onNewDesign={handleNewBlankDesign}
          />

          {/* View Container */}
          <main className="flex-1">
            {currentView === 'home' && (
              <HomeView
                onNavigate={(view) => setCurrentView(view)}
                onOpenEditorWithTemplate={handleOpenEditorWithTemplate}
                onOpenEditorWithPreset={handleOpenEditorWithPreset}
                onNewDesign={handleNewBlankDesign}
              />
            )}

            {currentView === 'templates' && (
              <TemplatesView
                onSelectTemplate={handleOpenEditorWithTemplate}
                onNewBlank={handleNewBlankDesign}
              />
            )}

            {currentView === 'tools' && (
              <ToolsView onShowToast={handleShowToast} />
            )}

            {currentView === 'pricing' && (
              <PricingView
                onStartFree={handleNewBlankDesign}
                onShowToast={handleShowToast}
              />
            )}
          </main>

          {/* Global Footer */}
          <Footer onNavigate={(view) => setCurrentView(view)} />
        </>
      )}
    </div>
  );
}
