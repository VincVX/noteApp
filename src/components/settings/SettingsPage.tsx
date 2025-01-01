import { useState } from 'react'
import { Settings, X, Sliders, Palette } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { ThemeCustomizer } from './ThemeCustomizer'
import './styles.css'

interface SettingsPageProps {
  onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { isDark, setIsDark } = useTheme()
  const [activeSection, setActiveSection] = useState<'general' | 'theme'>('general')

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

      <div className="settings-layout">
        <div className="settings-sidebar">
          <button
            className={`settings-nav-button ${activeSection === 'general' ? 'active' : ''}`}
            onClick={() => setActiveSection('general')}
          >
            <Sliders size={18} />
            General
          </button>
          <button
            className={`settings-nav-button ${activeSection === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveSection('theme')}
          >
            <Palette size={18} />
            Theme
          </button>
        </div>

        <div className="settings-content">
          {activeSection === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="setting-group">
                <div className="setting-item">
                  <div className="setting-label">
                    <label>Theme Mode</label>
                    <span className="setting-description">Choose light or dark mode</span>
                  </div>
                  <div className="setting-options">
                    <button 
                      className={`setting-option ${!isDark ? 'active' : ''}`}
                      onClick={() => setIsDark(false)}
                    >
                      Light
                    </button>
                    <button 
                      className={`setting-option ${isDark ? 'active' : ''}`}
                      onClick={() => setIsDark(true)}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'theme' && (
            <ThemeCustomizer />
          )}
        </div>
      </div>
    </div>
  )
} 