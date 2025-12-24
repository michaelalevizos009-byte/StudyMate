import { Injectable, signal } from '@angular/core';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: Date;
  folder?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  notes = signal<Note[]>([]);

  constructor() {
    const saved = localStorage.getItem('studymate_notes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.notes.set(parsed.map((n:any) => ({...n, lastModified: new Date(n.lastModified)})));
      } catch (e) {}
    } else {
       // Seed default note
       this.addNote({
          id: '1',
          title: 'Welcome to OTES',
          content: 'This is your new minimalistic note-taking space. \n\n- Use bullet points\n- Organize with tags\n- Use AI to summarize',
          tags: ['Tutorial', 'Welcome'],
          lastModified: new Date()
       });
    }
  }

  addNote(note: Note) {
     this.notes.update(n => [note, ...n]);
     this.save();
  }

  updateNote(id: string, updates: Partial<Note>) {
     this.notes.update(notes => notes.map(n => n.id === id ? { ...n, ...updates, lastModified: new Date() } : n));
     this.save();
  }

  deleteNote(id: string) {
     this.notes.update(notes => notes.filter(n => n.id !== id));
     this.save();
  }

  getNote(id: string) {
     return this.notes().find(n => n.id === id);
  }

  private save() {
     localStorage.setItem('studymate_notes', JSON.stringify(this.notes()));
  }
}