import React, { useState, useCallback } from 'react'
import { Layout, Plus, X, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

interface KanbanTask {
  id: string
  content: string
  labels: string[]
}

interface KanbanColumn {
  id: string
  title: string
  tasks: KanbanTask[]
}

interface KanbanWidgetProps {
  onDelete: () => void
}

export function KanbanWidget({ onDelete }: KanbanWidgetProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in-progress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ])
  const [newTaskContent, setNewTaskContent] = useState('')

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const sourceCol = columns.find(col => col.id === source.droppableId)
    const destCol = columns.find(col => col.id === destination.droppableId)
    
    if (!sourceCol || !destCol) return

    const sourceTasks = [...sourceCol.tasks]
    const destTasks = source.droppableId === destination.droppableId 
      ? sourceTasks 
      : [...destCol.tasks]

    const [removed] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, removed)

    setColumns(columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks }
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks }
      }
      return col
    }))
  }, [columns])

  const addTask = useCallback(() => {
    console.log('Adding task:', newTaskContent)
    if (!newTaskContent.trim()) {
      console.log('Empty task, returning')
      return
    }

    const newTask: KanbanTask = {
      id: Date.now().toString(),
      content: newTaskContent.trim(),
      labels: []
    }
    console.log('New task:', newTask)

    setColumns(prevColumns => {
      const updatedColumns = prevColumns.map(col => {
        if (col.id === 'todo') {
          console.log('Adding to todo column:', [...col.tasks, newTask])
          return { ...col, tasks: [...col.tasks, newTask] }
        }
        return col
      })
      console.log('Updated columns:', updatedColumns)
      return updatedColumns
    })

    setNewTaskContent('')
  }, [newTaskContent])

  const deleteTask = useCallback((columnId: string, taskId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId)
        }
      }
      return col
    }))
  }, [columns])

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]">
      <div className="card-header h-[52px] px-5 border-b border-white/[0.05] flex justify-between items-center bg-transparent">
        <div className="text-sm font-medium text-white/90 flex items-center gap-2">
          <Layout size={16} />
          Kanban Board
        </div>
      </div>
      
      <div className="p-5 flex-1 overflow-hidden flex flex-col">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-lg px-4 py-2 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 focus:bg-white/[0.03] transition-all duration-200"
          />
          <button
            onClick={addTask}
            className="bg-white/[0.05] text-white/80 border-none px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10 flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full overflow-x-auto pb-4">
            {columns.map(column => (
              <div
                key={column.id}
                className="flex-1 min-w-[280px] flex flex-col bg-white/[0.02] rounded-lg border border-white/[0.05]"
              >
                <h3 className="text-white/90 font-medium p-4 pb-2 text-sm">{column.title}</h3>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-2 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      <div className="space-y-2 min-h-full">
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'translate(0, 0)'
                                }}
                                className={`bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 group relative ${
                                  snapshot.isDragging ? 'shadow-lg ring-1 ring-white/10' : ''
                                }`}
                              >
                                <div 
                                  {...provided.dragHandleProps}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical size={14} />
                                </div>
                                <div className="pl-5">
                                  <p className="text-white/90 text-sm break-words">{task.content}</p>
                                  {task.labels.length > 0 && (
                                    <div className="flex gap-1.5 mt-2">
                                      {task.labels.map((label, i) => (
                                        <span
                                          key={i}
                                          className="bg-white/[0.05] px-2 py-0.5 rounded text-xs text-white/60"
                                        >
                                          {label}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteTask(column.id, task.id)
                                  }}
                                  className="absolute top-2 right-2 text-white/40 opacity-0 group-hover:opacity-100 hover:text-white/90 transition-all duration-200"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
} 