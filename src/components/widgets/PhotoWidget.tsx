import React, { useState, useRef } from 'react'
import { Image, Upload } from 'lucide-react'

interface PhotoWidgetProps {
  onDelete: () => void
}

export function PhotoWidget({ onDelete }: PhotoWidgetProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setImageUrl(result)
          setError(null)
        }
      }
      reader.onerror = () => {
        setError('Failed to read the image file')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to process the image')
      console.error('Error processing image:', err)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    
    if (!file) {
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setImageUrl(result)
          setError(null)
        }
      }
      reader.onerror = () => {
        setError('Failed to read the dropped image')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Failed to process the dropped image')
      console.error('Error processing dropped image:', err)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
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
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]">
      <div className="card-header h-[52px] px-5 border-b border-white/[0.05] flex justify-between items-center bg-transparent">
        <div className="text-sm font-medium text-white/90 flex items-center gap-2">
          <Image size={16} />
          Photo
        </div>
      </div>
      <div className="p-5 flex-1 overflow-hidden">
        {!imageUrl ? (
          <div 
            className="border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 hover:border-white/40 hover:bg-white/[0.02] min-h-[200px] justify-center"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload size={24} className="text-white/40 mb-2" />
            <p className="text-white/90">Click to upload or drag and drop</p>
            <p className="text-white/40 text-sm">Supports: JPG, PNG, GIF (max 5MB)</p>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        ) : (
          <div 
            className="flex flex-col gap-4 items-center relative"
            onContextMenu={handleContextMenu}
          >
            <img 
              src={imageUrl} 
              alt="Uploaded" 
              className="max-w-full max-h-[400px] rounded-lg object-contain" 
              onError={() => {
                setError('Failed to load image')
                setImageUrl(null)
              }}
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
            {showContextMenu && (
              <div 
                className="fixed bg-white/[0.05] border border-white/[0.05] rounded-lg shadow-lg overflow-hidden z-[1000]"
                style={{ 
                  left: contextMenuPosition.x,
                  top: contextMenuPosition.y
                }}
              >
                <button 
                  className="block w-full px-6 py-2 text-left text-sm text-white/90 hover:bg-white/[0.05] transition-all duration-150"
                  onClick={() => {
                    fileInputRef.current?.click()
                    setShowContextMenu(false)
                  }}
                >
                  Change Photo
                </button>
                <button 
                  className="block w-full px-6 py-2 text-left text-sm text-white/90 hover:bg-white/[0.05] transition-all duration-150 border-t border-white/[0.05]"
                  onClick={() => {
                    setImageUrl(null)
                    setError(null)
                    setShowContextMenu(false)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
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
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
} 