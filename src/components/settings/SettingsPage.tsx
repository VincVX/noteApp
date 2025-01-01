import React from 'react'
import { X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { ThemeType } from '../../types/theme'

interface SettingsPageProps {
  onClose: () => void
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { theme, setTheme } = useTheme()

  const themeOptions: { value: ThemeType; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'sage', label: 'Sage' },
  ]

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
          </div>
        </div>
      </div>
    </div>
  )
} 