import { useState } from 'react'
import { Book, Plus } from 'lucide-react'
import { Note } from '../../types'
import { BookNote } from './BookNote'

export function BookWidget() {
  const [notes, setNotes] = useState<Note[]>([])
  const [allTags, setAllTags] = useState<string[]>([])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      created: new Date().toISOString()
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ))
    const newTags = new Set(allTags)
    updatedNote.tags.forEach(tag => newTags.add(tag))
    setAllTags(Array.from(newTags))
  }

  return (
    <div className="card">
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