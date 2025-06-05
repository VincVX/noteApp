import { useState, useEffect } from 'react'
import { Type, CheckSquare, Book, Music, Image, Search, Layout, Hash, Plus } from 'lucide-react'
import { Widget } from '../../types'

interface BaseCommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

interface WidgetCommandPaletteProps extends BaseCommandPaletteProps {
  mode: 'widget'
  onAddWidget: (type: Widget['widget_type']) => void
}

interface TagCommandPaletteProps extends BaseCommandPaletteProps {
  mode: 'tag'
  onSelect: (tag: string) => void
  existingTags: string[]
}

type CommandPaletteProps = WidgetCommandPaletteProps | TagCommandPaletteProps

interface WidgetOption {
  type: Widget['widget_type']
  label: string
  icon: JSX.Element
}

export function CommandPalette(props: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const widgetOptions: WidgetOption[] = [
    { type: 'markdown', label: 'Markdown Note', icon: <Type size={16} /> },
    { type: 'todo', label: 'Todo List', icon: <CheckSquare size={16} /> },
    { type: 'book', label: 'Book', icon: <Book size={16} /> },
    { type: 'spotify', label: 'Spotify', icon: <Music size={16} /> },
    { type: 'photo', label: 'Photo', icon: <Image size={16} /> },
    { type: 'kanban', label: 'Kanban Board', icon: <Layout size={16} /> },
  ]

  const suggestions = search.trim()
    ? props.mode === 'widget'
      ? widgetOptions.filter(option =>
          option.label.toLowerCase().includes(search.toLowerCase()) ||
          option.type.toLowerCase().includes(search.toLowerCase())
        )
      : props.existingTags.filter(tag =>
          tag.toLowerCase().includes(search.toLowerCase())
        )
    : props.mode === 'widget'
      ? widgetOptions
      : props.existingTags

  useEffect(() => {
    if (suggestions.length === 0) {
      setSelectedIndex(0)
    }
  }, [suggestions.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (props.mode === 'tag' && search.trim() && suggestions.length === 0 && e.key === 'Enter') {
      e.preventDefault()
      props.onSelect(search.trim())
      props.onClose()
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (suggestions.length > 0) {
          setSelectedIndex(i => (i + 1) % suggestions.length)
        } else {
          setSelectedIndex(0)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (suggestions.length > 0) {
          setSelectedIndex(i => (i - 1 + suggestions.length) % suggestions.length)
        } else {
          setSelectedIndex(0)
        }
        break
      case 'Enter':
        e.preventDefault()
        if (suggestions.length > 0 && suggestions[selectedIndex]) {
          if (props.mode === 'widget') {
            props.onAddWidget((suggestions[selectedIndex] as WidgetOption).type)
          } else {
            props.onSelect(suggestions[selectedIndex] as string)
          }
          props.onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        props.onClose()
        break
    }
  }

  if (!props.isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="w-[500px] bg-[#1a1a1a] rounded-xl shadow-lg border border-white/[0.05] overflow-hidden">
        <div className="command-input-wrapper p-3 border-b border-white/[0.05] flex items-center gap-2">
          <Search size={16} className="text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={props.mode === 'widget' ? "Search widgets..." : "Search tags..."}
            className="flex-1 bg-transparent border-none text-white/90 placeholder-white/40 focus:outline-none text-sm"
            autoFocus
          />
        </div>
        <div className="command-list max-h-[300px] overflow-y-auto">
          {suggestions.map((option, index) => (
            <div
              key={props.mode === 'widget' ? (option as WidgetOption).type : option as string}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/[0.02] ${
                index === selectedIndex ? 'bg-white/[0.05]' : ''
              }`}
              onClick={() => {
                if (props.mode === 'widget') {
                  props.onAddWidget((option as WidgetOption).type)
                } else {
                  props.onSelect(option as string)
                }
                props.onClose()
              }}
            >
              {props.mode === 'widget' ? (
                <>
                  {(option as WidgetOption).icon}
                  <span className="text-white/90 text-sm">{(option as WidgetOption).label}</span>
                </>
              ) : (
                <>
                  <Hash size={16} />
                  <span className="text-white/90 text-sm">{option as string}</span>
                </>
              )}
            </div>
          ))}
          {suggestions.length === 0 && props.mode === 'tag' && search.trim() && (
            <div
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/[0.02] bg-white/[0.05]"
              onClick={() => {
                props.onSelect(search.trim())
                props.onClose()
              }}
            >
              <Plus size={16} />
              <span className="text-white/90 text-sm">Add tag "{search.trim()}"</span>
            </div>
          )}
          {(suggestions.length === 0 && (props.mode !== 'tag' || !search.trim())) && (
            <div className="px-3 py-4 text-white/40 text-sm text-center">
              {props.mode === 'widget' ? 'No widgets found' : 'No tags found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 