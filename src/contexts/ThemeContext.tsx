import React, { createContext, useContext, useState, useEffect } from 'react'
import { ThemeType, themes } from '../types/theme'

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  headerImage: string | null
  setHeaderImage: (image: string | null) => void
  showHeaderImage: boolean
  setShowHeaderImage: (show: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('sage')  // Set sage as default
  const [headerImage, setHeaderImage] = useState<string | null>(null)
  const [showHeaderImage, setShowHeaderImage] = useState(false)

  useEffect(() => {
    // Apply theme variables to root element
    const root = document.documentElement
    const themeVars = themes[theme]
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [theme])

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      headerImage, 
      setHeaderImage, 
      showHeaderImage, 
      setShowHeaderImage 
    }}>
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