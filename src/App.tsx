import { useState, useEffect } from 'react'
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

const HEADER_HEIGHT = 200 // Height in pixels for the header image region
const GRID_COLS = 12 // Fixed number of columns

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [markdownNotes, setMarkdownNotes] = useState<{ [key: string]: MarkdownNote }>({})
  const [layout, setLayout] = useState<Layout[]>([])
  const [isLayoutLocked, setIsLayoutLocked] = useState(false)
  const { headerImage, showHeaderImage } = useTheme()

  const getDefaultLayout = (id: string, type: Widget['type']): Layout => {
    const isMarkdown = type === 'markdown'
    return {
      i: id,
      x: 0,
      y: showHeaderImage ? HEADER_HEIGHT / 50 : 0,
      w: isMarkdown ? 4 : 3,
      h: isMarkdown ? 8 : 6,
      minW: isMarkdown ? 4 : 3,
      minH: isMarkdown ? 6 : 4,
    }
  }

  const addWidget = (type: Widget['type']) => {
    const id = Date.now().toString()
    const newWidget = { id, type }
    setWidgets([...widgets, newWidget])
    
    // Add the new widget's layout
    const newLayout = getDefaultLayout(id, type)
    setLayout([...layout, newLayout])

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

  const updateMarkdownNote = (id: string, updates: Partial<MarkdownNote>) => {
    setMarkdownNotes(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }))
  }

  const onLayoutChange = (newLayout: Layout[]) => {
    if (showHeaderImage) {
      const headerRegionHeight = HEADER_HEIGHT / 50
      const adjustedLayout = newLayout.map(item => {
        if (item.y < headerRegionHeight) {
          return { ...item, y: headerRegionHeight }
        }
        return item
      })
      setLayout(adjustedLayout)
    } else {
      setLayout(newLayout)
    }
  }

  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id))
    if (markdownNotes[id]) {
      const newMarkdownNotes = { ...markdownNotes }
      delete newMarkdownNotes[id]
      setMarkdownNotes(newMarkdownNotes)
    }
    setLayout(layout.filter(item => item.i !== id))
  }

  const autoArrangeLayouts = () => {
    if (isLayoutLocked) return

    const newLayout = widgets.map((widget, index) => {
      const isMarkdown = widget.type === 'markdown'
      const w = isMarkdown ? 4 : 3
      const h = isMarkdown ? 8 : 6
      const itemsPerRow = Math.floor(GRID_COLS / w)
      const x = (index % itemsPerRow) * w
      const y = Math.floor(index / itemsPerRow) * h + (showHeaderImage ? HEADER_HEIGHT / 50 : 0)

      return {
        i: widget.id,
        x,
        y,
        w,
        h,
        minW: isMarkdown ? 4 : 3,
        minH: isMarkdown ? 6 : 4,
      }
    })

    setLayout(newLayout)
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
            rowHeight={50}
            margin={[20, 20]}
            containerPadding={[20, 20]}
            onLayoutChange={(_, layouts) => onLayoutChange(layouts.lg)}
            draggableHandle=".card-header"
            resizeHandles={isLayoutLocked ? [] : ['se']}
            isDraggable={!isLayoutLocked}
            isResizable={!isLayoutLocked}
            useCSSTransforms={true}
            preventCollision={true}
            compactType={null}
            isBounded={true}
            allowOverlap={false}
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
        onAutoArrange={autoArrangeLayouts}
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
