import React, { useRef } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { ThemeType } from '../../types/theme'

interface SettingsPageProps {
  onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { theme, setTheme, headerImage, setHeaderImage, showHeaderImage, setShowHeaderImage } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const themeOptions: { value: ThemeType; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'sage', label: 'Sage' },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeaderImage(reader.result as string)
        setShowHeaderImage(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setHeaderImage(null)
    setShowHeaderImage(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title">
          <h1>Settings</h1>
        </div>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="settings-content">
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-label">
                <label>Theme</label>
                <div className="setting-description">
                  Choose your preferred theme
                </div>
              </div>
              <div className="setting-options">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`setting-option ${theme === option.value ? 'active' : ''}`}
                    onClick={() => setTheme(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label">
                <label>Header Image</label>
                <div className="setting-description">
                  Add an image to display at the top of your canvas
                </div>
              </div>
              <div className="setting-options">
                <div className="header-image-controls">
                  <input
                    type="checkbox"
                    id="show-header"
                    checked={showHeaderImage}
                    onChange={(e) => setShowHeaderImage(e.target.checked)}
                  />
                  <label htmlFor="show-header">Display header image</label>
                  
                  <div className="header-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <button 
                      className="upload-button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!showHeaderImage}
                    >
                      <Upload size={16} />
                      Upload Image
                    </button>
                    {headerImage && (
                      <button 
                        className="remove-button"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 