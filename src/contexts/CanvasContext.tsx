import { createContext, useContext, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';


interface CanvasSize {
  width: number;
  height: number;
}

interface CanvasSettings {
  background_color: string;
  grid_enabled: boolean;
  grid_size: number;
  snap_to_grid: boolean;
  zoom_level: number;
  header_image?: string;
  show_header_image?: boolean;
}

interface WidgetStyle {
  background_color?: string;
  border_color?: string;
  text_color?: string;
  font_size?: number;
  font_family?: string;
  rotation?: number;
  opacity?: number;
}

interface Widget {
  id: string;
  widget_type: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: WidgetStyle;
  created?: string;
}

interface CanvasData {
  theme: string;
  settings: CanvasSettings;
  widgets: Widget[];
  canvas_size: CanvasSize;
}

interface CanvasContextType {
  canvasData: CanvasData;
  updateWidget: (widget: Widget) => void;
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateSettings: (settings: Partial<CanvasSettings>) => void;
  setTheme: (theme: string) => void;
  saveCanvas: () => Promise<void>;
}

const defaultCanvasData: CanvasData = {
  theme: 'dark',
  settings: {
    background_color: '#ffffff',
    grid_enabled: true,
    grid_size: 20,
    snap_to_grid: false,
    zoom_level: 1.0,
    header_image: null,
    show_header_image: false,
  },
  canvas_size: {
    width: 1920,
    height: 1080,
  },
  widgets: [],
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [canvasData, setCanvasData] = useState<CanvasData>(defaultCanvasData);

  // Load canvas data on initial mount
  useEffect(() => {
    loadCanvas();
  }, []);

  // Auto-save when canvas data changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCanvas();
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [canvasData]);

  const loadCanvas = async () => {
    try {
      console.log('Loading canvas state...');
      const loadedData = await invoke<CanvasData>('load_canvas_state');
      console.log('Loaded canvas state:', loadedData);
      setCanvasData(loadedData);
    } catch (error) {
      console.error('Error loading canvas:', error);
    }
  };

  const saveCanvas = async () => {
    try {
      console.log('Saving canvas state...');
      await invoke('save_canvas_state', { canvasData });
      console.log('Canvas state saved successfully');
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  };

  const updateWidget = (updatedWidget: Widget) => {
    setCanvasData((prev) => ({
      ...prev,
      widgets: prev.widgets.map((widget) =>
        widget.id === updatedWidget.id ? updatedWidget : widget
      ),
    }));
  };

  const addWidget = (widget: Widget) => {
    setCanvasData((prev) => ({
      ...prev,
      widgets: [...prev.widgets, widget],
    }));
  };

  const removeWidget = (widgetId: string) => {
    setCanvasData((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((widget) => widget.id !== widgetId),
    }));
  };

  const updateSettings = (newSettings: Partial<CanvasSettings>) => {
    setCanvasData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const setTheme = (theme: string) => {
    setCanvasData((prev) => ({
      ...prev,
      theme,
    }));
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasData,
        updateWidget,
        addWidget,
        removeWidget,
        updateSettings,
        setTheme,
        saveCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}; 