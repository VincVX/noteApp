export type Widget = {
  id: string
  type: 'markdown' | 'todo' | 'book' | 'spotify'
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface Layout {
  i: string
  x: number
  y: number
  w: number
  h: number
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  created: string
}

export interface MarkdownNote {
  id: string
  title: string
  content: string
  created: string
} 