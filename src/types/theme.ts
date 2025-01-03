export type ThemeType = 'light' | 'dark' | 'sage' | 'lofi' | 'cyberpunk' | 'ocean' | 'sunset' | 'forest'

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
  },
  lofi: {
    colors: {
      background: '#2a2522',
      surface: '#332e2b',
      surfaceHighlight: '#3b3633',
      border: '#443f3c',
      text: '#e6e0dd',
      textMuted: '#a39c98',
      primary: '#d4bfaa',
    },
    spacing: {
      gapSmall: '8px',
      gapMedium: '16px',
      gapLarge: '24px',
      paddingSmall: '8px',
      paddingMedium: '16px',
      paddingLarge: '24px',
      borderRadius: '16px',
    }
  },
  cyberpunk: {
    colors: {
      background: '#0D0D1F',
      surface: '#1A1A3A',
      surfaceHighlight: '#2A2A4A',
      border: '#3D3D6D',
      text: '#E6E6FF',
      textMuted: '#9999CC',
      primary: '#FF2E88',
    },
    spacing: {
      gapSmall: '8px',
      gapMedium: '16px',
      gapLarge: '24px',
      paddingSmall: '8px',
      paddingMedium: '16px',
      paddingLarge: '24px',
      borderRadius: '4px',
    }
  },
  ocean: {
    colors: {
      background: '#0A192F',
      surface: '#112240',
      surfaceHighlight: '#1A365D',
      border: '#234876',
      text: '#E2F1FF',
      textMuted: '#8BA7CC',
      primary: '#64FFDA',
    },
    spacing: {
      gapSmall: '8px',
      gapMedium: '16px',
      gapLarge: '24px',
      paddingSmall: '8px',
      paddingMedium: '16px',
      paddingLarge: '24px',
      borderRadius: '10px',
    }
  },
  sunset: {
    colors: {
      background: '#2D1B2D',
      surface: '#3D2438',
      surfaceHighlight: '#4D2D44',
      border: '#5E3650',
      text: '#FFE4D6',
      textMuted: '#D6B4A8',
      primary: '#FF9E7D',
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
  },
  forest: {
    colors: {
      background: '#1B2921',
      surface: '#243329',
      surfaceHighlight: '#2D3D32',
      border: '#36473B',
      text: '#E0EBE3',
      textMuted: '#A8B8AD',
      primary: '#7FB069',
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