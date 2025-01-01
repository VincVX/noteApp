import { useState } from 'react'
import { Hash, Plus, Search } from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (tag: string) => void
  existingTags: string[]
}

export function CommandPalette({ isOpen, onClose, onSelect, existingTags }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

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
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search or create tag..."
          className="command-input"
          autoFocus
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