import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-feedback-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Trigger Button -->
    <button 
      (click)="isOpen.set(true)"
      class="fixed bottom-6 left-6 z-40 bg-white text-slate-600 hover:text-indigo-600 p-3 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 group"
      title="Send Feedback"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
      <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">Feedback</span>
    </button>

    <!-- Modal -->
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
         <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="close()"></div>
         
         <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col max-h-[90vh]">
            <div class="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
               <h3 class="font-bold text-slate-900">Send Feedback</h3>
               <button (click)="close()" class="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            @if (isSubmitted()) {
               <div class="p-12 text-center">
                  <div class="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                  <h4 class="text-xl font-bold text-slate-900 mb-2">Thank You!</h4>
                  <p class="text-slate-500 mb-6">Your feedback helps us make StudyMate better.</p>
                  <button (click)="close()" class="text-indigo-600 font-bold hover:underline">Close</button>
               </div>
            } @else {
               <div class="p-6 space-y-4">
                  <div>
                     <label class="block text-sm font-medium text-slate-700 mb-2">What's on your mind?</label>
                     <div class="flex gap-2">
                        <button (click)="type.set('bug')" [class.bg-red-50]="type() === 'bug'" [class.text-red-600]="type() === 'bug'" [class.border-red-200]="type() === 'bug'" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Bug Report</button>
                        <button (click)="type.set('suggestion')" [class.bg-indigo-50]="type() === 'suggestion'" [class.text-indigo-600]="type() === 'suggestion'" [class.border-indigo-200]="type() === 'suggestion'" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Suggestion</button>
                        <button (click)="type.set('other')" [class.bg-slate-100]="type() === 'other'" [class.text-slate-800]="type() === 'other'" [class.border-slate-300]="type() === 'other'" class="flex-1 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition">Other</button>
                     </div>
                  </div>
                  
                  <textarea 
                     [(ngModel)]="message" 
                     placeholder="Tell us what you think..." 
                     class="w-full h-32 p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-sm"
                  ></textarea>

                  <button 
                     (click)="submit()"
                     [disabled]="!message.trim()"
                     class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                     Send Feedback
                  </button>
               </div>
            }
         </div>
      </div>
    }
  `
})
export class FeedbackWidgetComponent {
  isOpen = signal(false);
  isSubmitted = signal(false);
  type = signal<'bug' | 'suggestion' | 'other'>('suggestion');
  message = '';

  feedbackService = inject(FeedbackService);
  authService = inject(AuthService);

  close() {
     this.isOpen.set(false);
     setTimeout(() => {
        this.isSubmitted.set(false);
        this.message = '';
        this.type.set('suggestion');
     }, 300);
  }

  async submit() {
     if (!this.message.trim()) return;

     await this.feedbackService.submitFeedback({
        type: this.type(),
        message: this.message,
        userEmail: this.authService.currentUser()?.email
     });

     this.isSubmitted.set(true);
  }
}