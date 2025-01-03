import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { ColorPicker } from './ColorPicker'
import { 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  Leaf, 
  Music,
  Zap,
  Waves,
  Sunset,
  Trees
} from 'lucide-react'
import { ThemeType, themes } from '../../types/theme'

interface ThemeCustomizerProps {
  readonly currentTheme: ThemeType
  readonly onThemeChange: (theme: ThemeType) => void
}

const themeIcons = {
  light: <Sun size={16} />,
  dark: <Moon size={16} />,
  sage: <Leaf size={16} />,
  lofi: <Music size={16} />,
  cyberpunk: <Zap size={16} />,
  ocean: <Waves size={16} />,
  sunset: <Sunset size={16} />,
  forest: <Trees size={16} />
}

const themeDescriptions = {
  light: 'Clean and bright interface',
  dark: 'Easy on the eyes',
  sage: 'Nature-inspired calm',
  lofi: 'Warm and cozy vibes',
  cyberpunk: 'Neon-futuristic style',
  ocean: 'Deep sea tranquility',
  sunset: 'Warm evening colors',
  forest: 'Natural earth tones'
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
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-white/[0.05] flex justify-between items-center">
        <h3 className="text-white/90 text-lg font-medium">Theme Customization</h3>
        <button 
          className="bg-white/[0.05] text-white/80 border-none px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10 flex items-center gap-1.5"
          onClick={restoreDefaultTheme}
          title="Reset to default theme"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="p-5">
        {/* Theme Selector */}
        <div className="mb-8">
          <div className="mb-4">
            <label className="text-white/90 text-sm font-medium">Theme</label>
            <div className="text-white/60 text-sm mt-1">Choose your preferred theme</div>
          </div>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Theme Selection">
            {Object.keys(themes).map((themeKey) => (
              <button
                key={themeKey}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                  currentTheme === themeKey 
                    ? 'bg-white/[0.05] border-white/20 text-white/90' 
                    : 'bg-white/[0.02] border-white/[0.05] text-white/80 hover:bg-white/[0.03] hover:border-white/10'
                }`}
                onClick={() => onThemeChange(themeKey as ThemeType)}
                role="radio"
                aria-checked={currentTheme === themeKey}
              >
                <div className={`p-2 rounded-lg bg-white/[0.05] ${currentTheme === themeKey ? 'text-white/90' : 'text-white/60'}`}>
                  {themeIcons[themeKey as ThemeType]}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}</span>
                  <span className="text-xs text-white/40">{themeDescriptions[themeKey as ThemeType]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div className="mb-6">
          <button 
            className="w-full flex justify-between items-center py-2 text-white/90 hover:text-white transition-colors duration-200"
            onClick={() => toggleSection('colors')}
            aria-expanded={expandedSections.colors}
          >
            <h4 className="text-base font-medium">Colors</h4>
            {expandedSections.colors ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.colors && (
            <div className="mt-4 grid gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
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
        <div>
          <button 
            className="w-full flex justify-between items-center py-2 text-white/90 hover:text-white transition-colors duration-200"
            onClick={() => toggleSection('spacing')}
            aria-expanded={expandedSections.spacing}
          >
            <h4 className="text-base font-medium">Spacing</h4>
            {expandedSections.spacing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {expandedSections.spacing && (
            <div className="mt-4 grid gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05]">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="gap-small" className="text-white/90 text-sm">Small Gap</label>
                  <div className="text-white/60 text-xs mt-1">Spacing between small elements</div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="gap-small"
                      type="number"
                      min="0"
                      max="32"
                      value={parseInt(theme.spacing.gapSmall.replace('px', ''))}
                      onChange={(e) => handleSpacingChange('gapSmall', `${e.target.value}px`)}
                      className="w-20 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 text-sm text-white/90"
                    />
                    <span className="text-white/40 text-sm">px</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="gap-medium" className="text-white/90 text-sm">Medium Gap</label>
                  <div className="text-white/60 text-xs mt-1">Spacing between medium elements</div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="gap-medium"
                      type="number"
                      min="0"
                      max="48"
                      value={parseInt(theme.spacing.gapMedium.replace('px', ''))}
                      onChange={(e) => handleSpacingChange('gapMedium', `${e.target.value}px`)}
                      className="w-20 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 text-sm text-white/90"
                    />
                    <span className="text-white/40 text-sm">px</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="gap-large" className="text-white/90 text-sm">Large Gap</label>
                  <div className="text-white/60 text-xs mt-1">Spacing between large elements</div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="gap-large"
                      type="number"
                      min="0"
                      max="64"
                      value={parseInt(theme.spacing.gapLarge.replace('px', ''))}
                      onChange={(e) => handleSpacingChange('gapLarge', `${e.target.value}px`)}
                      className="w-20 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 text-sm text-white/90"
                    />
                    <span className="text-white/40 text-sm">px</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="border-radius" className="text-white/90 text-sm">Border Radius</label>
                  <div className="text-white/60 text-xs mt-1">Roundness of corners</div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      id="border-radius"
                      type="number"
                      min="0"
                      max="24"
                      value={parseInt(theme.spacing.borderRadius.replace('px', ''))}
                      onChange={(e) => handleSpacingChange('borderRadius', `${e.target.value}px`)}
                      className="w-20 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 text-sm text-white/90"
                    />
                    <span className="text-white/40 text-sm">px</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 