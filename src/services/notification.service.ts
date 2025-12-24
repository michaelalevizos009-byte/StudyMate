import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  date: Date;
  link?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal(0);

  constructor() {
    // Seed some notifications
    this.add({
      title: 'Welcome to StudyMate!',
      message: 'Connect your Google Calendar to get smart study reminders.',
      type: 'info',
      link: '/app/planner'
    });
  }

  add(n: Omit<AppNotification, 'id' | 'date' | 'read'>) {
    const newNote: AppNotification = {
      ...n,
      id: crypto.randomUUID(),
      date: new Date(),
      read: false
    };
    this.notifications.update(current => [newNote, ...current]);
    this.updateCount();
  }

  markAsRead(id: string) {
    this.notifications.update(current => 
      current.map(n => n.id === id ? { ...n, read: true } : n)
    );
    this.updateCount();
  }

  markAllRead() {
    this.notifications.update(current => current.map(n => ({ ...n, read: true })));
    this.updateCount();
  }

  private updateCount() {
    this.unreadCount.set(this.notifications().filter(n => !n.read).length);
  }
}