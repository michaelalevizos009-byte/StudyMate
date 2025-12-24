import { Injectable, signal, inject } from '@angular/core';
import { AiService } from './ai.service';
import { AuthService } from './auth.service';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string; // e.g., "10:00 AM - 11:00 AM"
  type: 'calendar' | 'study' | 'break';
  completed?: boolean;
}

export interface DayPlan {
  day: string;
  sessions: CalendarEvent[];
}

@Injectable({
  providedIn: 'root'
})
export class PlannerService {
  isCalendarConnected = signal(false);
  weeklyPlan = signal<DayPlan[]>([]);
  
  private aiService = inject(AiService);
  private authService = inject(AuthService);

  constructor() {
    const saved = localStorage.getItem('studymate_planner');
    if (saved) {
       try {
         this.weeklyPlan.set(JSON.parse(saved));
         this.isCalendarConnected.set(localStorage.getItem('studymate_cal_connected') === 'true');
       } catch(e) {}
    }
  }

  connectGoogleCalendar() {
     // Simulation
     this.isCalendarConnected.set(true);
     localStorage.setItem('studymate_cal_connected', 'true');
     return true;
  }

  getMockEvents(): any[] {
     return [
        { title: 'Math Class', time: '09:00 AM - 10:00 AM' },
        { title: 'Lunch', time: '12:00 PM - 01:00 PM' },
        { title: 'Soccer Practice', time: '04:00 PM - 06:00 PM' }
     ];
  }

  async generatePlan(subject: string, goal: string) {
     const events = this.isCalendarConnected() ? this.getMockEvents() : [];
     
     const jsonStr = await this.aiService.generateStudyPlan(subject, goal, events);
     
     try {
        let plan: DayPlan[] = JSON.parse(jsonStr);
        
        // Merge with mock calendar events for display
        if (this.isCalendarConnected()) {
           const mockDayEvents = this.getMockEvents().map(e => ({...e, id: crypto.randomUUID(), type: 'calendar' as const}));
           plan = plan.map(d => ({
              ...d,
              sessions: [...mockDayEvents, ...d.sessions].sort((a,b) => a.time.localeCompare(b.time)) // naive sort
           }));
        }

        this.weeklyPlan.set(plan);
        localStorage.setItem('studymate_planner', JSON.stringify(plan));
     } catch (e) {
        console.error("Failed to parse plan", e);
     }
  }

  markComplete(dayIndex: number, sessionIndex: number) {
     const current = this.weeklyPlan();
     if (current[dayIndex] && current[dayIndex].sessions[sessionIndex]) {
        current[dayIndex].sessions[sessionIndex].completed = !current[dayIndex].sessions[sessionIndex].completed;
        this.weeklyPlan.set([...current]);
        localStorage.setItem('studymate_planner', JSON.stringify(current));
     }
  }

  // Smart feature for Premium
  smartReschedule() {
     const current = this.weeklyPlan();
     // Mock logic: Find incomplete tasks and move them to end of list or next day (simulated shuffle)
     const updated = current.map(day => ({
        ...day,
        sessions: day.sessions.sort((a, b) => {
           if (a.completed === b.completed) return 0;
           return a.completed ? 1 : -1; // Move incomplete to top
        })
     }));
     this.weeklyPlan.set(updated);
     localStorage.setItem('studymate_planner', JSON.stringify(updated));
  }
}