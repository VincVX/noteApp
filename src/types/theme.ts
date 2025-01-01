export type ThemeType = 'light' | 'dark' | 'sage'

export interface ThemeColors {
  background: string
  surface: string
  surfaceHighlight: string
  border: string
  text: string
  textMuted: string
  primary: string
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

export interface Theme {
  colors: ThemeColors
  spacing: ThemeSpacing
}

export interface ThemeVariables {
  '--color-background': string
  '--color-surface': string
  '--color-surfaceHighlight': string
  '--color-border': string
  '--color-text': string
  '--color-textMuted': string
  '--color-primary': string
  '--borderRadius': string
  '--paddingSmall': string
  '--paddingMedium': string
  '--paddingLarge': string
  '--gapSmall': string
  '--gapMedium': string
  '--gapLarge': string
}

export const themes: Record<ThemeType, Theme> = {
  light: {
    colors: {
      background: '#ffffff',
      surface: '#f8f9fa',
      surfaceHighlight: '#f1f3f5',
      border: '#dee2e6',
      text: '#212529',
      textMuted: '#868e96',
      primary: '#228be6',
    },
    spacing: {
      gapSmall: '8px',
      gapMedium: '16px',
      gapLarge: '24px',
      paddingSmall: '8px',
      paddingMedium: '16px',
      paddingLarge: '24px',
      borderRadius: '8px',
    }
  },
  dark: {
    colors: {
      background: '#0d1117',
      surface: '#161b22',
      surfaceHighlight: '#21262d',
      border: '#30363d',
      text: '#c9d1d9',
      textMuted: '#8b949e',
      primary: '#58a6ff',
    },
    spacing: {
      gapSmall: '8px',
      gapMedium: '16px',
      gapLarge: '24px',
      paddingSmall: '8px',
      paddingMedium: '16px',
      paddingLarge: '24px',
      borderRadius: '8px',
    }
  },
  sage: {
    colors: {
      background: '#1a1f1c',
      surface: '#212725',
      surfaceHighlight: '#2a302d',
      border: '#2f3734',
      text: '#e0e6e3',
      textMuted: '#93a099',
      primary: '#7fba8a',
    },
    spacing: {
      gapSmall: '8px',
      gapMedium: '16px',
      gapLarge: '24px',
      paddingSmall: '8px',
      paddingMedium: '16px',
      paddingLarge: '24px',
      borderRadius: '12px',
    }
  }
}

export function themeToVariables(theme: Theme): ThemeVariables {
  return {
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-surfaceHighlight': theme.colors.surfaceHighlight,
    '--color-border': theme.colors.border,
    '--color-text': theme.colors.text,
    '--color-textMuted': theme.colors.textMuted,
    '--color-primary': theme.colors.primary,
    '--borderRadius': theme.spacing.borderRadius,
    '--paddingSmall': theme.spacing.paddingSmall,
    '--paddingMedium': theme.spacing.paddingMedium,
    '--paddingLarge': theme.spacing.paddingLarge,
    '--gapSmall': theme.spacing.gapSmall,
    '--gapMedium': theme.spacing.gapMedium,
    '--gapLarge': theme.spacing.gapLarge,
  }
} 