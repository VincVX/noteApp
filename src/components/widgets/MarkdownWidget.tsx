import { useState } from 'react'
import { FileText, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkMath from 'remark-math'
import { MarkdownNote } from '../../types'

interface MarkdownWidgetProps {
  note: MarkdownNote
  onUpdate: (updates: Partial<MarkdownNote>) => void
}

export function MarkdownWidget({ note, onUpdate }: MarkdownWidgetProps) {
  const [isPreview, setIsPreview] = useState(false)

  const formattedDate = new Date(note.created).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  })

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <FileText size={18} />
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Untitled Note"
            className="note-title-input"
          />
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
          <span>
            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
            Created: {formattedDate}
          </span>
          <span className="meta-tag">markdown</span>
        </div>
        {isPreview ? (
          <div className="preview prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="editor"
            value={note.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
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