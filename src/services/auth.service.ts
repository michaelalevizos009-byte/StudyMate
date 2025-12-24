import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './theme.service';
import { TranslationService, LangCode } from './translation.service';

export interface User {
  email: string;
  name: string;
  plan: 'free' | 'pro';
  credits: number;
  subscriptionId?: string;
  streak: number;
  badges: string[];
  subjectMastery: Record<string, number>; 
  avatar?: string;
  preferences: {
    language: LangCode;
    theme: 'light' | 'dark';
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  
  private themeService = inject(ThemeService);
  private translationService = inject(TranslationService);
  private router = inject(Router);

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const saved = localStorage.getItem('studymate_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.currentUser.set(user);
        this.applyPreferences(user);
      } catch (e) {
        localStorage.removeItem('studymate_user');
      }
    }
  }

  private saveUser(user: User | null) {
    if (user) {
      localStorage.setItem('studymate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studymate_user');
    }
  }

  private applyPreferences(user: User) {
    if (user.preferences) {
      this.themeService.setTheme(user.preferences.theme === 'dark');
      this.translationService.setLanguage(user.preferences.language);
    }
  }

  login(email: string) {
    const user: User = {
      email,
      name: email.split('@')[0],
      plan: 'free',
      credits: 3,
      streak: 3,
      badges: ['Newcomer'],
      subjectMastery: { 'Biology': 30, 'Math': 10 },
      preferences: { language: 'en', theme: 'light' },
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
    };
    this.currentUser.set(user);
    this.saveUser(user);
    this.applyPreferences(user);
    this.router.navigate(['/app/dashboard']);
  }

  signup(email: string) {
    const user: User = {
      email,
      name: email.split('@')[0],
      plan: 'free',
      credits: 5,
      streak: 1,
      badges: ['Newcomer'],
      subjectMastery: {},
      preferences: { language: 'en', theme: 'light' },
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
    };
    this.currentUser.set(user);
    this.saveUser(user);
    this.applyPreferences(user);
    this.router.navigate(['/app/dashboard']);
  }

  logout() {
    this.currentUser.set(null);
    this.saveUser(null);
    this.router.navigate(['/']);
  }

  upgradeToPro() {
    const user = this.currentUser();
    if (user) {
      const updated: User = { 
        ...user, 
        plan: 'pro', 
        credits: 9999, 
        subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9),
        badges: [...user.badges, 'Pro Scholar']
      };
      this.currentUser.set(updated);
      this.saveUser(updated);
    }
  }

  updateProfile(data: { name: string; avatar: string; language: LangCode; theme: 'light' | 'dark' }) {
    const user = this.currentUser();
    if (user) {
      const updated: User = {
        ...user,
        name: data.name,
        avatar: data.avatar,
        preferences: {
          language: data.language,
          theme: data.theme
        }
      };
      this.currentUser.set(updated);
      this.saveUser(updated);
      this.applyPreferences(updated);
    }
  }

  updateMastery(subject: string, amount: number) {
    const user = this.currentUser();
    if (user) {
      const currentVal = user.subjectMastery[subject] || 0;
      const newVal = Math.min(100, currentVal + amount);
      const updated: User = {
        ...user,
        subjectMastery: {
          ...user.subjectMastery,
          [subject]: newVal
        }
      };
      this.currentUser.set(updated);
      this.saveUser(updated);
    }
  }

  isLoggedIn() {
    return this.currentUser() !== null;
  }
  
  deductCredit() {
    const user = this.currentUser();
    if (user && user.plan === 'free') {
      const updated: User = { ...user, credits: Math.max(0, user.credits - 1) };
      this.currentUser.set(updated);
      this.saveUser(updated);
    }
  }

  isPro(): boolean {
    return this.currentUser()?.plan === 'pro';
  }

  getMaxFileSize(): number {
    return this.isPro() ? 10 * 1024 * 1024 : 1 * 1024 * 1024;
  }

  canUseDeepThink(): boolean {
    return this.isPro();
  }
  
  canUseAiCoach(): boolean {
    return this.isPro();
  }
}