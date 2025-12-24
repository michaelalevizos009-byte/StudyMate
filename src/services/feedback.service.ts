import { Injectable, signal } from '@angular/core';

export interface FeedbackItem {
  id: string;
  type: 'bug' | 'suggestion' | 'other';
  message: string;
  date: Date;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  
  constructor() {}

  submitFeedback(item: Omit<FeedbackItem, 'id' | 'date'>): Promise<boolean> {
     // In a real app, this would post to an API.
     // For now, we simulate success and log it / store in localStorage for demo purposes.
     
     const newItem: FeedbackItem = {
        ...item,
        id: crypto.randomUUID(),
        date: new Date()
     };

     try {
        const existing = JSON.parse(localStorage.getItem('studymate_feedback') || '[]');
        existing.push(newItem);
        localStorage.setItem('studymate_feedback', JSON.stringify(existing));
        console.log('Feedback submitted:', newItem);
        return Promise.resolve(true);
     } catch (e) {
        console.error('Failed to save feedback', e);
        return Promise.resolve(false);
     }
  }
}