import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { Menu, X } from 'lucide-react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import './App.css'

import { Widget, Layout } from './types'
import { MarkdownWidget, TodoWidget, BookWidget } from './components/widgets'
import { Sidebar } from './components/sidebar/Sidebar'
import { SettingsPage } from './components/settings/SettingsPage'
import { ThemeProvider } from './contexts/ThemeContext'

const ResponsiveGridLayout = WidthProvider(Responsive)

function AppContent() {
  const [markdown, setMarkdown] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')

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
  }

  const onLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts(allLayouts)
  }

  const onBreakpointChange = (newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint)
  }

  const autoArrangeLayouts = () => {
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
  }

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
      />

      {isSettingsOpen && (
        <SettingsPage onClose={() => setIsSettingsOpen(false)} />
      )}

      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="container">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
            rowHeight={100}
            margin={[20, 20]}
            onLayoutChange={onLayoutChange}
            onBreakpointChange={onBreakpointChange}
            draggableHandle=".card-header"
            resizeHandles={['se']}
            useCSSTransforms={true}
            preventCollision={false}
            compactType={null}
          >
            {widgets.map(widget => (
              <div key={widget.id}>
                {widget.type === 'markdown' && (
                  <MarkdownWidget markdown={markdown} setMarkdown={setMarkdown} />
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
