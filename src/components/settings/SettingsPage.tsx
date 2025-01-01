import { useState } from 'react'
import { Settings, X } from 'lucide-react'

interface SettingsPageProps {
  onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const [theme, setTheme] = useState('dark')
  const [fontSize, setFontSize] = useState('14')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [timeFormat, setTimeFormat] = useState('12')

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize)
    document.documentElement.style.setProperty('--base-font-size', `${newSize}px`)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title">
          <Settings size={24} />
          <h1>Settings</h1>
        </div>
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close settings"
        >
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
                <span className="setting-description">Choose your preferred color theme</span>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  Dark
                </button>
                <button 
                  className={`setting-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  Light
                </button>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-label">
                <label>Font Size</label>
                <span className="setting-description">Adjust the application font size</span>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-option ${fontSize === '12' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('12')}
                >
                  Small
                </button>
                <button 
                  className={`setting-option ${fontSize === '14' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('14')}
                >
                  Medium
                </button>
                <button 
                  className={`setting-option ${fontSize === '16' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('16')}
                >
                  Large
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="settings-section">
          <h2>Date & Time</h2>
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-label">
                <label>Date Format</label>
                <span className="setting-description">Choose how dates are displayed</span>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-option ${dateFormat === 'MM/DD/YYYY' ? 'active' : ''}`}
                  onClick={() => setDateFormat('MM/DD/YYYY')}
                >
                  MM/DD/YYYY
                </button>
                <button 
                  className={`setting-option ${dateFormat === 'DD/MM/YYYY' ? 'active' : ''}`}
                  onClick={() => setDateFormat('DD/MM/YYYY')}
                >
                  DD/MM/YYYY
                </button>
                <button 
                  className={`setting-option ${dateFormat === 'YYYY-MM-DD' ? 'active' : ''}`}
                  onClick={() => setDateFormat('YYYY-MM-DD')}
                >
                  YYYY-MM-DD
                </button>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-label">
                <label>Time Format</label>
                <span className="setting-description">Choose 12 or 24-hour time format</span>
              </div>
              <div className="setting-options">
                <button 
                  className={`setting-option ${timeFormat === '12' ? 'active' : ''}`}
                  onClick={() => setTimeFormat('12')}
                >
                  12-hour
                </button>
                <button 
                  className={`setting-option ${timeFormat === '24' ? 'active' : ''}`}
                  onClick={() => setTimeFormat('24')}
                >
                  24-hour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 