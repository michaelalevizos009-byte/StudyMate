import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommunityService, CommunityNote } from '../../services/community.service';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-300">
       
       <!-- Sidebar Groups (Desktop) -->
       <aside class="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full z-10 shrink-0">
          <div class="p-6 border-b border-slate-200 dark:border-slate-700">
             <div class="flex items-center gap-2 mb-1">
               <a routerLink="/app/dashboard" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">←</a>
               <h2 class="font-bold text-slate-900 dark:text-white text-lg">{{ t.translate('community') }}</h2>
             </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
             <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{{ t.translate('my_groups') }}</h3>
             <div class="space-y-2">
                <button (click)="activeFilter.set('all')" [class.bg-indigo-50]="activeFilter() === 'all'" [class.dark:bg-indigo-900/30]="activeFilter() === 'all'" [class.text-indigo-600]="activeFilter() === 'all'" [class.dark:text-indigo-400]="activeFilter() === 'all'" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-2">
                   <span>🌍</span> {{ t.translate('all_posts') }}
                </button>
                @for (group of communityService.groups(); track group.id) {
                   <button 
                     (click)="activeFilter.set(group.id)"
                     [class.bg-indigo-50]="activeFilter() === group.id"
                     [class.dark:bg-indigo-900/30]="activeFilter() === group.id"
                     [class.text-indigo-600]="activeFilter() === group.id"
                     [class.dark:text-indigo-400]="activeFilter() === group.id"
                     class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex justify-between items-center group"
                   >
                     <span># {{ group.name }}</span>
                     @if (!group.isJoined) {
                        <span (click)="$event.stopPropagation(); communityService.joinGroup(group.id)" class="text-[10px] bg-slate-200 dark:bg-slate-600 hover:bg-indigo-600 hover:text-white px-2 py-0.5 rounded text-slate-500 dark:text-slate-300 transition">{{ t.translate('join') }}</span>
                     }
                   </button>
                }
             </div>
             
             <!-- Analytics Promo (Sidebar) -->
             @if (authService.isPro()) {
                <div class="mt-8 bg-indigo-900 rounded-xl p-4 text-white text-center">
                   <p class="text-sm font-bold mb-1">Weekly Insight</p>
                   <p class="text-xs text-indigo-200 mb-3">Biology notes are trending up 40% this week.</p>
                   <button (click)="toggleAnalytics()" class="text-xs bg-white text-indigo-900 px-3 py-1.5 rounded-lg font-bold w-full">{{ t.translate('view_analytics') }}</button>
                </div>
             }
          </div>
       </aside>

       <!-- Main Feed Area -->
       <main class="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
          
          <!-- Mobile Header -->
          <header class="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 sticky top-0 z-20 flex justify-between items-center">
             <div class="flex items-center gap-3">
               <a routerLink="/app/dashboard" class="text-slate-500">←</a>
               <h1 class="font-bold text-slate-900 dark:text-white">{{ t.translate('community') }}</h1>
             </div>
             <button (click)="toggleAnalytics()" class="text-indigo-600 dark:text-indigo-400"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></button>
          </header>

          <!-- Search & Filter Bar -->
          <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-3 flex items-center gap-4 shrink-0">
             <div class="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2 flex items-center">
                  <svg class="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input [(ngModel)]="searchQuery" [placeholder]="t.translate('search')" class="bg-transparent border-none text-sm outline-none w-full placeholder:text-slate-400 dark:text-white">
             </div>
             <button (click)="toggleAnalytics()" class="hidden md:block text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 p-2 rounded-lg transition" title="Analytics">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </button>
          </div>

          <!-- Notes Grid -->
          <div class="flex-1 overflow-y-auto p-6">
             <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (post of filteredPosts(); track post.id) {
                   <div (click)="openNote(post)" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full group relative cursor-pointer">
                      
                      <!-- Report Menu (Hover) -->
                      <button (click)="$event.stopPropagation(); report(post.id)" class="absolute top-4 right-4 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition z-10" [title]="t.translate('report')">
                         <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </button>
   
                      <!-- Tags -->
                      <div class="flex flex-wrap gap-2 mb-3">
                         @for (tag of post.tags; track tag) {
                            <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border border-slate-200 dark:border-slate-600">{{ tag }}</span>
                         }
                      </div>
                      
                      <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-tight">{{ post.title }}</h3>
                      <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 leading-relaxed line-clamp-3">{{ post.preview }}</p>
   
                      <div class="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                         <div class="flex items-center gap-2">
                            <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-900 dark:to-slate-700 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-slate-700">{{ post.author.charAt(0) }}</div>
                            <div class="flex flex-col">
                               <span class="text-xs text-slate-700 dark:text-slate-300 font-bold">{{ post.author }}</span>
                               <span class="text-[10px] text-slate-400">{{ post.date | date:'MMM d' }}</span>
                            </div>
                         </div>
                         
                         <div class="flex items-center gap-3">
                            <button 
                              (click)="$event.stopPropagation(); communityService.toggleLike(post.id)"
                              class="flex items-center gap-1.5 text-xs font-bold transition px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                              [class.text-red-500]="post.isLiked"
                              [class.text-slate-400]="!post.isLiked"
                            >
                               <svg class="w-4 h-4" [class.fill-current]="post.isLiked" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                               {{ post.likes }}
                            </button>
                            <button class="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                               {{ post.comments.length }}
                            </button>
                         </div>
                      </div>
                   </div>
                }
             </div>
          </div>
       </main>

       <!-- Reading Mode Modal -->
       @if (activeNote()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="activeNote.set(null)"></div>
            <div class="bg-white dark:bg-slate-900 md:rounded-2xl shadow-2xl w-full max-w-4xl h-full md:h-[90vh] relative z-10 flex flex-col md:flex-row overflow-hidden animate-fade-in transition-colors">
               
               <!-- Content Side -->
               <div class="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <div class="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0">
                     <h2 class="text-xl font-bold text-slate-900 dark:text-white truncate pr-4">{{ activeNote()?.title }}</h2>
                     <button (click)="activeNote.set(null)" class="md:hidden text-slate-500">✕</button>
                  </div>
                  <div class="flex-1 overflow-y-auto p-8 prose prose-slate dark:prose-invert max-w-none">
                     <!-- Translation Control -->
                     <div class="mb-4 flex justify-end">
                       @if (!isTranslating()) {
                         <button (click)="translateNote()" class="text-xs flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition border border-indigo-100 dark:border-slate-600">
                           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                           {{ translatedContent() ? t.translate('original') : t.translate('translate') }}
                         </button>
                       } @else {
                          <span class="text-xs text-slate-400 flex items-center gap-2">
                             <div class="w-3 h-3 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                             {{ t.translate('translating') }}
                          </span>
                       }
                     </div>

                     <div class="whitespace-pre-wrap font-sans text-base leading-relaxed">{{ translatedContent() || activeNote()?.content }}</div>
                  </div>
                  <div class="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                     <span>{{ activeNote()?.views }} {{ t.translate('views') }}</span>
                     <button (click)="communityService.toggleSave(activeNote()!.id)" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        {{ activeNote()?.isSaved ? t.translate('saved') : t.translate('save') }}
                     </button>
                  </div>
               </div>

               <!-- Interaction Side -->
               <div class="w-full md:w-96 bg-white dark:bg-slate-800 flex flex-col h-1/2 md:h-full border-t md:border-t-0 border-slate-200 dark:border-slate-700 shrink-0">
                  <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                     <h3 class="font-bold text-slate-700 dark:text-slate-300">{{ t.translate('comments') }} ({{ activeNote()?.comments?.length }})</h3>
                     <button (click)="activeNote.set(null)" class="hidden md:block text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
                  </div>
                  
                  <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                     @if (activeNote()?.comments?.length === 0) {
                        <div class="text-center py-10 text-slate-400 text-sm">{{ t.translate('no_comments') }}</div>
                     }
                     @for (comment of activeNote()?.comments; track comment.id) {
                        <div class="flex gap-3 animate-fade-in">
                           <div class="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">{{ comment.author.charAt(0) }}</div>
                           <div class="bg-white dark:bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm text-sm">
                              <span class="font-bold text-slate-900 dark:text-white block text-xs mb-1">{{ comment.author }}</span>
                              <p class="text-slate-600 dark:text-slate-300">{{ comment.text }}</p>
                           </div>
                        </div>
                     }
                  </div>

                  <div class="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                     <div class="relative">
                        <input 
                           [(ngModel)]="newComment" 
                           (keyup.enter)="postComment()"
                           [placeholder]="t.translate('add_comment')" 
                           class="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition"
                        >
                        <button (click)="postComment()" [disabled]="!newComment.trim()" class="absolute right-2 top-2 p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-600 rounded-lg disabled:opacity-30">
                           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       }

       <!-- Analytics Modal -->
       @if (showAnalytics()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="showAnalytics.set(false)"></div>
             <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative p-8 animate-fade-in overflow-hidden border border-slate-200 dark:border-slate-700">
                @if (authService.isPro()) {
                   <div class="flex justify-between items-center mb-6">
                      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Community Insights</h2>
                      <button (click)="showAnalytics.set(false)" class="text-slate-400 hover:text-slate-600">✕</button>
                   </div>
                   <div class="grid grid-cols-3 gap-4 mb-8">
                      <div class="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl">
                         <p class="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase">Trending</p>
                         <p class="text-xl font-bold text-slate-900 dark:text-white">Biology</p>
                      </div>
                      <div class="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                         <p class="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Your Views</p>
                         <p class="text-xl font-bold text-slate-900 dark:text-white">12k</p>
                      </div>
                      <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                         <p class="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Top Post</p>
                         <p class="text-xl font-bold text-slate-900 dark:text-white">Math Cheat Sheet</p>
                      </div>
                   </div>
                } @else {
                   <div class="text-center py-10">
                      <div class="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div>
                      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Unlock Insights</h2>
                      <p class="text-slate-500 mb-8 max-w-sm mx-auto">See trending topics and global study patterns with StudyMate Pro.</p>
                      <a routerLink="/app/upgrade" class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">Upgrade</a>
                   </div>
                }
             </div>
          </div>
       }
    </div>
  `
})
export class CommunityComponent {
  communityService = inject(CommunityService);
  authService = inject(AuthService);
  t = inject(TranslationService);
  aiService = inject(AiService);
  
  showAnalytics = signal(false);
  activeNote = signal<CommunityNote | null>(null);
  activeFilter = signal<string>('all');
  searchQuery = '';
  newComment = '';

  // Translation State
  translatedContent = signal<string | null>(null);
  isTranslating = signal(false);

  filteredPosts = computed(() => {
    let posts = this.communityService.posts();
    
    // Filter by Search
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    // Filter by Group
    const filter = this.activeFilter();
    if (filter !== 'all') {
      posts = posts.filter(p => p.groupId === filter);
    }
    
    return posts;
  });

  toggleAnalytics() {
     this.showAnalytics.set(true);
  }

  openNote(note: CommunityNote) {
     this.activeNote.set(note);
     this.communityService.incrementView(note.id);
     this.translatedContent.set(null); // Reset translation on open
  }

  postComment() {
     const note = this.activeNote();
     if (note && this.newComment.trim()) {
        const user = this.authService.currentUser()?.name || 'Anonymous';
        this.communityService.addComment(note.id, user, this.newComment);
        this.newComment = '';
     }
  }

  report(id: string) {
     if(confirm("Report this content for violating community guidelines?")) {
        alert("Thank you. We have received your report and will review it shortly.");
     }
  }

  async translateNote() {
    if (this.translatedContent()) {
       this.translatedContent.set(null); // Toggle back to original
       return;
    }
    
    const note = this.activeNote();
    if (!note) return;

    this.isTranslating.set(true);
    const targetLang = this.t.currentLang() === 'es' ? 'Spanish' : this.t.currentLang() === 'fr' ? 'French' : 'English';
    
    const translated = await this.aiService.translateContent(note.content, targetLang);
    this.translatedContent.set(translated);
    this.isTranslating.set(false);
  }
}