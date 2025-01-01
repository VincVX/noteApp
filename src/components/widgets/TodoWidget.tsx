import { useState } from 'react'
import { ListTodo } from 'lucide-react'
import { TodoItem } from '../../types'

export function TodoWidget() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { 
        id: Date.now().toString(), 
        text: newTodo.trim(), 
        completed: false 
      }])
      setNewTodo('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

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
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
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