import { Type, CheckSquare, Book, LayoutGrid, Settings, Lock, Music, Image } from 'lucide-react'
import { Widget } from '../../types'

interface SidebarProps {
  isOpen: boolean
  onAddWidget: (type: Widget['type']) => void
  onAutoArrange: () => void
  onOpenSettings: () => void
  isLayoutLocked: boolean
  onToggleLayoutLock: () => void
}

export function Sidebar({ isOpen, onAddWidget, onAutoArrange, onOpenSettings, isLayoutLocked, onToggleLayoutLock }: SidebarProps) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <div>
          <h2>Add Widgets</h2>
          <div className="widget-list">
            <button className="add-widget-button" onClick={() => onAddWidget('markdown')}>
              <Type size={16} /> Add Markdown Note
            </button>
            <button className="add-widget-button" onClick={() => onAddWidget('todo')}>
              <CheckSquare size={16} /> Add Todo List
            </button>
            <button className="add-widget-button" onClick={() => onAddWidget('book')}>
              <Book size={16} /> Add Book
            </button>
            <button className="add-widget-button" onClick={() => onAddWidget('spotify')}>
              <Music size={16} /> Add Spotify
            </button>
            <button className="add-widget-button" onClick={() => onAddWidget('photo')}>
              <Image size={16} /> Add Photo
            </button>
          </div>
        </div>
        <div>
          <h2>Layout</h2>
          <button className="add-widget-button" onClick={onAutoArrange}>
            <LayoutGrid size={16} /> Auto Arrange
          </button>
          <button 
            className={`add-widget-button ${isLayoutLocked ? 'active' : ''}`} 
            onClick={onToggleLayoutLock}
          >
            <Lock size={16} /> {isLayoutLocked ? 'Unlock Sizes' : 'Lock Sizes'}
          </button>
        </div>
        <div>
          <h2>Application</h2>
          <button className="add-widget-button" onClick={onOpenSettings}>
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>
    </div>
  )
} 