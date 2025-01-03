import { useState, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Menu, X } from 'lucide-react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import './App.css'

import { Widget, Layout, MarkdownNote } from './types'
import { MarkdownWidget, TodoWidget, BookWidget, SpotifyWidget, PhotoWidget, KanbanWidget } from './components/widgets'
import { Sidebar } from './components/sidebar/Sidebar'
import { SettingsPage } from './components/settings/SettingsPage'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { SpotifyProvider } from './contexts/SpotifyContext'
import { CanvasProvider, useCanvas } from './contexts/CanvasContext'
import { CommandPalette } from './components/common/CommandPalette'

const GridLayout = WidthProvider(Responsive)

const HEADER_HEIGHT = 75
const GRID_COLS = 12
const GRID_ROW_HEIGHT = 50
const HEADER_MARGIN = 5

// Helper function to convert Widget to Layout
const widgetToLayout = (widget: Widget): Layout => ({
  i: widget.id,
  x: widget.position.x,
  y: widget.position.y,
  w: widget.size.width,
  h: widget.size.height,
  minW: 2,
  minH: 2
})

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLayoutLocked, setIsLayoutLocked] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const { headerImage, showHeaderImage } = useTheme()
  const { canvasData, updateWidget, addWidget: addCanvasWidget, removeWidget, updateSettings } = useCanvas()
  const { widgets, settings } = canvasData

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Option (Alt) + Space
      if (e.altKey && e.code === 'Space') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Calculate the next available position for a new widget
  const findNextPosition = (width: number, height: number) => {
    const headerGridUnits = showHeaderImage ? Math.ceil((HEADER_HEIGHT + HEADER_MARGIN) / GRID_ROW_HEIGHT) : 0
    
    if (widgets.length === 0) {
      return { x: 0, y: headerGridUnits }
    }

    // Try to find space in the current row first
    const currentRowY = Math.max(...widgets.map(item => item.position.y))
    const itemsInCurrentRow = widgets.filter(item => item.position.y === currentRowY)
    const lastItemInRow = itemsInCurrentRow[itemsInCurrentRow.length - 1]
    
    if (lastItemInRow && (lastItemInRow.position.x + lastItemInRow.size.width + width) <= GRID_COLS) {
      // There's space in the current row
      return { x: lastItemInRow.position.x + lastItemInRow.size.width, y: currentRowY }
    }

    // Start a new row
    const maxY = Math.max(...widgets.map(item => item.position.y + item.size.height))
    return { x: 0, y: Math.max(maxY, headerGridUnits) }
  }

  const addWidget = (type: Widget['widget_type']) => {
    const id = crypto.randomUUID()
    const position = findNextPosition(4, 4)
    
    const newWidget = {
      id,
      widget_type: type,
      content: '',
      position: position,
      size: { width: 4, height: 4 },
      style: {},
      created: new Date().toISOString()
    }
    
    addCanvasWidget(newWidget)
  }

  const onLayoutChange = (newLayout: Layout[]) => {
    // Update widget positions and sizes based on the new layout
    newLayout.forEach(item => {
      const widget = widgets.find(w => w.id === item.i)
      if (widget) {
        updateWidget({
          ...widget,
          position: { x: item.x, y: item.y },
          size: { width: item.w, height: item.h }
        })
      }
    })
  }

  const deleteWidget = (id: string) => {
    removeWidget(id)
  }

  const updateMarkdownNote = (id: string, updates: Partial<MarkdownNote>) => {
    const widget = widgets.find(w => w.id === id)
    if (widget) {
      updateWidget({
        ...widget,
        content: updates.content || widget.content
      })
    }
  }

  const toggleSnapToGrid = () => {
    setSnapToGrid(!snapToGrid)
    if (!snapToGrid) {
      onLayoutChange(widgets.map(widgetToLayout))
    }
  }

  const toggleLayoutLock = () => {
    setIsLayoutLocked(!isLayoutLocked)
  }

  return (
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {showHeaderImage && headerImage && (
        <div 
          className="header-image"
          style={{ 
            height: HEADER_HEIGHT,
            backgroundImage: `url(${headerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            margin: '5px 20px 0 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            flexShrink: 0,
            width: 'calc(100% - 40px)',
            minWidth: '1160px'
          }}
        />
      )}

      <div className="main-content">
        <div className="canvas">
          <GridLayout
            className="layout"
            layouts={{ lg: widgets.map(widgetToLayout) }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: GRID_COLS }}
            rowHeight={GRID_ROW_HEIGHT}
            width={1200}
            isDraggable={!isLayoutLocked}
            isResizable={!isLayoutLocked}
            onLayoutChange={(layout) => onLayoutChange(layout)}
            margin={snapToGrid ? [20, 20] : [0, 0]}
            containerPadding={[20, 20]}
            onDragStop={(layout) => onLayoutChange(layout)}
            onResizeStop={(layout) => onLayoutChange(layout)}
            draggableHandle=".card-header"
            resizeHandles={isLayoutLocked ? [] : ['se']}
            useCSSTransforms={false}
            preventCollision={snapToGrid}
            compactType={null}
            allowOverlap={!snapToGrid}
          >
            {widgets.map((widget) => (
              <div key={widget.id} className="widget-container">
                <button
                  className="widget-delete-btn"
                  onClick={() => deleteWidget(widget.id)}
                  aria-label="Delete widget"
                >
                  <X size={16} />
                </button>
                {widget.widget_type === 'markdown' && (
                  <MarkdownWidget
                    key={widget.id}
                    note={{
                      id: widget.id,
                      title: widget.content || 'Untitled Note',
                      content: widget.content || '',
                      created: widget.created || new Date().toISOString()
                    }}
                    onUpdate={(updates) => updateMarkdownNote(widget.id, updates)}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.widget_type === 'todo' && (
                  <TodoWidget
                    key={widget.id}
                  />
                )}
                {widget.widget_type === 'book' && (
                  <BookWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.widget_type === 'spotify' && (
                  <SpotifyWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.widget_type === 'photo' && (
                  <PhotoWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.widget_type === 'kanban' && (
                  <KanbanWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
              </div>
            ))}
          </GridLayout>
        </div>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAddWidget={addWidget}
        onSnapToGrid={toggleSnapToGrid}
        isSnapToGridEnabled={snapToGrid}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLayoutLocked={isLayoutLocked}
        onToggleLayoutLock={toggleLayoutLock}
      />

      {isSettingsOpen && (
        <SettingsPage onClose={() => setIsSettingsOpen(false)} />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onAddWidget={addWidget}
      />
    </div>
  )
}

function App() {
  return (
    <CanvasProvider>
      <ThemeProvider>
        <SpotifyProvider>
          <AppContent />
        </SpotifyProvider>
      </ThemeProvider>
    </CanvasProvider>
  )
}

export default App
