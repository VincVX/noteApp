import React, { useState, useCallback } from 'react'
import { ListTodo } from 'lucide-react'
import { TodoItem } from '../../types'

export function TodoWidget() {
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
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <ListTodo size={18} />
          <span>Todo List</span>
        </div>
      </div>
      <div className="card-content">
        <form className="todo-input-group" onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo-input"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
          />
          <button type="submit" className="add-todo-button">
            Add
          </button>
        </form>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <button
                className="todo-checkbox"
                onClick={() => toggleTodo(todo.id)}
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
    </div>
  )
} 