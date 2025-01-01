import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Menu, X } from 'lucide-react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import './App.css'

import { Widget, Layout, MarkdownNote } from './types'
import { MarkdownWidget, TodoWidget, BookWidget, SpotifyWidget, PhotoWidget } from './components/widgets'
import { Sidebar } from './components/sidebar/Sidebar'
import { SettingsPage } from './components/settings/SettingsPage'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { SpotifyProvider } from './contexts/SpotifyContext'

const GridLayout = WidthProvider(Responsive)

const HEADER_HEIGHT = 75
const GRID_COLS = 12
const GRID_ROW_HEIGHT = 50
const HEADER_MARGIN = 5

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [markdownNotes, setMarkdownNotes] = useState<{ [key: string]: MarkdownNote }>({})
  const [layout, setLayout] = useState<Layout[]>([])
  const [isLayoutLocked, setIsLayoutLocked] = useState(false)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const { headerImage, showHeaderImage } = useTheme()

  // Calculate the next available position for a new widget
  const findNextPosition = (width: number, height: number) => {
    const headerGridUnits = showHeaderImage ? Math.ceil((HEADER_HEIGHT + HEADER_MARGIN) / GRID_ROW_HEIGHT) : 0
    
    if (layout.length === 0) {
      return { x: 0, y: headerGridUnits }
    }

    // Try to find space in the current row first
    const currentRowY = Math.max(...layout.map(item => item.y))
    const itemsInCurrentRow = layout.filter(item => item.y === currentRowY)
    const lastItemInRow = itemsInCurrentRow[itemsInCurrentRow.length - 1]
    
    if (lastItemInRow && (lastItemInRow.x + lastItemInRow.w + width) <= GRID_COLS) {
      // There's space in the current row
      return { x: lastItemInRow.x + lastItemInRow.w, y: currentRowY }
    }

    // Start a new row
    const maxY = Math.max(...layout.map(item => item.y + item.h))
    return { x: 0, y: Math.max(maxY, headerGridUnits) }
  }

  const addWidget = (type: Widget['type']) => {
    const id = Date.now().toString()
    const isMarkdown = type === 'markdown'
    const width = isMarkdown ? 4 : 3
    const height = isMarkdown ? 8 : 6

    const position = findNextPosition(width, height)
    const newLayout: Layout = {
      i: id,
      ...position,
      w: width,
      h: height,
      minW: width,
      minH: height
    }

    setWidgets(prev => [...prev, { id, type }])
    setLayout(prev => [...prev, newLayout])

    if (type === 'markdown') {
      setMarkdownNotes(prev => ({
        ...prev,
        [id]: {
          id,
          title: 'Untitled Note',
          content: '',
          created: new Date().toISOString()
        }
      }))
    }
  }

  const onLayoutChange = (newLayout: Layout[]) => {
    const headerGridUnits = showHeaderImage ? Math.ceil((HEADER_HEIGHT + HEADER_MARGIN) / GRID_ROW_HEIGHT) : 0

    // Always enforce the strict top boundary
    const adjustedLayout = newLayout.map(item => ({
      ...item,
      // Force y position to be exactly headerGridUnits if it's close to it
      y: item.y <= headerGridUnits + 0.5 ? headerGridUnits : item.y,
      // Round x position in grid mode
      x: snapToGrid ? Math.round(item.x) : item.x
    }))

    setLayout(adjustedLayout)
  }

  const deleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id))
    setLayout(prev => prev.filter(item => item.i !== id))
    if (markdownNotes[id]) {
      const newMarkdownNotes = { ...markdownNotes }
      delete newMarkdownNotes[id]
      setMarkdownNotes(newMarkdownNotes)
    }
  }

  const updateMarkdownNote = (id: string, updates: Partial<MarkdownNote>) => {
    setMarkdownNotes(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }))
  }

  const toggleSnapToGrid = () => {
    setSnapToGrid(!snapToGrid)
    if (!snapToGrid) {
      onLayoutChange(layout)
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
          }}
        />
      )}

      <div className="main-content">
        <div className="canvas">
          <GridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: GRID_COLS }}
            rowHeight={GRID_ROW_HEIGHT}
            width={1200}
            margin={snapToGrid ? [20, 20] : [0, 0]}
            containerPadding={[20, 20]}
            onLayoutChange={() => {}}
            onDragStop={(layout) => onLayoutChange(layout)}
            onResizeStop={(layout) => onLayoutChange(layout)}
            draggableHandle=".card-header"
            resizeHandles={isLayoutLocked ? [] : ['se']}
            isDraggable={!isLayoutLocked}
            isResizable={!isLayoutLocked}
            useCSSTransforms={false}
            preventCollision={snapToGrid}
            compactType={null}
            allowOverlap={!snapToGrid}
          >
            {widgets.map(widget => (
              <div key={widget.id} className="widget-container">
                <button 
                  className="widget-delete-btn" 
                  onClick={() => deleteWidget(widget.id)}
                  aria-label="Delete widget"
                >
                  <X size={16} />
                </button>
                {widget.type === 'markdown' && (
                  <MarkdownWidget
                    key={widget.id}
                    note={markdownNotes[widget.id]}
                    onUpdate={(updates) => updateMarkdownNote(widget.id, updates)}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.type === 'todo' && (
                  <TodoWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.type === 'book' && (
                  <BookWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.type === 'spotify' && (
                  <SpotifyWidget
                    key={widget.id}
                    onDelete={() => deleteWidget(widget.id)}
                  />
                )}
                {widget.type === 'photo' && (
                  <PhotoWidget
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
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SpotifyProvider>
        <AppContent />
      </SpotifyProvider>
    </ThemeProvider>
  )
}

export default App
