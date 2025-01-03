import React, { useState, useCallback } from 'react'
import { Book, Plus, X } from 'lucide-react'
import { Note } from '../../types'
import { BookNote } from './BookNote'

interface BookWidgetProps {
  onDelete: () => void
}

export function BookWidget({ onDelete }: BookWidgetProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

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
    
    // Also update the selected note if it's being edited in overlay
    if (selectedNote?.id === updatedNote.id) {
      setSelectedNote(updatedNote)
    }
  }, [notes, allTags, selectedNote])

  const deleteNote = useCallback((noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(null)
    }
  }, [notes, selectedNote])

  // Handle mouse down for drag behavior
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Only allow dragging when clicking on the card background
    // Prevent dragging when clicking on interactive elements
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target?.closest('.book-notes') ||
      target?.closest('.card-title') ||
      target?.closest('.empty-notes')
    ) {
      e.stopPropagation()
    }
  }, [])

  return (
    <>
      <div className="card" onMouseDown={handleMouseDown}>
        <div className="card-header">
          <div className="card-title" aria-label="Book notes">
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
              <div key={note.id} className="book-note-preview" onClick={() => setSelectedNote(note)}>
                <h3>{note.title || 'Untitled Note'}</h3>
                <p className="note-preview">
                  {note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}
                </p>
                <div className="note-preview-meta">
                  <span>{new Date(note.created).toLocaleDateString()}</span>
                  {note.tags.length > 0 && (
                    <div className="note-preview-tags">
                      {note.tags.map(tag => (
                        <span key={tag} className="note-tag-preview">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  className="delete-note" 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNote(note.id)
                  }}
                >
                  <X size={14} />
                </button>
              </div>
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

      {selectedNote && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-overlay" onClick={() => setSelectedNote(null)}>
              <X size={20} />
            </button>
            <BookNote
              note={selectedNote}
              onUpdate={updateNote}
              existingTags={allTags}
              isOverlay={true}
            />
          </div>
        </div>
      )}
    </>
  )
} 