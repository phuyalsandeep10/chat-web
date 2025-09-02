// useNotesLogic.ts
'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/apiConfigs/axiosInstance';

// ------------------ TYPES ------------------
export interface Note {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
}

// ------------------ LOGIC HOOK ------------------
export const useNotesLogic = (ticketId: number) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  // Fetch notes from API
  const fetchNotes = async () => {
    try {
      const res = await axiosInstance.get(`/tickets/${ticketId}`);
      const ticketData = res.data.data;

      const mappedNotes: Note[] = (ticketData.all_notes || []).map(
        (note: any) => ({
          id: note.id.toString(),
          author: note.created_by?.name || 'Unknown',
          avatar: note.created_by?.image || '',
          content: note.content,
          timestamp: note.updated_at || note.created_at,
        }),
      );

      setNotes(mappedNotes);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  };

  // Add new note
  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      await axiosInstance.post(`/tickets/notes/${ticketId}`, {
        notes: newNote,
      });
      setNewNote('');
      fetchNotes(); // Refresh after adding
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  // Auto-fetch on ticket change
  useEffect(() => {
    fetchNotes();
  }, [ticketId]);

  return {
    notes,
    newNote,
    setNewNote,
    addNote,
  };
};
