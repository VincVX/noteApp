export type Widget = {
  id: string
  widget_type: 'markdown' | 'todo' | 'book' | 'spotify' | 'photo' | 'kanban'
  content: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  style: {
    background_color?: string
    border_color?: string
    text_color?: string
    font_size?: number
    font_family?: string
    rotation?: number
    opacity?: number
  }
  created?: string
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
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
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