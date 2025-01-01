export interface ThemeColors {
  background: string
  surface: string
  surfaceHighlight: string
  primary: string
  text: string
  textMuted: string
  border: string
}

export interface ThemeSpacing {
  gapSmall: string
  gapMedium: string
  gapLarge: string
  paddingSmall: string
  paddingMedium: string
  paddingLarge: string
  borderRadius: string
}

export interface ThemeConfig {
  colors: ThemeColors
  spacing: ThemeSpacing
}

export const defaultLightTheme: ThemeConfig = {
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    surfaceHighlight: '#e8e8e8',
    primary: '#007aff',
    text: '#1a1a1a',
    textMuted: '#666666',
    border: '#e0e0e0'
  },
  spacing: {
    gapSmall: '8px',
    gapMedium: '16px',
    gapLarge: '24px',
    paddingSmall: '8px',
    paddingMedium: '16px',
    paddingLarge: '24px',
    borderRadius: '8px'
  }
}

export const defaultDarkTheme: ThemeConfig = {
  colors: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    surfaceHighlight: '#3a3a3a',
    primary: '#0a84ff',
    text: '#ffffff',
    textMuted: '#999999',
    border: '#404040'
  },
  spacing: {
    gapSmall: '8px',
    gapMedium: '16px',
    gapLarge: '24px',
    paddingSmall: '8px',
    paddingMedium: '16px',
    paddingLarge: '24px',
    borderRadius: '8px'
  }
} 