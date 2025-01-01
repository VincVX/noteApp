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

const ResponsiveGridLayout = WidthProvider(Responsive)

const HEADER_HEIGHT = 200 // Height in pixels for the header image region

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [markdownNotes, setMarkdownNotes] = useState<{ [key: string]: MarkdownNote }>({})
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')
  const [isLayoutLocked, setIsLayoutLocked] = useState(false)
  const [lockedLayout, setLockedLayout] = useState<Layout[] | null>(null)
  const { headerImage, showHeaderImage } = useTheme()

  const getDefaultLayout = (id: string, type: Widget['type']): Layout => {
    const isMarkdown = type === 'markdown'
    return {
      i: id,
      x: 0,
      y: showHeaderImage ? HEADER_HEIGHT / 50 : 0,
      w: isMarkdown ? 2 : 1,
      h: isMarkdown ? 8 : 6,
    }
  }

  const addWidget = (type: Widget['type']) => {
    const id = Date.now().toString()
    const newWidget = { id, type }
    setWidgets([...widgets, newWidget])
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

  const onLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    if (showHeaderImage) {
      const headerRegionHeight = HEADER_HEIGHT / 50
      const adjustedLayout = currentLayout.map(item => {
        if (item.y < headerRegionHeight) {
          return { ...item, y: headerRegionHeight }
        }
        return item
      })
      setLayouts({ ...allLayouts, [currentBreakpoint]: adjustedLayout })
    } else {
      setLayouts({ ...allLayouts, [currentBreakpoint]: currentLayout })
    }
  }

  const onBreakpointChange = (newBreakpoint: string) => {
    if (!isLayoutLocked) {
      setCurrentBreakpoint(newBreakpoint)
    }
  }

  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id))
    if (markdownNotes[id]) {
      const newMarkdownNotes = { ...markdownNotes }
      delete newMarkdownNotes[id]
      setMarkdownNotes(newMarkdownNotes)
    }
    // Remove from layouts
    const newLayouts = { ...layouts }
    Object.keys(newLayouts).forEach(breakpoint => {
      newLayouts[breakpoint] = newLayouts[breakpoint].filter(layout => layout.i !== id)
    })
    setLayouts(newLayouts)
  }

  const autoArrangeLayouts = () => {
    if (isLayoutLocked) return

    const cols = {
      lg: 4,
      md: 3,
      sm: 2,
      xs: 1,
      xxs: 1
    }[currentBreakpoint] || 4

    const newLayouts = widgets.map((widget, index) => {
      const isMarkdown = widget.type === 'markdown'
      const w = isMarkdown ? Math.min(2, cols) : 1
      const x = (index % cols) * w
      const y = Math.floor(index / cols) * (isMarkdown ? 8 : 6)

      return {
        i: widget.id,
        x,
        y,
        w,
        h: isMarkdown ? 8 : 6
      }
    })

    setLayouts({
      ...layouts,
      [currentBreakpoint]: newLayouts
    })
    setLockedLayout(newLayouts)
  }

  const toggleLayoutLock = () => {
    const newIsLocked = !isLayoutLocked
    setIsLayoutLocked(newIsLocked)
    
    if (newIsLocked) {
      // When locking, store current layout
      const currentLayout = layouts[currentBreakpoint] || []
      setLockedLayout(currentLayout)
    } else {
      // When unlocking, keep the current layout but allow changes
      setLockedLayout(null)
    }
  }

  // When locked, use a single breakpoint layout
  const currentLayouts = isLayoutLocked && lockedLayout ? 
    { lg: lockedLayout } :
    layouts

  // When locked, use only the largest breakpoint
  const breakpoints = isLayoutLocked ? 
    { lg: 0, md: 0, sm: 0, xs: 0, xxs: 0 } : 
    { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }

  // When locked, use single column configuration
  const cols = isLayoutLocked ? 
    { lg: 4, md: 4, sm: 4, xs: 4, xxs: 4 } : 
    { lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }

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
          <ResponsiveGridLayout
            className="layout"
            layouts={currentLayouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={50}
            margin={[20, 20]}
            onLayoutChange={onLayoutChange}
            onBreakpointChange={onBreakpointChange}
            draggableHandle=".card-header"
            resizeHandles={isLayoutLocked ? [] : ['se']}
            isDraggable={!isLayoutLocked}
            isResizable={!isLayoutLocked}
            useCSSTransforms={true}
            preventCollision={false}
            compactType="vertical"
            containerPadding={[20, 20]}
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
          </ResponsiveGridLayout>
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
