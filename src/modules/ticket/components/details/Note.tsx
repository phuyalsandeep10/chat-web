'use client';
import React, { useEffect, useState } from 'react';
import { useNotesLogic } from './logic/useNotesLogic';
import { parseISO, addMinutes, formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/button';

interface NotesProps {
  ticketId: number;
}

// Convert UTC time to Nepali time (+5:45)
const toNepaliDate = (isoDate: string) => addMinutes(parseISO(isoDate), 345);

const Notes: React.FC<NotesProps> = ({ ticketId }) => {
  const { notes, newNote, setNewNote, addNote } = useNotesLogic(ticketId);
  const [now, setNow] = useState(new Date());

  // Live timer to update "time ago" every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  return (
    <div className="border-gray-primary mx-auto max-w-md rounded-md border p-4">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center">
          <Icons.vector className="text-brand-dark h-6 w-6" />
        </div>
        <h1 className="text-brand-dark font-outfit font-semiboldtext-xl">
          Notes
        </h1>
      </div>

      {/* Notes List */}
      <div className="mb-4 space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border-gray-primary flex gap-3 rounded-md border p-2"
          >
            <div className="text-brand-dark bg-gray-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm">
              {note.avatar ? (
                <Image
                  width={32}
                  height={32}
                  src={note.avatar}
                  alt={note.author}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                note.author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-outfit text-base font-medium text-black">
                  {note.author.length > 10
                    ? `${note.author.slice(0, 10)}...`
                    : note.author}
                </h2>
                <p className="font-outfit text-gray-primary text-xs font-normal">
                  {formatDistanceToNow(toNepaliDate(note.timestamp), {
                    addSuffix: true,
                  }).replace(/^about\s/, '')}
                </p>
              </div>
              <div className="bg-brand-disable rounded-lg px-4.5 py-3 break-words whitespace-pre-wrap">
                <p className="text-brand-dark text-sm">{note.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Input */}
      <div className="flex flex-col items-end gap-2">
        <textarea
          placeholder="Add a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border-gray-light focus:ring-brand-dark focus:border-brand-dark min-h-[80px] flex-1 resize-none rounded-md border px-3 py-2 focus:ring-1 focus:outline-none"
        />
        <Button
          onClick={addNote}
          className="bg-brand-primary hover:bg-brand-primary font-outfit cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-white"
        >
          Add Note
        </Button>
      </div>
    </div>
  );
};

export default Notes;
