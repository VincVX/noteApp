import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { ColorPicker } from './ColorPicker'
import { RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { ThemeType, themes } from '../../types/theme'

interface ThemeCustomizerProps {
  readonly currentTheme: ThemeType
  readonly onThemeChange: (theme: ThemeType) => void
}

export function ThemeCustomizer({ currentTheme, onThemeChange }: ThemeCustomizerProps) {
  const { theme, updateTheme } = useTheme()
  const [expandedSections, setExpandedSections] = useState({
    colors: true,
    spacing: false,
  })

  const handleColorChange = (key: string, value: string) => {
    updateTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: value
      }
    })
  }

  const handleSpacingChange = (key: string, value: string) => {
    updateTheme({
      ...theme,
      spacing: {
        ...theme.spacing,
        [key]: value
      }
    })
  }

  const restoreDefaultTheme = () => {
    updateTheme(themes[currentTheme])
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="theme-customizer">
      <div className="customizer-header">
        <div className="customizer-title">
          <h3>Theme Customization</h3>
          <button 
            className="reset-button" 
            onClick={restoreDefaultTheme}
            title="Reset to default theme"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="customizer-content">
        {/* Theme Selector */}
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="theme-selector">Theme</label>
            <div className="setting-description">Choose your preferred theme</div>
          </div>
          <div className="theme-options" id="theme-selector" role="radiogroup" aria-label="Theme Selection">
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
                onClick={() => onThemeChange(themeKey as ThemeType)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onThemeChange(themeKey as ThemeType);
                  }
                }}
                role="radio"
                aria-checked={currentTheme === themeKey}
                tabIndex={0}
              >
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div className="customizer-section">
          <button 
            className="section-header" 
            onClick={() => toggleSection('colors')}
            aria-expanded={expandedSections.colors}
          >
            <h4>Colors</h4>
            {expandedSections.colors ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.colors && (
            <div className="color-grid">
              <ColorPicker
                label="Background"
                value={theme.colors.background}
                onChange={(value) => handleColorChange('background', value)}
              />
              <ColorPicker
                label="Surface"
                value={theme.colors.surface}
                onChange={(value) => handleColorChange('surface', value)}
              />
              <ColorPicker
                label="Surface Highlight"
                value={theme.colors.surfaceHighlight}
                onChange={(value) => handleColorChange('surfaceHighlight', value)}
              />
              <ColorPicker
                label="Primary"
                value={theme.colors.primary}
                onChange={(value) => handleColorChange('primary', value)}
              />
              <ColorPicker
                label="Text"
                value={theme.colors.text}
                onChange={(value) => handleColorChange('text', value)}
              />
              <ColorPicker
                label="Text Muted"
                value={theme.colors.textMuted}
                onChange={(value) => handleColorChange('textMuted', value)}
              />
              <ColorPicker
                label="Border"
                value={theme.colors.border}
                onChange={(value) => handleColorChange('border', value)}
              />
            </div>
          )}
        </div>

        {/* Spacing Section */}
        <div className="customizer-section">
          <button 
            className="section-header" 
            onClick={() => toggleSection('spacing')}
            aria-expanded={expandedSections.spacing}
          >
            <h4>Spacing</h4>
            {expandedSections.spacing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.spacing && (
            <div className="spacing-grid">
              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="gap-small">Small Gap</label>
                  <div className="setting-description">Spacing between small elements</div>
                </div>
                <div className="spacing-input-wrapper">
                  <input
                    id="gap-small"
                    type="number"
                    min="0"
                    max="32"
                    value={parseInt(theme.spacing.gapSmall.replace('px', ''))}
                    onChange={(e) => handleSpacingChange('gapSmall', `${e.target.value}px`)}
                    className="number-input"
                  />
                  <span className="unit">px</span>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="gap-medium">Medium Gap</label>
                  <div className="setting-description">Spacing between medium elements</div>
                </div>
                <div className="spacing-input-wrapper">
                  <input
                    id="gap-medium"
                    type="number"
                    min="0"
                    max="48"
                    value={parseInt(theme.spacing.gapMedium.replace('px', ''))}
                    onChange={(e) => handleSpacingChange('gapMedium', `${e.target.value}px`)}
                    className="number-input"
                  />
                  <span className="unit">px</span>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="gap-large">Large Gap</label>
                  <div className="setting-description">Spacing between large elements</div>
                </div>
                <div className="spacing-input-wrapper">
                  <input
                    id="gap-large"
                    type="number"
                    min="0"
                    max="64"
                    value={parseInt(theme.spacing.gapLarge.replace('px', ''))}
                    onChange={(e) => handleSpacingChange('gapLarge', `${e.target.value}px`)}
                    className="number-input"
                  />
                  <span className="unit">px</span>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-label">
                  <label htmlFor="border-radius">Border Radius</label>
                  <div className="setting-description">Roundness of corners</div>
                </div>
                <div className="spacing-input-wrapper">
                  <input
                    id="border-radius"
                    type="number"
                    min="0"
                    max="24"
                    value={parseInt(theme.spacing.borderRadius.replace('px', ''))}
                    onChange={(e) => handleSpacingChange('borderRadius', `${e.target.value}px`)}
                    className="number-input"
                  />
                  <span className="unit">px</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 