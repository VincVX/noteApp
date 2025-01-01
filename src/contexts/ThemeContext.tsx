import React, { createContext, useContext, useState, useEffect } from 'react'
import { Theme, ThemeType, themes, themeToVariables } from '../types/theme'

interface ThemeContextType {
  theme: Theme
  currentTheme: ThemeType
  setTheme: (theme: ThemeType) => void
  updateTheme: (theme: Theme) => void
  headerImage: string | null
  setHeaderImage: (image: string | null) => void
  showHeaderImage: boolean
  setShowHeaderImage: (show: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('dark')
  const [theme, setThemeState] = useState<Theme>(themes[currentTheme])
  const [headerImage, setHeaderImage] = useState<string | null>(null)
  const [showHeaderImage, setShowHeaderImage] = useState(false)

  const setTheme = (newTheme: ThemeType) => {
    setCurrentTheme(newTheme)
    setThemeState(themes[newTheme])
  }

  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  useEffect(() => {
    const variables = themeToVariables(theme)
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setTheme,
        updateTheme,
        headerImage,
        setHeaderImage,
        showHeaderImage,
        setShowHeaderImage,
      }}
    >
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