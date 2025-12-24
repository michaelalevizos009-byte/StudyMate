import { Component, inject, signal, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { MusicPlayerComponent } from './components/music/music-player.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, MusicPlayerComponent],
  template: `
    <!-- Ambient Lighting Layers (Global) -->
    <div class="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
       <!-- Sunlight Layer (Light Mode) -->
       <div class="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-transparent to-blue-50/20 opacity-100 dark:opacity-0 transition-opacity duration-1000"></div>
       <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-200/20 rounded-full blur-[120px] opacity-100 dark:opacity-0 transition-opacity duration-1000 animate-breathe"></div>
       
       <!-- Moonlight Layer (Dark Mode) -->
       <div class="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-moon-950 to-slate-900/40 opacity-0 dark:opacity-100 transition-opacity duration-1000"></div>
       <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-1000 animate-breathe"></div>
    </div>

    <!-- Landing / Auth Layout (No Shell) -->
    @if (!showLayout()) {
      <div class="relative z-10">
         <router-outlet></router-outlet>
      </div>
    } 
    
    <!-- App Layout (Shell) -->
    @else {
      <div class="flex h-screen overflow-hidden relative z-10">
        
        <!-- Desktop Sidebar (Glass) -->
        <aside class="hidden md:flex flex-col w-72 glass-sun dark:glass-moon border-r border-white/40 dark:border-white/5 h-full shrink-0 z-30 relative shadow-sun dark:shadow-moon transition-all duration-500">
           
           <!-- Logo Area -->
           <div class="p-8 pb-4">
              <div class="flex items-center gap-3 group cursor-pointer">
                 <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 dark:from-indigo-500 dark:to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-500">S</div>
                 <div>
                    <h1 class="font-bold text-slate-800 dark:text-white tracking-tight">StudyMate</h1>
                    <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold group-hover:text-orange-500 dark:group-hover:text-indigo-400 transition-colors">AI Assistant</span>
                 </div>
              </div>
           </div>

           <!-- Navigation Tabs -->
           <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <a routerLink="/app/dashboard" routerLinkActive="bg-white/80 dark:bg-white/10 shadow-sun dark:shadow-moon text-orange-600 dark:text-indigo-300 font-bold" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all group">
                 <span class="text-xl group-hover:scale-110 transition opacity-80 group-hover:opacity-100">🏠</span>
                 Dashboard
              </a>
              
              <div class="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400/80 uppercase tracking-widest">Study Tools</div>
              
              <a routerLink="/app/notes" routerLinkActive="bg-white/80 dark:bg-white/10 shadow-sun dark:shadow-moon text-orange-600 dark:text-indigo-300 font-bold" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all group">
                 <span class="text-xl group-hover:scale-110 transition opacity-80 group-hover:opacity-100">📝</span>
                 Notes & Summary
              </a>
              <a routerLink="/app/generate" routerLinkActive="bg-white/80 dark:bg-white/10 shadow-sun dark:shadow-moon text-orange-600 dark:text-indigo-300 font-bold" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all group">
                 <span class="text-xl group-hover:scale-110 transition opacity-80 group-hover:opacity-100">⚡</span>
                 Quiz & Explain
              </a>
              <a routerLink="/app/planner" routerLinkActive="bg-white/80 dark:bg-white/10 shadow-sun dark:shadow-moon text-orange-600 dark:text-indigo-300 font-bold" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all group">
                 <span class="text-xl group-hover:scale-110 transition opacity-80 group-hover:opacity-100">📅</span>
                 Planner
              </a>

              <div class="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400/80 uppercase tracking-widest">Connect</div>

              <a routerLink="/app/community" routerLinkActive="bg-white/80 dark:bg-white/10 shadow-sun dark:shadow-moon text-orange-600 dark:text-indigo-300 font-bold" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all group">
                 <span class="text-xl group-hover:scale-110 transition opacity-80 group-hover:opacity-100">🌍</span>
                 Community
              </a>
              <a routerLink="/app/profile" routerLinkActive="bg-white/80 dark:bg-white/10 shadow-sun dark:shadow-moon text-orange-600 dark:text-indigo-300 font-bold" class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white transition-all group">
                 <span class="text-xl group-hover:scale-110 transition opacity-80 group-hover:opacity-100">👤</span>
                 Profile
              </a>
           </nav>

           <!-- User Mini Profile -->
           <div class="p-4 mt-auto">
              <div class="bg-white/50 dark:bg-white/5 rounded-2xl p-3 flex items-center gap-3 border border-white/50 dark:border-white/5 backdrop-blur-sm shadow-sm">
                 <img [src]="authService.currentUser()?.avatar" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 object-cover ring-2 ring-white/50 dark:ring-white/10">
                 <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-800 dark:text-white truncate">{{ authService.currentUser()?.name }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ authService.currentUser()?.plan === 'pro' ? 'Pro Plan' : 'Free Plan' }}</p>
                 </div>
              </div>
           </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 relative flex flex-col h-full overflow-hidden">
           
           <!-- Global Top Bar (Floating) -->
           <div class="absolute top-0 left-0 right-0 z-40 p-6 pointer-events-none flex justify-between items-start">
              
              <!-- HUGE Back Button -->
              @if (showBackButton()) {
                 <button (click)="goBack()" class="pointer-events-auto group flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sun dark:shadow-moon hover:shadow-sun-hover dark:hover:shadow-moon-hover px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0">
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-orange-500 dark:group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                       <svg class="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </div>
                    <span class="font-bold text-slate-700 dark:text-slate-200 text-sm">Back</span>
                 </button>
              } @else {
                 <div></div> <!-- Spacer -->
              }

              <!-- Premium Badge (Visible Everywhere) -->
              <a routerLink="/app/upgrade" class="pointer-events-auto flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 px-5 py-2.5 rounded-full shadow-lg hover:shadow-glow-sun dark:hover:shadow-glow-moon hover:scale-105 transition-all group border border-white/10">
                 <span class="text-lg animate-pulse">👑</span>
                 <div class="flex flex-col leading-none">
                    <span class="text-[10px] uppercase font-bold opacity-80">Unlock</span>
                    <span class="font-bold text-sm">Premium AI</span>
                 </div>
              </a>
           </div>

           <!-- Content Scrollable -->
           <div class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
              <router-outlet></router-outlet>
           </div>

           <!-- Mobile Bottom Tab Bar -->
           <nav class="md:hidden glass-sun dark:glass-moon border-t border-white/40 dark:border-white/5 pb-safe pt-2 px-6 flex justify-between items-center z-50 shrink-0 relative shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]">
              <a routerLink="/app/dashboard" routerLinkActive="text-orange-600 dark:text-indigo-400 drop-shadow-sm" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 transition duration-300">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                 <span class="text-[10px] font-bold mt-1">Home</span>
              </a>
              <a routerLink="/app/planner" routerLinkActive="text-orange-600 dark:text-indigo-400 drop-shadow-sm" class="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 transition duration-300">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <span class="text-[10px] font-bold mt-1">Plan</span>
              </a>
              
              <!-- Floating Action Button for Mobile -->
              <a routerLink="/app/generate" class="-mt-8 bg-gradient-to-tr from-orange-500 to-orange-400 dark:from-indigo-600 dark:to-violet-500 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-glow-sun dark:hover:shadow-glow-moon hover:scale-105 transition transform">
                 <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </a>

              <a routerLink="/app/notes" routerLinkActive="text-orange-600 dark:text-indigo-400 drop-shadow-sm" class="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 transition duration-300">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <span class="text-[10px] font-bold mt-1">Notes</span>
              </a>
              <a routerLink="/app/community" routerLinkActive="text-orange-600 dark:text-indigo-400 drop-shadow-sm" class="flex flex-col items-center p-2 text-slate-400 dark:text-slate-500 transition duration-300">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                 <span class="text-[10px] font-bold mt-1">Social</span>
              </a>
           </nav>

        </main>
      </div>
      
      <!-- Global Music Player (Overlay) -->
      <app-music-player></app-music-player>
    }
  `
})
export class AppComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  router = inject(Router);
  location = inject(Location);

  currentPath = signal('');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath.set(event.urlAfterRedirects);
    });
  }

  showLayout = computed(() => {
    return this.currentPath().startsWith('/app');
  });

  showBackButton = computed(() => {
    const path = this.currentPath();
    const rootPaths = ['/app/dashboard', '/app/planner', '/app/notes', '/app/community', '/app/profile'];
    return !rootPaths.includes(path);
  });

  goBack() {
    this.location.back();
  }
}