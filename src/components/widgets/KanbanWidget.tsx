import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconCopy, IconTrash, IconGripVertical } from '@tabler/icons-react';

interface KanbanTask {
  id: string;
  content: string;
  tags: string[];
  completed: boolean;
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

export const KanbanWidget: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'Todo',
      tasks: [
        { id: '1', content: 'Task 1', tags: ['tag'], completed: false }
      ]
    }
  ]);
  const [newTaskContent, setNewTaskContent] = useState('');

  const progress = useMemo(() => {
    const totalTasks = columns[0].tasks.length;
    const completedTasks = columns[0].tasks.filter(task => task.completed).length;
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  }, [columns]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    
    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId 
      ? sourceTasks 
      : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destTasks };
      }
      return col;
    });

    setColumns(newColumns);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setColumns(columns.map(col => ({
      ...col,
      tasks: col.tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    })));
  };

  const addNewTask = () => {
    if (!newTaskContent.trim()) return;
    
    const newTask: KanbanTask = {
      id: Date.now().toString(),
      content: newTaskContent,
      tags: [],
      completed: false
    };

    setColumns(columns.map(col => {
      if (col.id === 'todo') {
        return { ...col, tasks: [...col.tasks, newTask] };
      }
      return col;
    }));

    setNewTaskContent('');
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId)
        };
      }
      return col;
    }));
  };

  const duplicateTask = (columnId: string, task: KanbanTask) => {
    const newTask = {
      ...task,
      id: Date.now().toString()
    };

    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, newTask]
        };
      }
      return col;
    }));
  };

  return (
    <div className="kanban-widget" style={{ 
      backgroundColor: '#1a1a1a', 
      borderRadius: '8px',
      padding: '16px',
      color: 'white'
    }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map(column => (
          <div key={column.id}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <h3>{column.title}</h3>
              <span style={{ color: '#666' }}>2:10</span>
            </div>

            <div style={{
              width: '100%',
              height: '2px',
              backgroundColor: '#333',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                backgroundColor: '#4CAF50',
                width: `${progress}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: '100px' }}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            backgroundColor: '#2a2a2a',
                            borderRadius: '6px',
                            padding: '12px',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            ...provided.draggableProps.style
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                              <div {...provided.dragHandleProps}>
                                <IconGripVertical size={16} />
                              </div>
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id)}
                                style={{
                                  margin: 0,
                                  cursor: 'pointer'
                                }}
                              />
                              <span style={{
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? '#666' : 'white'
                              }}>
                                {task.content}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => duplicateTask(column.id, task)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                              >
                                <IconCopy size={16} />
                              </button>
                              <button
                                onClick={() => deleteTask(column.id, task.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                              >
                                <IconTrash size={16} />
                              </button>
                            </div>
                          </div>
                          {task.tags.length > 0 && (
                            <div style={{ marginTop: '8px' }}>
                              {task.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  style={{
                                    backgroundColor: '#333',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    marginRight: '4px'
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div style={{ marginTop: '16px' }}>
              <input
                type="text"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                placeholder="New Task"
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#2a2a2a',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addNewTask();
                  }
                }}
              />
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}; 