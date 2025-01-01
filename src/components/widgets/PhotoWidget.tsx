import React, { useState, useRef } from 'react'
import { Image, Upload } from 'lucide-react'

interface PhotoWidgetProps {
  onDelete?: () => void
}

export const PhotoWidget: React.FC<PhotoWidgetProps> = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    if (imageUrl) {
      event.preventDefault()
      setContextMenuPosition({ x: event.clientX, y: event.clientY })
      setShowContextMenu(true)
    }
  }

  const handleClickOutside = () => {
    setShowContextMenu(false)
  }

  React.useEffect(() => {
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showContextMenu])

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <Image size={16} />
          Photo
        </div>
      </div>
      <div className="card-content">
        {!imageUrl ? (
          <div 
            className="photo-upload-area"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload size={24} />
            <p>Click to upload or drag and drop</p>
            <p className="photo-upload-hint">Supports: JPG, PNG, GIF</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div 
            className="photo-display"
            onContextMenu={handleContextMenu}
          >
            <img src={imageUrl} alt="Uploaded" className="photo-image" />
            {showContextMenu && (
              <div 
                className="context-menu"
                style={{ 
                  position: 'fixed',
                  left: contextMenuPosition.x,
                  top: contextMenuPosition.y
                }}
              >
                <button 
                  className="context-menu-item"
                  onClick={() => {
                    fileInputRef.current?.click()
                    setShowContextMenu(false)
                  }}
                >
                  Change Photo
                </button>
                <button 
                  className="context-menu-item"
                  onClick={() => {
                    setImageUrl(null)
                    setShowContextMenu(false)
                  }}
                >
                  Remove Photo
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  )
} 