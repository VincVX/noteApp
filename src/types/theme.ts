export type ThemeType = 'light' | 'dark' | 'sage'

export interface Theme {
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
    '--color-background': '#ffffff',
    '--color-surface': '#f8f9fa',
    '--color-surfaceHighlight': '#f1f3f5',
    '--color-border': '#dee2e6',
    '--color-text': '#212529',
    '--color-textMuted': '#868e96',
    '--color-primary': '#228be6',
    '--borderRadius': '8px',
    '--paddingSmall': '8px',
    '--paddingMedium': '16px',
    '--paddingLarge': '24px',
    '--gapSmall': '8px',
    '--gapMedium': '16px',
    '--gapLarge': '24px',
  },
  dark: {
    '--color-background': '#0d1117',
    '--color-surface': '#161b22',
    '--color-surfaceHighlight': '#21262d',
    '--color-border': '#30363d',
    '--color-text': '#c9d1d9',
    '--color-textMuted': '#8b949e',
    '--color-primary': '#58a6ff',
    '--borderRadius': '8px',
    '--paddingSmall': '8px',
    '--paddingMedium': '16px',
    '--paddingLarge': '24px',
    '--gapSmall': '8px',
    '--gapMedium': '16px',
    '--gapLarge': '24px',
  },
  sage: {
    '--color-background': '#1a1f1c',
    '--color-surface': '#212725',
    '--color-surfaceHighlight': '#2a302d',
    '--color-border': '#2f3734',
    '--color-text': '#e0e6e3',
    '--color-textMuted': '#93a099',
    '--color-primary': '#7fba8a',
    '--borderRadius': '12px',
    '--paddingSmall': '8px',
    '--paddingMedium': '16px',
    '--paddingLarge': '24px',
    '--gapSmall': '8px',
    '--gapMedium': '16px',
    '--gapLarge': '24px',
  }
} 