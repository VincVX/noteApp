import React, { useRef } from 'react'
import { X, Upload, Trash2 } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { ThemeCustomizer } from './ThemeCustomizer'

interface SettingsPageProps {
  readonly onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { currentTheme, setTheme, headerImage, setHeaderImage, setShowHeaderImage } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
            <ThemeCustomizer 
              currentTheme={currentTheme}
              onThemeChange={setTheme}
            />

            <div className="setting-item">
              <div className="setting-label">
                <label>Header Image</label>
                <div className="setting-description">
                  Add an image to display at the top of your canvas
                </div>
              </div>
              <div className="setting-options">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                {!headerImage ? (
                  <button
                    className="setting-option"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    Upload Image
                  </button>
                ) : (
                  <>
                    <button
                      className="setting-option"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} />
                      Change Image
                    </button>
                    <button
                      className="setting-option"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 