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
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]">
      <div className="card-header h-[52px] px-5 border-b border-white/[0.05] flex justify-between items-center bg-transparent">
        <div className="text-sm font-medium text-white/90 flex items-center gap-2">
          <ListTodo size={16} />
          <span>Todo List</span>
        </div>
      </div>
      <div className="p-5 flex-1 overflow-hidden">
        <form className="flex gap-2 mb-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-lg px-4 py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 focus:bg-white/[0.03] transition-all duration-200"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
          />
          <button 
            type="submit" 
            className="bg-white/[0.05] text-white/80 border-none px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10"
          >
            Add
          </button>
        </form>
        <ul className="flex flex-col gap-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-2 p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg">
              <button
                className="w-4 h-4 border border-white/[0.05] rounded bg-white/[0.05] flex items-center justify-center text-xs text-white/90 cursor-pointer hover:bg-white/10 transition-all duration-150"
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && '✓'}
              </button>
              <span className={`flex-1 text-sm ${todo.completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                {todo.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 