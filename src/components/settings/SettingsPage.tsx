import React, { useRef } from 'react'
import { X, Upload, Trash2, Grid, Lock } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useCanvas } from '../../contexts/CanvasContext'
import { ThemeCustomizer } from './ThemeCustomizer'

interface SettingsPageProps {
  readonly onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { currentTheme, setTheme, headerImage, setHeaderImage, setShowHeaderImage } = useTheme()
  const { canvasData, updateSettings } = useCanvas()
  const { settings } = canvasData
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
                <label htmlFor="header-image-input">Header Image</label>
                <div className="setting-description">
                  Add an image to display at the top of your canvas
                </div>
              </div>
              <div className="setting-options">
                <input
                  id="header-image-input"
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
                  <button
                    className="setting-option"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 size={16} />
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Canvas</h2>
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-label">
                <label>Grid</label>
                <div className="setting-description">
                  Show grid lines on the canvas
                </div>
              </div>
              <div className="setting-options">
                <button
                  className={`setting-option ${settings.grid_enabled ? 'active' : ''}`}
                  onClick={() => updateSettings({ grid_enabled: !settings.grid_enabled })}
                >
                  <Grid size={16} />
                  {settings.grid_enabled ? 'Hide Grid' : 'Show Grid'}
                </button>
              </div>
            </div>

            {settings.grid_enabled && (
              <div className="setting-item">
                <div className="setting-label">
                  <label>Grid Size</label>
                  <div className="setting-description">
                    Adjust the size of grid cells
                  </div>
                </div>
                <div className="setting-options">
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={settings.grid_size}
                    onChange={(e) => updateSettings({ grid_size: parseInt(e.target.value) })}
                    className="setting-slider"
                  />
                  <span className="setting-value">{settings.grid_size}px</span>
                </div>
              </div>
            )}

            <div className="setting-item">
              <div className="setting-label">
                <label>Snap to Grid</label>
                <div className="setting-description">
                  Automatically align widgets to grid lines
                </div>
              </div>
              <div className="setting-options">
                <button
                  className={`setting-option ${settings.snap_to_grid ? 'active' : ''}`}
                  onClick={() => updateSettings({ snap_to_grid: !settings.snap_to_grid })}
                >
                  {settings.snap_to_grid ? 'Disable Snap' : 'Enable Snap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 