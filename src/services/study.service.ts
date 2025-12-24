import { Injectable, signal, effect } from '@angular/core';

export interface StudySession {
  id: string;
  title: string;
  type: 'notes' | 'summary' | 'quiz' | 'explain' | 'comprehensive';
  date: Date;
  content: string; // The generated result (JSON string for comprehensive)
  originalInput: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  sessions = signal<StudySession[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('studymate_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Re-hydrate Date objects
        const hydrated = parsed.map((s: any) => ({
          ...s,
          date: new Date(s.date)
        }));
        this.sessions.set(hydrated);
      }
    } catch (e) {
      console.warn('Failed to load sessions from storage', e);
    }
  }

  private saveToStorage(sessions: StudySession[]) {
    try {
      localStorage.setItem('studymate_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions to storage', e);
    }
  }

  addSession(session: StudySession) {
    this.sessions.update(current => {
      const updated = [session, ...current];
      this.saveToStorage(updated);
      return updated;
    });
  }

  getSession(id: string) {
    return this.sessions().find(s => s.id === id);
  }

  deleteSession(id: string) {
    this.sessions.update(current => {
      const updated = current.filter(s => s.id !== id);
      this.saveToStorage(updated);
      return updated;
    });
  }
}