import { useTheme } from '../../contexts/ThemeContext'
import { ColorPicker } from './ColorPicker'
import { RotateCcw } from 'lucide-react'

// Original dark theme colors
const originalDarkTheme = {
  colors: {
    background: '#0d1117',
    surface: '#161b22',
    surfaceHighlight: '#21262d',
    primary: '#1f6feb',
    text: '#c9d1d9',
    textMuted: '#8b949e',
    border: '#30363d'
  },
  spacing: {
    gapSmall: '8px',
    gapMedium: '16px',
    gapLarge: '24px',
    paddingSmall: '8px',
    paddingMedium: '16px',
    paddingLarge: '24px',
    borderRadius: '6px'
  }
}

export function ThemeCustomizer() {
  const { theme, updateTheme } = useTheme()

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
    updateTheme(originalDarkTheme)
  }

  return (
    <div className="settings-section">
      <div className="customizer-header">
        <h2>Theme Customization</h2>
        <button className="default-theme-button" onClick={restoreDefaultTheme}>
          <RotateCcw size={16} />
          Use Default Theme
        </button>
      </div>
      
      <div className="setting-group">
        <h3>Colors</h3>
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
      </div>

      <div className="setting-group">
        <h3>Spacing</h3>
        <div className="spacing-grid">
          <div className="setting-item">
            <div className="setting-label">
              <label>Small Gap</label>
            </div>
            <input
              type="text"
              value={theme.spacing.gapSmall}
              onChange={(e) => handleSpacingChange('gapSmall', e.target.value)}
              className="spacing-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <label>Medium Gap</label>
            </div>
            <input
              type="text"
              value={theme.spacing.gapMedium}
              onChange={(e) => handleSpacingChange('gapMedium', e.target.value)}
              className="spacing-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <label>Large Gap</label>
            </div>
            <input
              type="text"
              value={theme.spacing.gapLarge}
              onChange={(e) => handleSpacingChange('gapLarge', e.target.value)}
              className="spacing-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <label>Padding Small</label>
            </div>
            <input
              type="text"
              value={theme.spacing.paddingSmall}
              onChange={(e) => handleSpacingChange('paddingSmall', e.target.value)}
              className="spacing-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <label>Padding Medium</label>
            </div>
            <input
              type="text"
              value={theme.spacing.paddingMedium}
              onChange={(e) => handleSpacingChange('paddingMedium', e.target.value)}
              className="spacing-input"
            />
          </div>
          <div className="setting-item">
            <div className="setting-label">
              <label>Padding Large</label>
            </div>
            <input
              type="text"
              value={theme.spacing.paddingLarge}
              onChange={(e) => handleSpacingChange('paddingLarge', e.target.value)}
              className="spacing-input"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 