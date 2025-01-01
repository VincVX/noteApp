import React, { useState, useCallback } from 'react'
import { ListTodo } from 'lucide-react'
import { TodoItem } from '../../types'

export interface TodoWidgetProps {
  readonly onDelete: () => void
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    addTodo()
  }, [addTodo])

  return (
    <section className="card" aria-label="Todo list widget">
      <header className="card-header">
        <div className="card-title">
          <ListTodo size={18} aria-hidden="true" />
          <span>Todo List</span>
        </div>
        <button 
          className="widget-delete-btn"
          onClick={onDelete}
          aria-label="Delete todo widget"
        >
          ✕
        </button>
      </header>
      <div className="card-content">
        <form 
          className="todo-input-group" 
          onSubmit={handleSubmit}
          role="form"
          aria-label="Add todo form"
        >
          <input
            type="text"
            className="todo-input"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
            aria-label="New todo text"
          />
          <button 
            type="submit" 
            className="add-todo-button"
            aria-label="Add todo"
          >
            Add
          </button>
        </form>
        <ul className="todo-list" role="list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <button
                className="todo-checkbox"
                onClick={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                aria-pressed={todo.completed}
                type="button"
              >
                {todo.completed && '✓'}
              </button>
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
} 