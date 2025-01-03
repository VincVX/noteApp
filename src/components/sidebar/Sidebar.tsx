import { Type, CheckSquare, Book, Settings, Lock, Music, Image, Grid } from 'lucide-react'
import { Widget } from '../../types'

interface SidebarProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onAddWidget: (type: Widget['widget_type']) => void
  readonly onSnapToGrid: () => void
  readonly isSnapToGridEnabled: boolean
  readonly onOpenSettings: () => void
  readonly isLayoutLocked: boolean
  readonly onToggleLayoutLock: () => void
}

export function Sidebar({ 
  isOpen, 
  onClose,
  onAddWidget, 
  onSnapToGrid,
  isSnapToGridEnabled,
  onOpenSettings, 
  isLayoutLocked, 
  onToggleLayoutLock 
}: SidebarProps) {
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
          <button 
            className={`add-widget-button ${isSnapToGridEnabled ? 'active' : ''}`} 
            onClick={onSnapToGrid}
          >
            <Grid size={16} /> {isSnapToGridEnabled ? 'Free Placement' : 'Snap to Grid'}
          </button>
          <button 
            className={`add-widget-button ${isLayoutLocked ? 'active' : ''}`} 
            onClick={onToggleLayoutLock}
          >
            <Lock size={16} /> {isLayoutLocked ? 'Unlock Layout' : 'Lock Layout'}
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