import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { TranslationService, LangCode } from '../../services/translation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 transition-colors duration-300">
      <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center gap-3 sticky top-0 z-20">
         <a routerLink="/app/dashboard" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
         </a>
         <h1 class="font-bold text-slate-900 dark:text-white text-lg">{{ t.translate('profile') }}</h1>
      </header>

      <main class="max-w-2xl mx-auto p-6 animate-fade-in">
         <!-- Profile Card -->
         <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-6">
            <div class="flex items-center gap-6 mb-8">
               <div class="relative group">
                  <img [src]="avatarUrl()" class="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700 shadow-md">
                  <button (click)="randomizeAvatar()" class="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition" title="New Random Avatar">
                     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
               </div>
               <div>
                  <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ authService.currentUser()?.name }}</h2>
                  <p class="text-slate-500 dark:text-slate-400 text-sm mb-2">{{ authService.currentUser()?.email }}</p>
                  
                  @if (authService.isPro()) {
                     <span class="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        <span>✨</span> {{ t.translate('premium_badge') }}
                     </span>
                  } @else {
                     <span class="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        Free Plan
                     </span>
                     <a routerLink="/app/upgrade" class="ml-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Upgrade</a>
                  }
               </div>
            </div>

            <div class="space-y-6">
               <!-- Name Input -->
               <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                  <input [(ngModel)]="name" class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition">
               </div>

               <!-- Language -->
               <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Language / Idioma / Langue</label>
                  <div class="grid grid-cols-3 gap-3">
                     <button (click)="language.set('en')" [class.ring-2]="language() === 'en'" [class.bg-indigo-50]="language() === 'en'" [class.dark:bg-indigo-900]="language() === 'en'" class="p-3 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex flex-col items-center gap-1">
                        <span class="text-2xl">🇺🇸</span>
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">English</span>
                     </button>
                     <button (click)="language.set('es')" [class.ring-2]="language() === 'es'" [class.bg-indigo-50]="language() === 'es'" [class.dark:bg-indigo-900]="language() === 'es'" class="p-3 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex flex-col items-center gap-1">
                        <span class="text-2xl">🇪🇸</span>
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Español</span>
                     </button>
                     <button (click)="language.set('fr')" [class.ring-2]="language() === 'fr'" [class.bg-indigo-50]="language() === 'fr'" [class.dark:bg-indigo-900]="language() === 'fr'" class="p-3 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition flex flex-col items-center gap-1">
                        <span class="text-2xl">🇫🇷</span>
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Français</span>
                     </button>
                  </div>
               </div>

               <!-- Theme -->
               <div>
                  <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Theme</label>
                  <div class="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                     <button (click)="theme.set('light')" [class.bg-white]="theme() === 'light'" [class.text-indigo-600]="theme() === 'light'" [class.shadow-sm]="theme() === 'light'" [class.dark:bg-slate-600]="theme() === 'light'" class="flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 transition flex items-center justify-center gap-2">
                        <span>☀️</span> Light
                     </button>
                     <button (click)="theme.set('dark')" [class.bg-white]="theme() === 'dark'" [class.text-indigo-600]="theme() === 'dark'" [class.shadow-sm]="theme() === 'dark'" [class.dark:bg-slate-500]="theme() === 'dark'" [class.dark:text-white]="theme() === 'dark'" class="flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 transition flex items-center justify-center gap-2">
                        <span>🌙</span> Dark
                     </button>
                  </div>
               </div>

               <!-- Save Button -->
               <button (click)="saveProfile()" class="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition">
                  {{ isSaving() ? 'Saving...' : t.translate('save') }}
               </button>
            </div>
         </div>

         <!-- Gamification Stats (Read Only) -->
         <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 class="font-bold text-slate-900 dark:text-white mb-4">Achievements</h3>
            <div class="flex flex-wrap gap-2">
               @for (badge of authService.currentUser()?.badges; track badge) {
                  <span class="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full border border-yellow-200 dark:border-yellow-700 flex items-center gap-1">
                     🏆 {{ badge }}
                  </span>
               }
            </div>
         </div>
         
         <div class="mt-8 text-center">
            <button (click)="authService.logout()" class="text-red-500 hover:text-red-700 font-bold text-sm">{{ t.translate('logout') }}</button>
         </div>
      </main>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  t = inject(TranslationService);
  
  name = '';
  avatarUrl = signal('');
  language = signal<LangCode>('en');
  theme = signal<'light' | 'dark'>('light');
  isSaving = signal(false);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.name = user.name;
        this.avatarUrl.set(user.avatar || '');
        this.language.set(user.preferences.language);
        this.theme.set(user.preferences.theme);
      }
    });
  }

  randomizeAvatar() {
    const seed = Math.random().toString(36).substring(7);
    this.avatarUrl.set(`https://ui-avatars.com/api/?name=${seed}&background=random`);
  }

  saveProfile() {
    this.isSaving.set(true);
    this.authService.updateProfile({
      name: this.name,
      avatar: this.avatarUrl(),
      language: this.language(),
      theme: this.theme()
    });
    
    // Slight delay to show feedback
    setTimeout(() => {
       this.isSaving.set(false);
       alert("Profile Updated!");
    }, 600);
  }
}