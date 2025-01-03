import React, { createContext, useContext, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useCanvas } from './CanvasContext'
import { themes, Theme, ThemeType } from '../types/theme'

interface ThemeContextType {
  currentTheme: ThemeType
  setTheme: (theme: ThemeType) => void
  theme: Theme
  updateTheme: (theme: Theme) => void
  headerImage: string | null
  setHeaderImage: (image: string | null) => void
  showHeaderImage: boolean
  setShowHeaderImage: (show: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { canvasData, setTheme: setCanvasTheme, updateSettings } = useCanvas()
  const { theme: currentTheme, settings } = canvasData

  // Ensure we have a valid theme
  const validTheme = (currentTheme as ThemeType) || 'dark'

  // Load header image on mount
  useEffect(() => {
    const loadHeaderImage = async () => {
      try {
        const imageData = await invoke<string | null>('load_header_image')
        if (imageData) {
          updateSettings({
            header_image: imageData,
            show_header_image: true
          })
        }
      } catch (error) {
        console.error('Failed to load header image:', error)
      }
    }

    loadHeaderImage()
  }, [])

  const setTheme = (newTheme: ThemeType) => {
    setCanvasTheme(newTheme)
  }

  const updateTheme = (newTheme: Theme) => {
    // This function remains for theme customization, but changes won't persist
    // Consider adding theme customization to canvas settings if needed
  }

  const setHeaderImage = async (image: string | null) => {
    try {
      if (image) {
        await invoke('save_header_image', { imageData: image })
      } else {
        await invoke('delete_header_image')
      }
      
      updateSettings({ 
        header_image: image,
        show_header_image: !!image 
      })
    } catch (error) {
      console.error('Failed to save header image:', error)
      // Optionally show an error message to the user
    }
  }

  const setShowHeaderImage = (show: boolean) => {
    updateSettings({ show_header_image: show })
  }

  // Apply theme CSS variables
  useEffect(() => {
    try {
      const themeVariables = themes[validTheme]
      if (themeVariables) {
        Object.entries(themeVariables.colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--color-${key}`, value)
        })
        Object.entries(themeVariables.spacing).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key}`, value)
        })
      }
    } catch (error) {
      console.error('Error applying theme:', error)
    }
  }, [validTheme])

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: validTheme,
        setTheme,
        theme: themes[validTheme],
        updateTheme,
        headerImage: settings.header_image || null,
        setHeaderImage,
        showHeaderImage: settings.show_header_image || false,
        setShowHeaderImage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 