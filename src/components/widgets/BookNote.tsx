import { useState } from 'react'
import { Calendar, Hash, Plus, Book } from 'lucide-react'
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
  isOverlay?: boolean
}

export function BookNote({ note, onUpdate, existingTags, isOverlay = false }: BookNoteProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isSideBySide, setIsSideBySide] = useState(false)
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

  const renderContent = () => {
    if (isSideBySide) {
      return (
        <div className="grid grid-cols-2 gap-4 h-[calc(100%-8rem)] overflow-hidden p-2">
          <textarea
            className="w-full h-full bg-white/[0.02] text-white/90 border border-white/[0.05] rounded-lg p-4 font-mono text-sm leading-relaxed resize-none transition-all duration-200 focus:outline-none focus:border-white/10 focus:bg-white/[0.03]"
            value={note.content}
            onChange={(e) => onUpdate({ ...note, content: e.target.value })}
            placeholder="Write your note..."
          />
          <div className="h-full overflow-y-auto p-4 bg-white/[0.01] border border-white/[0.05] rounded-lg text-sm leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </div>
      )
    }

    return isPreview ? (
      <div className="bg-white/[0.02] text-white/90 border border-white/[0.05] rounded-lg p-4 overflow-y-auto min-h-[300px] leading-relaxed prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {note.content}
        </ReactMarkdown>
      </div>
    ) : (
      <textarea
        className="w-full min-h-[300px] bg-white/[0.02] text-white/90 border border-white/[0.05] rounded-lg p-4 font-mono text-sm leading-relaxed resize-none transition-all duration-200 focus:outline-none focus:border-white/10 focus:bg-white/[0.03]"
        value={note.content}
        onChange={(e) => onUpdate({ ...note, content: e.target.value })}
        placeholder="Write your note..."
      />
    )
  }

  return (
    <div className={isOverlay ? 'p-6 pr-16 h-full flex flex-col' : 'p-4'}>
      <div className="flex items-center justify-between mb-4 pr-10">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate({ ...note, title: e.target.value })}
          placeholder="Note title..."
          className="bg-transparent border-none text-white/90 text-2xl font-medium w-full mr-4 transition-colors duration-200 focus:outline-none focus:text-white"
        />
        <div className="flex gap-2">
          <button 
            className="bg-white/[0.05] text-white/80 border-none px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10 flex items-center gap-1.5 h-8"
            onClick={() => setIsSideBySide(!isSideBySide)}
            title="Toggle side-by-side view"
          >
            <Book size={16} />
          </button>
          {!isSideBySide && (
            <button 
              className="bg-white/[0.05] text-white/80 border-none px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10 flex items-center gap-1.5 h-8"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4 text-white/40 text-sm">
        <span className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {formattedDate}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {note.tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-white/[0.06] px-2.5 py-1 rounded-lg text-sm text-white/80 transition-all duration-200 hover:bg-white/10">
            <Hash size={12} />
            {tag}
            <button 
              className="bg-transparent border-none text-white/40 cursor-pointer px-1 rounded hover:text-white/90 hover:bg-white/10 ml-1 transition-all duration-200"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
        <button 
          className="flex items-center gap-1 bg-transparent border border-dashed border-white/20 text-white/60 px-2.5 py-1 rounded-lg cursor-pointer text-sm transition-all duration-200 hover:border-white/40 hover:text-white/90 hover:bg-white/[0.02]"
          onClick={() => setIsCommandOpen(true)}
        >
          <Plus size={14} />
          Add Tag
        </button>
      </div>
      {renderContent()}
      {isCommandOpen && (
        <CommandPalette
          mode="tag"
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          onSelect={addTag}
          existingTags={existingTags}
        />
      )}
    </div>
  )
} 