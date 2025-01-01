export interface Widget {
  id: string
  type: 'markdown' | 'todo' | 'book'
  layout?: {
    x: number
    y: number
    w: number
    h: number
  }
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