import { useState } from 'react'
import { Calendar, Hash, Plus } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkMath from 'remark-math'
import { Note } from '../../types'
import { CommandPalette } from '../common/CommandPalette'

interface BookNoteProps {
  note: Note
  onUpdate: (note: Note) => void
  existingTags: string[]
}

export function BookNote({ note, onUpdate, existingTags }: BookNoteProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  const formattedDate = new Date(note.created).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

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
      <div className="note-meta">
        <span className="note-timestamp">
          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
          {formattedDate}
        </span>
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
            rehypePlugins={[rehypeKatex, rehypeHighlight]}
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