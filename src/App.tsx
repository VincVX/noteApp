import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Menu, X } from 'lucide-react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import './App.css'

import { Widget, Layout, MarkdownNote } from './types'
import { MarkdownWidget, TodoWidget, BookWidget } from './components/widgets'
import { Sidebar } from './components/sidebar/Sidebar'
import { SettingsPage } from './components/settings/SettingsPage'
import { ThemeProvider } from './contexts/ThemeContext'

const ResponsiveGridLayout = WidthProvider(Responsive)

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [markdownNotes, setMarkdownNotes] = useState<{ [key: string]: MarkdownNote }>({})
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')
  const [isLayoutLocked, setIsLayoutLocked] = useState(false)
  const [lockedLayout, setLockedLayout] = useState<Layout[] | null>(null)

  const getDefaultLayout = (id: string, type: Widget['type']): Layout => {
    const isMarkdown = type === 'markdown'
    return {
      i: id,
      x: 0,
      y: Infinity,
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
    if (!isLayoutLocked) {
      setLayouts(allLayouts)
      // Update locked layout if we're about to lock
      if (lockedLayout === null) {
        setLockedLayout(currentLayout)
      }
    }
  }

  const onBreakpointChange = (newBreakpoint: string) => {
    if (!isLayoutLocked) {
      setCurrentBreakpoint(newBreakpoint)
    }
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
    <>
      <button 
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <Sidebar 
        isOpen={isSidebarOpen}
        onAddWidget={addWidget}
        onAutoArrange={autoArrangeLayouts}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLayoutLocked={isLayoutLocked}
        onToggleLayoutLock={toggleLayoutLock}
      />

      {isSettingsOpen && (
        <SettingsPage onClose={() => setIsSettingsOpen(false)} />
      )}

      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="container">
          <ResponsiveGridLayout
            className="layout"
            layouts={currentLayouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={100}
            margin={[20, 20]}
            onLayoutChange={onLayoutChange}
            onBreakpointChange={onBreakpointChange}
            draggableHandle=".card-header"
            resizeHandles={isLayoutLocked ? [] : ['se']}
            isDraggable={!isLayoutLocked}
            isResizable={!isLayoutLocked}
            useCSSTransforms={true}
            preventCollision={false}
            compactType={null}
          >
            {widgets.map(widget => (
              <div key={widget.id}>
                {widget.type === 'markdown' && markdownNotes[widget.id] && (
                  <MarkdownWidget 
                    key={widget.id}
                    note={markdownNotes[widget.id]}
                    onUpdate={(updates) => updateMarkdownNote(widget.id, updates)}
                  />
                )}
                {widget.type === 'todo' && (
                  <TodoWidget />
                )}
                {widget.type === 'book' && (
                  <BookWidget />
                )}
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </div>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
