import React, { useState, useCallback } from 'react'
import { Book, Plus } from 'lucide-react'
import { Note } from '../../types'
import { BookNote } from './BookNote'

interface BookWidgetProps {
  onDelete: () => void
}

export function BookWidget({ onDelete }: BookWidgetProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      created: new Date().toISOString()
    }
    setNotes(prev => [...prev, newNote])
  }, [])

  const updateNote = useCallback((updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ))
    const newTags = new Set(allTags)
    updatedNote.tags.forEach(tag => newTags.add(tag))
    setAllTags(Array.from(newTags))
  }, [notes, allTags])

  // Handle mouse down for drag behavior
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Only allow dragging when clicking on the card background
    // Prevent dragging when clicking on interactive elements
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('.book-notes') ||
      target.closest('.card-title') ||
      target.closest('.empty-notes')
    ) {
      e.stopPropagation()
    }
  }, [])

  return (
    <div className="card" onMouseDown={handleMouseDown}>
      <div className="card-header">
        <div className="card-title">
          <Book size={18} />
          Book
        </div>
        <button 
          className="preview-button"
          onClick={addNote}
        >
          <Plus size={16} /> New Note
        </button>
      </div>
      <div className="card-content">
        <div className="book-notes">
          {notes.map(note => (
            <BookNote
              key={note.id}
              note={note}
              onUpdate={updateNote}
              existingTags={allTags}
            />
          ))}
          {notes.length === 0 && (
            <div className="empty-notes">
              <p>No notes yet</p>
              <button className="add-note-button" onClick={addNote}>
                <Plus size={16} /> Create your first note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 