import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlannerService, DayPlan, CalendarEvent } from '../../services/planner.service';
import { AuthService } from '../../services/auth.service';
import { IntegrationService } from '../../services/integration.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 pb-20 md:pb-0">
       <!-- Header -->
       <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
         <div class="flex items-center gap-3">
            <a routerLink="/app/dashboard" class="text-slate-500 hover:text-slate-900 transition">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </a>
            <h1 class="font-bold text-slate-900 text-lg">StudyFlow Planner</h1>
         </div>
         <div class="flex gap-2">
            <!-- Smart Reminders Toggle -->
            <button (click)="toggleReminders()" [class.text-indigo-600]="remindersEnabled()" [class.bg-indigo-50]="remindersEnabled()" class="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 px-3 py-1.5 rounded-lg border border-transparent hover:bg-slate-100 transition">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               Smart Reminders {{ remindersEnabled() ? 'On' : 'Off' }}
            </button>

            @if (integrationService.isConnected('google_calendar')) {
               <button (click)="syncCalendar()" class="hidden sm:flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100 transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" class="w-3 h-3"> 
                  {{ isSyncing() ? 'Syncing...' : 'Sync Calendar' }}
               </button>
            }
            
            @if (authService.isPro()) {
               <button (click)="optimize()" class="hidden sm:flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition">
                  <span>✨</span> Magic Optimize
               </button>
            }

            <button 
              (click)="showCreateModal.set(true)"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              <span>+</span> <span class="hidden sm:inline">New Plan</span>
            </button>
         </div>
       </header>

       <main class="max-w-4xl mx-auto p-6 animate-fade-in">
          
          @if (!integrationService.isConnected('google_calendar')) {
             <div class="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-8 text-white mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div class="relative z-10">
                   <h2 class="text-xl font-bold mb-2">Sync with Google Calendar</h2>
                   <p class="text-indigo-200 text-sm max-w-md leading-relaxed">Let StudyMate AI analyze your free time and automatically insert optimized study blocks around your life.</p>
                </div>
                <button (click)="connectCalendar()" class="relative z-10 bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg whitespace-nowrap flex items-center gap-2">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" class="w-5 h-5" alt="">
                   Connect Calendar
                </button>
                <!-- Decor -->
                <div class="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full -ml-8 -mb-8 blur-2xl"></div>
             </div>
          }

          @if (plannerService.weeklyPlan().length === 0) {
             <div class="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
                <div class="h-20 w-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📅</div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">No Study Plans Yet</h3>
                <p class="text-slate-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">Tell us your exam date and subject, and we'll build a perfect schedule for you.</p>
                <button (click)="showCreateModal.set(true)" class="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition">Create my first plan</button>
             </div>
          } @else {
             <div class="space-y-8">
                @for (day of plannerService.weeklyPlan(); track day.day; let dIndex = $index) {
                   <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div class="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                         <h3 class="font-bold text-slate-900 text-lg">{{ day.day }}</h3>
                         <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white border border-slate-200 px-2 py-1 rounded">{{ day.sessions.length }} Events</span>
                      </div>
                      <div class="divide-y divide-slate-100 relative">
                         <!-- Vertical timeline line -->
                         <div class="absolute left-[6.5rem] top-0 bottom-0 w-px bg-slate-100 hidden sm:block"></div>

                         @for (session of day.sessions; track session.id; let sIndex = $index) {
                            <div class="p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition group relative">
                               
                               <!-- Time Column -->
                               <div class="w-24 text-xs font-mono text-slate-500 shrink-0 font-medium sm:text-right pt-1 sm:pt-0">
                                  {{ session.time.split('-')[0] }}
                               </div>

                               <!-- Content -->
                               <div class="flex-1 flex items-center gap-4 pl-2 sm:pl-0 border-l-2 sm:border-l-0 border-indigo-100 sm:border-transparent">
                                  <!-- Status Checkbox -->
                                  <button 
                                    (click)="plannerService.markComplete(dIndex, sIndex)"
                                    class="h-6 w-6 rounded-full border-2 flex items-center justify-center transition shrink-0 bg-white"
                                    [class.border-slate-300]="!session.completed && session.type === 'study'"
                                    [class.border-green-500]="session.completed"
                                    [class.bg-green-500]="session.completed"
                                    [class.opacity-0]="session.type === 'calendar'"
                                    [disabled]="session.type === 'calendar'"
                                  >
                                     @if (session.completed) { <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg> }
                                  </button>

                                  <div class="flex-1">
                                     <div class="flex items-center gap-2 mb-0.5">
                                        <h4 
                                          class="font-bold text-sm sm:text-base"
                                          [class.text-slate-900]="!session.completed"
                                          [class.text-slate-400]="session.completed"
                                          [class.line-through]="session.completed"
                                        >{{ session.title }}</h4>
                                     </div>
                                     <p class="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">{{ session.type }}</p>
                                  </div>

                                  <!-- Type Badge (Visual Only) -->
                                  <div 
                                    class="w-2 h-2 rounded-full shrink-0"
                                    [class.bg-indigo-500]="session.type === 'study'"
                                    [class.bg-orange-400]="session.type === 'break'"
                                    [class.bg-slate-300]="session.type === 'calendar'"
                                  ></div>
                               </div>
                            </div>
                         }
                      </div>
                   </div>
                }
             </div>
             
             <!-- Action Footer -->
             <div class="mt-8 flex justify-center">
                <button (click)="addToGoogleCalendar()" class="text-indigo-600 font-bold hover:bg-indigo-50 px-6 py-3 rounded-xl transition flex items-center gap-2 text-sm shadow-sm border border-indigo-100">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" class="w-4 h-4">
                   Push Plan to Google Calendar
                </button>
             </div>
          }
       </main>

       <!-- Create Modal -->
       @if (showCreateModal()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="showCreateModal.set(false)"></div>
             <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-8 animate-fade-in">
                <div class="flex justify-between items-center mb-6">
                   <h2 class="text-xl font-bold text-slate-900">Generate Study Plan</h2>
                   <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-slate-600">✕</button>
                </div>
                
                <div class="space-y-5">
                   <div>
                      <label class="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                      <input [(ngModel)]="newSubject" placeholder="e.g. AP Chemistry" class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition">
                   </div>
                   <div>
                      <label class="block text-sm font-bold text-slate-700 mb-2">Study Goal</label>
                      <textarea [(ngModel)]="newGoal" placeholder="e.g. Prepare for midterm covering stoichiometry and gas laws." class="w-full p-3 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-none"></textarea>
                   </div>
                   
                   <div class="p-4 bg-indigo-50 rounded-xl text-xs text-indigo-700 leading-relaxed border border-indigo-100">
                      <strong>AI Logic:</strong> I will analyze your connected calendar (or a sample schedule) and insert study blocks during your free time.
                   </div>

                   <button (click)="generate()" [disabled]="isGenerating() || !newSubject || !newGoal" class="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none">
                      @if (isGenerating()) { <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> }
                      <span>{{ isGenerating() ? 'Optimizing Schedule...' : 'Generate Perfect Plan' }}</span>
                   </button>
                </div>
             </div>
          </div>
       }
    </div>
  `
})
export class PlannerComponent {
  plannerService = inject(PlannerService);
  authService = inject(AuthService);
  integrationService = inject(IntegrationService);
  showCreateModal = signal(false);
  isGenerating = signal(false);
  remindersEnabled = signal(false);
  isSyncing = signal(false);
  newSubject = '';
  newGoal = '';

  async connectCalendar() {
     await this.integrationService.toggleConnection('google_calendar');
     if (this.integrationService.isConnected('google_calendar')) {
        this.plannerService.connectGoogleCalendar(); 
     }
  }

  async syncCalendar() {
     this.isSyncing.set(true);
     try {
       const events = await this.integrationService.syncCalendarEvents();
       // In a real app, integrate these events into the weekly plan
       alert(`Synced ${events.length} new events from Google Calendar.`);
     } catch(e) {
       alert("Sync failed");
     } finally {
       this.isSyncing.set(false);
     }
  }

  async generate() {
     if (!this.newSubject || !this.newGoal) return;
     this.isGenerating.set(true);
     await this.plannerService.generatePlan(this.newSubject, this.newGoal);
     this.isGenerating.set(false);
     this.showCreateModal.set(false);
  }

  optimize() {
     if (this.plannerService.weeklyPlan().length === 0) {
        alert("Create a plan first!");
        return;
     }
     if (confirm("Magic Optimize will reschedule incomplete tasks to free slots. Continue?")) {
        this.plannerService.smartReschedule();
        alert("Schedule optimized for maximum productivity! 🚀");
     }
  }

  toggleReminders() {
     this.remindersEnabled.update(v => !v);
     if (this.remindersEnabled()) {
        alert("Smart reminders enabled! We'll send you notifications 10 minutes before study blocks.");
     }
  }

  async addToGoogleCalendar() {
     if (!this.integrationService.isConnected('google_calendar')) {
        alert("Please connect your Google Calendar first.");
        return;
     }
     await this.integrationService.pushToCalendar(this.plannerService.weeklyPlan());
     alert("Syncing your plan to Google Calendar... Done!");
  }
}