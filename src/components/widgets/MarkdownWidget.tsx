import React, { useState, useCallback, useMemo, memo, useEffect, MouseEvent } from 'react'
import { FileText, Calendar, Eye, Edit2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkMath from 'remark-math'
import { MarkdownNote } from '../../types'

interface MarkdownWidgetProps {
  note: MarkdownNote
  onUpdate: (updates: Partial<MarkdownNote>) => void
  onDelete: () => void
}

// Memoized header component
const WidgetHeader = memo(({ 
  title, 
  isPreview, 
  onTitleChange, 
  onTogglePreview 
}: { 
  title: string
  isPreview: boolean
  onTitleChange: (value: string) => void
  onTogglePreview: () => void
}) => {
  const handlePreviewClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onTogglePreview()
  }

  return (
    <div className="card-header">
      <div className="card-title">
        <FileText size={18} />
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Note"
          className="note-title-input"
          data-grid-drag-handle="false"
        />
      </div>
      <button 
        className="preview-button"
        onClick={handlePreviewClick}
        title={isPreview ? 'Switch to edit mode (Ctrl+E)' : 'Switch to preview mode (Ctrl+P)'}
        data-grid-drag-handle="false"
      >
        {isPreview ? (
          <>
            <Edit2 size={14} style={{ marginRight: '4px' }} />
            Edit
          </>
        ) : (
          <>
            <Eye size={14} style={{ marginRight: '4px' }} />
            Preview
          </>
        )}
      </button>
    </div>
  )
})

// Memoized metadata component
const MetaInfo = memo(({ created }: { created: string }) => {
  const formattedDate = useMemo(() => new Date(created).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }), [created])

  return (
    <div className="meta-info">
      <span>
        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
        Created: {formattedDate}
      </span>
      <span className="meta-tag">markdown</span>
    </div>
  )
})

// Memoized preview component
const MarkdownPreview = memo(({ content }: { content: string }) => (
  <div className="preview prose prose-invert max-w-none">
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
  </div>
))

// Memoized editor component
const MarkdownEditor = memo(({ 
  content, 
  onChange 
}: { 
  content: string
  onChange: (value: string) => void
}) => (
  <textarea
    className="editor"
    value={content}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Write your markdown here... 

Supports:
- LaTeX: $E = mc^2$
- Code blocks: ```python
print('Hello')
```"
  />
))

export function MarkdownWidget({ note, onUpdate, onDelete }: MarkdownWidgetProps) {
  const [isPreview, setIsPreview] = useState(false)

  // Memoized callback handlers
  const handleTitleChange = useCallback((value: string) => {
    onUpdate({ title: value })
  }, [onUpdate])

  const handleContentChange = useCallback((value: string) => {
    onUpdate({ content: value })
  }, [onUpdate])

  const togglePreview = useCallback(() => {
    setIsPreview(prev => !prev)
  }, [])

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle keyboard shortcuts if we're not in an input or textarea
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'p') {
        e.preventDefault()
        e.stopPropagation()
        setIsPreview(true)
      } else if (e.key === 'e') {
        e.preventDefault()
        e.stopPropagation()
        setIsPreview(false)
      }
    }
  }, [])

  // Setup keyboard listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle mouse down for drag behavior
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Only allow dragging when clicking on the card background
    // Prevent dragging when clicking on interactive elements
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('.preview') ||
      target.closest('.meta-info') ||
      target.closest('.card-title')
    ) {
      e.stopPropagation()
    }
  }, [])

  return (
    <div className="card" onMouseDown={handleMouseDown}>
      <WidgetHeader
        title={note.title}
        isPreview={isPreview}
        onTitleChange={handleTitleChange}
        onTogglePreview={togglePreview}
      />
      <div className="card-content">
        <MetaInfo created={note.created} />
        {isPreview ? (
          <MarkdownPreview content={note.content} />
        ) : (
          <MarkdownEditor
            content={note.content}
            onChange={handleContentChange}
          />
        )}
      </div>
    </div>
  )
} 