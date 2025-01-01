import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeConfig, defaultLightTheme, defaultDarkTheme } from '../types/theme'

interface ThemeContextType {
  isDark: boolean
  setIsDark: (isDark: boolean) => void
  theme: ThemeConfig
  updateTheme: (theme: ThemeConfig) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('isDark')
    return saved ? JSON.parse(saved) : false
  })

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('theme')
    return saved ? JSON.parse(saved) : (isDark ? defaultDarkTheme : defaultLightTheme)
  })

  useEffect(() => {
    localStorage.setItem('isDark', JSON.stringify(isDark))
    localStorage.setItem('theme', JSON.stringify(theme))

    // Apply theme to root element
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [isDark, theme])

  const updateTheme = (newTheme: ThemeConfig) => {
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 