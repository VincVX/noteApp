import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkMath from 'remark-math'
import { Menu, X, FileText, Calendar, CheckSquare, Plus, ListTodo, Type, LayoutGrid, Book, Hash, Search } from 'lucide-react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'
import './App.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

type Widget = {
  id: string
  type: 'markdown' | 'todo' | 'book'
  layout?: {
    x: number
    y: number
    w: number
    h: number
  }
}

type TodoItem = {
  id: string
  text: string
  completed: boolean
}

type Layout = {
  i: string
  x: number
  y: number
  w: number
  h: number
}

type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  created: string
}

function TodoWidget() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: newTodo.trim(), completed: false }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <ListTodo size={18} />
          Todo List
        </div>
      </div>
      <div className="card-content">
        <div className="todo-input-group">
          <input
            type="text"
            className="todo-input"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-todo-button" onClick={addTodo}>
            Add
          </button>
        </div>
        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <div
                className="todo-checkbox"
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && '✓'}
              </div>
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MarkdownWidget({ markdown, setMarkdown }: { markdown: string; setMarkdown: (value: string) => void }) {
  const [isPreview, setIsPreview] = useState(false)
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <FileText size={18} />
          Untitled Note
        </div>
        <button 
          className="preview-button"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      <div className="card-content">
        <div className="meta-info">
          <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Created: {currentDate}</span>
          <span className="meta-tag">markdown</span>
        </div>
        {isPreview ? (
          <div className="preview prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[
                rehypeKatex,
                rehypeHighlight
              ]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="editor"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write your markdown here... 
            
Supports:
- LaTeX: $E = mc^2$
- Code blocks: ```python
print('Hello')
```"
          />
        )}
      </div>
    </div>
  )
}

function CommandPalette({ 
  isOpen, 
  onClose, 
  onSelect, 
  existingTags 
}: { 
  isOpen: boolean
  onClose: () => void
  onSelect: (tag: string) => void
  existingTags: string[]
}) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const suggestions = search.trim()
    ? [...new Set([...existingTags, search])]
        .filter(tag => tag.toLowerCase().includes(search.toLowerCase()))
    : existingTags

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % suggestions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + suggestions.length) % suggestions.length)
        break
      case 'Enter':
        e.preventDefault()
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex])
          onClose()
        } else if (search.trim()) {
          onSelect(search.trim())
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="command-palette">
      <div className="command-input-wrapper">
        <Search size={16} />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search or create tag..."
          className="command-input"
        />
      </div>
      <div className="command-list">
        {suggestions.map((tag, index) => (
          <div
            key={tag}
            className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => {
              onSelect(tag)
              onClose()
            }}
          >
            <Hash size={16} />
            {tag}
          </div>
        ))}
        {search.trim() && !suggestions.includes(search.trim()) && (
          <div
            className={`command-item ${suggestions.length === selectedIndex ? 'selected' : ''}`}
            onClick={() => {
              onSelect(search.trim())
              onClose()
            }}
          >
            <Plus size={16} />
            Create "{search.trim()}"
          </div>
        )}
      </div>
    </div>
  )
}

function BookNote({ 
  note, 
  onUpdate, 
  existingTags 
}: { 
  note: Note
  onUpdate: (note: Note) => void
  existingTags: string[]
}) {
  const [isPreview, setIsPreview] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  const addTag = (tag: string) => {
    if (!note.tags.includes(tag)) {
      onUpdate({
        ...note,
        tags: [...note.tags, tag]
      })
    }
  }

  const removeTag = (tag: string) => {
    onUpdate({
      ...note,
      tags: note.tags.filter(t => t !== tag)
    })
  }

  return (
    <div className="book-note">
      <div className="note-header">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate({ ...note, title: e.target.value })}
          placeholder="Note title..."
          className="note-title-input"
        />
        <button 
          className="preview-button"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      <div className="note-tags">
        {note.tags.map(tag => (
          <span key={tag} className="note-tag">
            <Hash size={12} />
            {tag}
            <button className="tag-remove" onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
        <button className="add-tag-button" onClick={() => setIsCommandOpen(true)}>
          <Plus size={14} />
          Add Tag
        </button>
      </div>
      {isPreview ? (
        <div className="preview prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[
              rehypeKatex,
              rehypeHighlight
            ]}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="editor"
          value={note.content}
          onChange={(e) => onUpdate({ ...note, content: e.target.value })}
          placeholder="Write your note..."
        />
      )}
      {isCommandOpen && (
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          onSelect={addTag}
          existingTags={existingTags}
        />
      )}
    </div>
  )
}

function BookWidget() {
  const [notes, setNotes] = useState<Note[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      created: new Date().toISOString()
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ))
    // Update all tags
    const newTags = new Set(allTags)
    updatedNote.tags.forEach(tag => newTags.add(tag))
    setAllTags(Array.from(newTags))
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Book size={18} />
          Book
        </div>
        <button 
          className="preview-button"
          onClick={addNote}
        >
          <Plus size={16} /> New Note
        </button>
      </div>
      <div className="card-content">
        <div className="book-notes">
          {notes.map(note => (
            <BookNote
              key={note.id}
              note={note}
              onUpdate={updateNote}
              existingTags={allTags}
            />
          ))}
          {notes.length === 0 && (
            <div className="empty-notes">
              <p>No notes yet</p>
              <button className="add-note-button" onClick={addNote}>
                <Plus size={16} /> Create your first note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [markdown, setMarkdown] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')

  const getDefaultLayout = (id: string, type: Widget['type']): Layout => {
    const isMarkdown = type === 'markdown'
    return {
      i: id,
      x: 0,
      y: Infinity, // Places it at the bottom
      w: isMarkdown ? 2 : 1, // Markdown takes 2 columns
      h: isMarkdown ? 8 : 6, // Markdown is taller
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
    // Create a new layout with optimal positions
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

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div>
            <h2>Add Widgets</h2>
            <div className="widget-list">
              <button className="add-widget-button" onClick={() => addWidget('markdown')}>
                <Type size={16} /> Add Markdown Note
              </button>
              <button className="add-widget-button" onClick={() => addWidget('todo')}>
                <CheckSquare size={16} /> Add Todo List
              </button>
              <button className="add-widget-button" onClick={() => addWidget('book')}>
                <Book size={16} /> Add Book
              </button>
            </div>
          </div>
          <div>
            <h2>Layout</h2>
            <button className="add-widget-button" onClick={autoArrangeLayouts}>
              <LayoutGrid size={16} /> Auto Arrange
            </button>
          </div>
        </div>
      </div>

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

export default App
