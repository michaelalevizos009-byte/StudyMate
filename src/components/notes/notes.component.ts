import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteService, Note } from '../../services/note.service';
import { AiService } from '../../services/ai.service';
import { CommunityService } from '../../services/community.service';
import { AuthService } from '../../services/auth.service';
import { IntegrationService } from '../../services/integration.service';
import { NotificationService } from '../../services/notification.service';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flex flex-col md:flex-row h-screen overflow-hidden relative z-10">
       
       <!-- Sidebar List (Glass) -->
       <aside class="w-full md:w-80 glass-sun dark:glass-moon border-r border-white/50 dark:border-white/5 flex flex-col h-[40vh] md:h-full z-10 shadow-sun dark:shadow-moon">
          <div class="p-4 border-b border-white/20 flex justify-between items-center bg-white/20 dark:bg-white/5 backdrop-blur-sm sticky top-0">
             <div class="flex items-center gap-2">
                <a routerLink="/app/dashboard" class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition">←</a>
                <h2 class="font-bold text-slate-800 dark:text-white">My Notes</h2>
             </div>
             <button (click)="createNote()" class="bg-orange-50 dark:bg-indigo-900/30 text-orange-600 dark:text-indigo-400 p-2 rounded-lg hover:bg-orange-100 dark:hover:bg-indigo-900/50 transition border border-orange-100 dark:border-indigo-900/50">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
             </button>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-1">
             @for (note of noteService.notes(); track note.id) {
                <button 
                  (click)="selectNote(note)"
                  class="w-full text-left p-3 rounded-lg transition group border border-transparent hover:shadow-sm"
                  [class.bg-white]="selectedNote()?.id === note.id"
                  [class.shadow-sun-card]="selectedNote()?.id === note.id"
                  [class.dark:bg-slate-800]="selectedNote()?.id === note.id"
                  [class.text-slate-900]="selectedNote()?.id === note.id"
                  [class.dark:text-white]="selectedNote()?.id === note.id"
                  [class.text-slate-600]="selectedNote()?.id !== note.id"
                  [class.dark:text-slate-400]="selectedNote()?.id !== note.id"
                  [class.hover:bg-white/50]="selectedNote()?.id !== note.id"
                  [class.dark:hover:bg-white/5]="selectedNote()?.id !== note.id"
                >
                   <h3 class="font-bold text-sm truncate">{{ note.title || 'Untitled Note' }}</h3>
                   <p class="text-xs text-slate-400 mt-1 truncate">{{ note.content.substring(0, 40) }}...</p>
                   <div class="flex gap-1 mt-2">
                      @for (tag of note.tags; track tag) {
                         <span class="text-[9px] bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">{{ tag }}</span>
                      }
                   </div>
                </button>
             }
          </div>
       </aside>

       <!-- Editor Area (Paper feel) -->
       <main class="flex-1 flex flex-col relative h-full bg-sun-50/50 dark:bg-moon-950/50 backdrop-blur-sm">
          @if (selectedNote()) {
             <!-- Toolbar -->
             <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur border-b border-white/20 dark:border-white/5 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
                <input 
                  [(ngModel)]="activeTitle" 
                  (ngModelChange)="saveChanges()"
                  class="text-lg font-bold text-slate-800 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  placeholder="Note Title"
                >
                <div class="flex items-center gap-2">
                   <!-- AI Assist Dropdown -->
                   <div class="relative group z-20">
                      <button class="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition border border-indigo-100 dark:border-indigo-800/50">
                         <span>✨ AI Assist</span>
                      </button>
                      <div class="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                         <button (click)="aiAction('fix')" class="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Fix Grammar</button>
                         <button (click)="aiAction('summarize')" class="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Summarize</button>
                         <button (click)="aiAction('expand')" class="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg">Expand</button>
                      </div>
                   </div>

                   <!-- Save to Drive -->
                   <button 
                     (click)="saveToDrive()" 
                     [disabled]="isSavingToDrive()"
                     class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border border-transparent"
                     [class.text-green-700]="isDriveSynced()"
                     [class.bg-green-50]="isDriveSynced()"
                     [class.border-green-200]="isDriveSynced()"
                     [class.text-slate-600]="!isDriveSynced()"
                     [class.dark:text-slate-400]="!isDriveSynced()"
                     [class.hover:bg-slate-100]="!isDriveSynced()"
                     [class.dark:hover:bg-slate-700]="!isDriveSynced()"
                     title="Save to Google Drive"
                   >
                      @if (isDriveSynced()) {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                      } @else {
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" class="w-4 h-4">
                      }
                      
                      {{ isSavingToDrive() ? 'Saving...' : (isDriveSynced() ? 'Saved' : 'Save') }}
                   </button>

                   <!-- Share Button -->
                   <button (click)="openShareModal()" class="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      Share
                   </button>

                   <button (click)="deleteCurrent()" class="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
             </div>
             
             <!-- Text Area -->
             <div class="flex-1 w-full relative">
                 <textarea 
                    [(ngModel)]="activeContent"
                    (ngModelChange)="saveChanges()"
                    class="absolute inset-0 w-full h-full p-8 bg-transparent resize-none outline-none text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-sm"
                    placeholder="Start typing..."
                 ></textarea>
             </div>
             
             <!-- Status Footer -->
             <div class="px-6 py-2 bg-white/50 dark:bg-slate-900/50 border-t border-white/20 dark:border-white/5 text-xs text-slate-400 flex justify-between backdrop-blur-sm">
                <span>{{ wordCount() }} words</span>
                <span>{{ isSaving() ? 'Saving...' : 'Saved locally' }}</span>
             </div>

          } @else {
             <div class="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <p>Select a note or create a new one</p>
             </div>
          }
       </main>

       <!-- Share Modal -->
       @if (isSharing()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="isSharing.set(false)"></div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-glow-sun dark:shadow-glow-moon w-full max-w-md relative p-6 animate-fade-in z-50 border border-slate-100 dark:border-slate-700">
               <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Share to Community</h3>
               
               <div class="space-y-4">
                  <div>
                     <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Visibility</label>
                     <div class="flex gap-2">
                        <button (click)="shareVisibility.set('public')" [class.bg-indigo-600]="shareVisibility() === 'public'" [class.text-white]="shareVisibility() === 'public'" [class.bg-slate-100]="shareVisibility() !== 'public'" [class.dark:bg-slate-700]="shareVisibility() !== 'public'" [class.dark:text-slate-300]="shareVisibility() !== 'public'" class="flex-1 py-2 rounded-lg text-sm font-bold transition">Public</button>
                        <button (click)="shareVisibility.set('class')" [class.bg-indigo-600]="shareVisibility() === 'class'" [class.text-white]="shareVisibility() === 'class'" [class.bg-slate-100]="shareVisibility() !== 'class'" [class.dark:bg-slate-700]="shareVisibility() !== 'class'" [class.dark:text-slate-300]="shareVisibility() !== 'class'" class="flex-1 py-2 rounded-lg text-sm font-bold transition">Class Only</button>
                     </div>
                  </div>

                  <div>
                     <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Group (Optional)</label>
                     <select [(ngModel)]="shareGroupId" class="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500">
                        <option [value]="null">No specific group</option>
                        @for (group of communityService.groups(); track group.id) {
                           <option [value]="group.id">{{ group.name }}</option>
                        }
                     </select>
                  </div>

                  @if (moderationError()) {
                     <div class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg border border-red-100 dark:border-red-800 flex items-start gap-2">
                        <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>{{ moderationError() }}</span>
                     </div>
                  }

                  <button (click)="publish()" [disabled]="isPublishing()" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                     @if (isPublishing()) { <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> }
                     <span>{{ isPublishing() ? 'Moderating & Publishing...' : 'Publish Note' }}</span>
                  </button>
               </div>
            </div>
         </div>
       }
    </div>
  `
})
export class NotesComponent implements OnInit {
  noteService = inject(NoteService);
  aiService = inject(AiService);
  communityService = inject(CommunityService);
  authService = inject(AuthService);
  integrationService = inject(IntegrationService);
  notificationService = inject(NotificationService);
  spotifyService = inject(SpotifyService);

  selectedNote = signal<Note | null>(null);
  activeTitle = '';
  activeContent = '';
  isSaving = signal(false);
  isSavingToDrive = signal(false);
  isDriveSynced = signal(false);

  // Sharing State
  isSharing = signal(false);
  isPublishing = signal(false);
  shareVisibility = signal<'public' | 'class'>('public');
  shareGroupId: string | null = null;
  moderationError = signal('');

  wordCount = computed(() => this.activeContent.split(/\s+/).filter(w => w.length > 0).length);

  ngOnInit() {
     // Set music context to focus when entering notes
     this.spotifyService.setContext('focus');
  }

  createNote() {
     const newNote: Note = {
        id: crypto.randomUUID(),
        title: '',
        content: '',
        tags: [],
        lastModified: new Date()
     };
     this.noteService.addNote(newNote);
     this.selectNote(newNote);
  }

  selectNote(note: Note) {
     this.selectedNote.set(note);
     this.activeTitle = note.title;
     this.activeContent = note.content;
     this.isDriveSynced.set(false);
  }

  saveChanges() {
     const current = this.selectedNote();
     if (current) {
        this.isSaving.set(true);
        this.noteService.updateNote(current.id, {
           title: this.activeTitle,
           content: this.activeContent
        });
        setTimeout(() => this.isSaving.set(false), 500);
     }
  }

  deleteCurrent() {
     const current = this.selectedNote();
     if (current && confirm("Delete this note?")) {
        this.noteService.deleteNote(current.id);
        this.selectedNote.set(null);
     }
  }

  async aiAction(type: 'fix' | 'summarize' | 'expand') {
     if (!this.activeContent) return;
     const result = await this.aiService.enhanceNotes(this.activeContent, type);
     
     if (type === 'summarize') {
        this.activeContent += `\n\n--- AI Summary ---\n${result}`;
     } else {
        if (type === 'fix') this.activeContent = result;
        else this.activeContent += `\n\n${result}`;
     }
     this.saveChanges();
  }

  openShareModal() {
     if (!this.activeContent) {
        alert("Cannot share an empty note.");
        return;
     }
     this.isSharing.set(true);
     this.moderationError.set('');
  }

  async publish() {
     this.isPublishing.set(true);
     this.moderationError.set('');
     
     // 1. Moderate Content
     const safety = await this.aiService.moderateContent(this.activeTitle + "\n" + this.activeContent);
     
     if (!safety.safe) {
        this.moderationError.set(`Content flagged: ${safety.reason || 'Unsafe content detected'}. Please edit and try again.`);
        this.isPublishing.set(false);
        return;
     }

     // 2. Publish
     const note = this.selectedNote();
     if (note) {
        this.communityService.publishNote({
           title: this.activeTitle || 'Untitled',
           content: this.activeContent,
           tags: note.tags,
           visibility: this.shareVisibility(),
           groupId: this.shareGroupId || undefined,
           author: this.authService.currentUser()?.name || 'Anonymous'
        });
     }

     this.isPublishing.set(false);
     this.isSharing.set(false);
     this.notificationService.add({
       title: 'Published',
       message: 'Note published successfully to Community!',
       type: 'success'
     });
  }

  async saveToDrive() {
    if (!this.activeContent) return;
    
    // Check connection
    if (!this.integrationService.isConnected('google_drive')) {
       const connected = await this.integrationService.toggleConnection('google_drive');
       if (!connected) return;
    }

    this.isSavingToDrive.set(true);
    try {
       const url = await this.integrationService.saveFileToDrive(this.activeTitle || 'Untitled Note', this.activeContent, 'text');
       this.isDriveSynced.set(true);
       
       this.notificationService.add({
         title: 'Saved to Drive',
         message: 'Your note has been successfully saved to Google Drive.',
         type: 'success',
         link: url
       });
       
       // Reset visual checkmark after a delay
       setTimeout(() => this.isDriveSynced.set(false), 4000);

    } catch(e) {
       this.notificationService.add({
         title: 'Save Failed',
         message: 'Could not save to Google Drive.',
         type: 'alert'
       });
    } finally {
       this.isSavingToDrive.set(false);
    }
  }
}