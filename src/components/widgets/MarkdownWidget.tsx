import { useState } from 'react'
import { FileText, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkMath from 'remark-math'

interface MarkdownWidgetProps {
  markdown: string
  setMarkdown: (value: string) => void
}

export function MarkdownWidget({ markdown, setMarkdown }: MarkdownWidgetProps) {
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
          <span>
            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> 
            Created: {currentDate}
          </span>
          <span className="meta-tag">markdown</span>
        </div>
        {isPreview ? (
          <div className="preview prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
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