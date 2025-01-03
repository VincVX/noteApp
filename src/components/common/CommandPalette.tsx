import { useState } from 'react'
import { Type, CheckSquare, Book, Music, Image, Search } from 'lucide-react'
import { Widget } from '../../types'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onAddWidget: (type: Widget['widget_type']) => void
}

interface WidgetOption {
  type: Widget['widget_type']
  label: string
  icon: JSX.Element
}

export function CommandPalette({ isOpen, onClose, onAddWidget }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const widgetOptions: WidgetOption[] = [
    { type: 'markdown', label: 'Markdown Note', icon: <Type size={16} /> },
    { type: 'todo', label: 'Todo List', icon: <CheckSquare size={16} /> },
    { type: 'book', label: 'Book', icon: <Book size={16} /> },
    { type: 'spotify', label: 'Spotify', icon: <Music size={16} /> },
    { type: 'photo', label: 'Photo', icon: <Image size={16} /> },
  ]

  const suggestions = search.trim()
    ? widgetOptions.filter(option => 
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.type.toLowerCase().includes(search.toLowerCase())
      )
    : widgetOptions

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
          onAddWidget(suggestions[selectedIndex].type)
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="w-[500px] bg-[#1a1a1a] rounded-xl shadow-lg border border-white/[0.05] overflow-hidden">
        <div className="command-input-wrapper p-3 border-b border-white/[0.05] flex items-center gap-2">
          <Search size={16} className="text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search widgets..."
            className="flex-1 bg-transparent border-none text-white/90 placeholder-white/40 focus:outline-none text-sm"
            autoFocus
          />
        </div>
        <div className="command-list max-h-[300px] overflow-y-auto">
          {suggestions.map((option, index) => (
            <div
              key={option.type}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/[0.02] ${
                index === selectedIndex ? 'bg-white/[0.05]' : ''
              }`}
              onClick={() => {
                onAddWidget(option.type)
                onClose()
              }}
            >
              {option.icon}
              <span className="text-white/90 text-sm">{option.label}</span>
            </div>
          ))}
          {suggestions.length === 0 && (
            <div className="px-3 py-4 text-white/40 text-sm text-center">
              No widgets found
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 