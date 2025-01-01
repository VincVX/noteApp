import React, { useState, useCallback } from 'react'
import { ListTodo } from 'lucide-react'
import { TodoItem } from '../../types'

interface TodoWidgetProps {
  onDelete: () => void
}

export function TodoWidget({ onDelete }: TodoWidgetProps) {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = useState('')

  const addTodo = useCallback(() => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false
      }
      setTodos(prev => [...prev, newTodo])
      setNewTodoText('')
    }
  }, [newTodoText])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  // Handle mouse down for drag behavior
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Only allow dragging when clicking on the card background
    // Prevent dragging when clicking on interactive elements
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.closest('.todo-list') ||
      target.closest('.card-title')
    ) {
      e.stopPropagation()
    }
  }, [])

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <ListTodo size={18} />
          Todo List
        </div>
      </div>
      <div className="card-content">
        <div className="todo-input-group">
          <input
            type="text"
            className="todo-input"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-todo-button" onClick={addTodo}>
            Add
          </button>
        </div>
        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo.id} className="todo-item">
              <div
                className="todo-checkbox"
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && '✓'}
              </div>
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 