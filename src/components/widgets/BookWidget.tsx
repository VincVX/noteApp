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

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target?.closest('[data-notes]') ||
      target?.closest('[data-title]') ||
      target?.closest('[data-empty]')
    ) {
      e.stopPropagation()
    }
  }, [])

  return (
    <>
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden h-full flex flex-col transition-all duration-200 hover:border-white/10 hover:bg-white/[0.03]" onMouseDown={handleMouseDown}>
        <div className="card-header h-[52px] px-5 border-b border-white/[0.05] flex justify-between items-center bg-transparent">
          <div className="text-sm font-medium text-white/90 flex items-center gap-2" data-title aria-label="Book notes">
            <Book size={16} />
            Book
          </div>
          <button 
            className="bg-white/[0.05] text-white/80 border-none px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10 flex items-center gap-1.5 h-8 mr-11"
            onClick={addNote}
          >
            <Plus size={16} /> New Note
          </button>
        </div>
        <div className="p-5 flex-1 overflow-hidden">
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto p-1" data-notes>
            {notes.map(note => (
              <div 
                key={note.id} 
                className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 cursor-pointer relative transition-all duration-200 hover:bg-white/[0.03] hover:border-white/10 hover:-translate-y-0.5" 
                onClick={() => setSelectedNote(note)}
              >
                <h3 className="text-[0.95rem] font-medium text-white/90 mb-2">{note.title || 'Untitled Note'}</h3>
                <p className="text-white/60 text-sm mb-2 line-clamp-2 leading-relaxed">
                  {note.content.slice(0, 100)}{note.content.length > 100 ? '...' : ''}
                </p>
                <div className="flex items-center justify-between mt-3 text-xs text-white/40">
                  <span>{new Date(note.created).toLocaleDateString()}</span>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1.5">
                      {note.tags.map(tag => (
                        <span key={tag} className="bg-white/[0.06] px-2 py-0.5 rounded text-white/60">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  className="absolute top-3 right-3 bg-transparent border-none text-white/40 cursor-pointer p-1 rounded opacity-0 transition-all duration-200 hover:bg-white/10 hover:text-white/90 group-hover:opacity-100 flex items-center justify-center"
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
              <div className="flex flex-col items-center justify-center py-8" data-empty>
                <p className="text-white/40 mb-4">No notes yet</p>
                <button 
                  className="flex items-center gap-2 bg-white/[0.05] text-white/80 border-none px-4 py-2 rounded-lg cursor-pointer text-sm transition-all duration-150 hover:bg-white/10"
                  onClick={addNote}
                >
                  <Plus size={16} /> Create your first note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedNote && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000] px-[15%] py-[5%] backdrop-blur-sm">
          <div className="bg-[#1a1a1a]/95 rounded-xl w-full h-full relative overflow-hidden shadow-lg border border-white/[0.05]">
            <button 
              className="absolute top-5 right-5 bg-white/[0.05] border-none text-white/80 cursor-pointer p-1.5 rounded-lg z-10 transition-all duration-150 hover:bg-white/10 flex items-center justify-center w-8 h-8" 
              onClick={() => setSelectedNote(null)}
            >
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