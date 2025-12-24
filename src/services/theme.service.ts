import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);

  constructor() {
    const saved = localStorage.getItem('studymate_theme');
    if (saved === 'dark') this.isDark.set(true);
    
    effect(() => {
      const isDark = this.isDark();
      localStorage.setItem('studymate_theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  toggle() {
    this.isDark.update(v => !v);
  }

  setTheme(isDark: boolean) {
    this.isDark.set(isDark);
  }
}