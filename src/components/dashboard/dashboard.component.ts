import { Component, inject, signal, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StudyService } from '../../services/study.service';
import { AiService } from '../../services/ai.service';
import { TranslationService } from '../../services/translation.service';
import { NotificationService } from '../../services/notification.service';
import { SpotifyService } from '../../services/spotify.service';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FeedbackWidgetComponent } from '../feedback/feedback-widget.component';

// D3
declare var d3: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DatePipe, CommonModule, FeedbackWidgetComponent],
  template: `
    <div class="font-sans">
      
      <!-- Main Canvas -->
      <div class="pt-24 pb-32 max-w-5xl mx-auto px-6 animate-fade-up">
         
         <!-- Welcome Section -->
         <section class="mb-12 relative">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div>
                  <div class="flex items-center gap-2 mb-3 opacity-0 animate-fade-up" style="animation-delay: 0.1s; animation-fill-mode: forwards;">
                     <span class="text-2xl">👋</span>
                     <span class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.translate(greeting()) }}</span>
                  </div>
                  <h1 class="text-4xl md:text-5xl font-light text-slate-800 dark:text-zinc-50 tracking-tight leading-tight opacity-0 animate-fade-up" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
                     Ready to flow, <span class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 dark:from-indigo-400 dark:to-violet-400">{{ authService.currentUser()?.name }}</span>?
                  </h1>
               </div>
               
               <!-- AI Insight Pill & Pomodoro -->
               <div class="flex flex-col gap-3 items-end">
                  <!-- Subtle Pomodoro -->
                  <button (click)="togglePomo()" class="flex items-center gap-2 group bg-white/70 dark:bg-slate-800/70 border border-white/50 dark:border-white/5 px-4 py-2 rounded-full shadow-sun dark:shadow-moon hover:shadow-sun-hover dark:hover:shadow-moon-hover transition-all duration-300">
                     <div class="w-2 h-2 rounded-full transition-colors" [class.bg-red-500]="pomoActive()" [class.bg-slate-300]="!pomoActive()" [class.animate-pulse]="pomoActive()"></div>
                     <span class="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">{{ formatTime(pomoTime()) }}</span>
                  </button>

                  <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sun dark:shadow-moon border border-white/50 dark:border-white/5 max-w-sm opacity-0 animate-fade-up" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
                     <div class="flex gap-3 items-start">
                        <div class="mt-0.5 text-orange-500 dark:text-indigo-400 text-lg">✨</div>
                        <div>
                           <p class="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                              @if(coachLoading()) { <span class="animate-pulse">Thinking...</span> } @else { "{{ coachTip() }}" }
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- Core Action Grid -->
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            <!-- Create Card -->
            <a routerLink="/app/generate" class="md:col-span-2 group relative h-64 rounded-[2rem] bg-gradient-to-br from-orange-400 to-orange-500 dark:from-indigo-600 dark:to-violet-700 p-8 text-white overflow-hidden shadow-sun-hover dark:shadow-moon-hover transition-all hover:-translate-y-1 opacity-0 animate-fade-up" style="animation-delay: 0.4s; animation-fill-mode: forwards;">
               <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay"></div>
               <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <svg class="w-48 h-48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
               </div>
               <div class="relative z-10 h-full flex flex-col justify-between">
                  <div>
                     <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md mb-4 shadow-sm">Start Session</span>
                     <h2 class="text-3xl font-bold mb-2">Transform your notes.</h2>
                     <p class="text-orange-50 dark:text-indigo-100 font-light max-w-md">Generate summaries, quizzes, and deep explanations instantly.</p>
                  </div>
                  <div class="flex items-center gap-3">
                     <span class="bg-white text-orange-600 dark:text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">→</span>
                     <span class="text-sm font-medium">Create New</span>
                  </div>
               </div>
            </a>

            <!-- Stats / Activity Card -->
            <div class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 dark:border-white/5 shadow-sun dark:shadow-moon flex flex-col justify-between opacity-0 animate-fade-up" style="animation-delay: 0.5s; animation-fill-mode: forwards;">
               <div>
                  <div class="flex items-center justify-between mb-6">
                     <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Momentum</span>
                     <div class="flex items-center gap-1 text-orange-500">
                        <span class="text-lg">🔥</span>
                        <span class="font-bold text-slate-800 dark:text-white">{{ authService.currentUser()?.streak }}</span>
                     </div>
                  </div>
                  <div #chartContainer class="w-full h-24 opacity-80"></div>
               </div>
               <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <div class="flex justify-between items-center text-sm">
                     <span class="text-slate-500 dark:text-slate-400">Daily Goal</span>
                     <span class="font-bold text-slate-800 dark:text-white">5/20</span>
                  </div>
                  <div class="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                     <div class="bg-orange-400 dark:bg-indigo-500 h-full w-1/4 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Recent & Community Split -->
         <div class="grid md:grid-cols-2 gap-12 opacity-0 animate-fade-up" style="animation-delay: 0.6s; animation-fill-mode: forwards;">
            
            <!-- Recent Library -->
            <div>
               <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-medium text-slate-800 dark:text-white">Recent Work</h3>
                  <a routerLink="/app/notes" class="text-xs font-bold text-orange-600 dark:text-indigo-400 hover:underline">View Library</a>
               </div>
               
               @if (studyService.sessions().length === 0) {
                  <div class="h-40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm">
                     Your library is empty.
                  </div>
               } @else {
                  <div class="space-y-3">
                     @for (session of studyService.sessions().slice(0, 3); track session.id) {
                        <a [routerLink]="['/app/result', session.id]" class="block bg-white/70 dark:bg-slate-800/70 p-4 rounded-2xl border border-white/60 dark:border-white/5 shadow-sun dark:shadow-moon hover:shadow-sun-hover dark:hover:shadow-moon-hover hover:-translate-y-0.5 transition-all group backdrop-blur-sm">
                           <div class="flex items-center justify-between">
                              <div class="flex items-center gap-4">
                                 <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-700 text-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-indigo-900/30 transition shadow-sm">📄</div>
                                 <div>
                                    <h4 class="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-orange-600 dark:group-hover:text-indigo-400 transition">{{ session.title }}</h4>
                                    <p class="text-[10px] text-slate-400 mt-0.5">{{ session.date | date:'MMM d' }}</p>
                                 </div>
                              </div>
                              <span class="text-slate-300 group-hover:translate-x-1 transition">→</span>
                           </div>
                        </a>
                     }
                  </div>
               }
            </div>

            <!-- Community / Trending -->
            <div>
               <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-medium text-slate-800 dark:text-white">Discover</h3>
                  <a routerLink="/app/community" class="text-xs font-bold text-orange-600 dark:text-indigo-400 hover:underline">Browse</a>
               </div>
               
               <a routerLink="/app/community" class="block p-1 rounded-[2rem] bg-gradient-to-br from-orange-100 to-white dark:from-slate-700 dark:to-slate-800 shadow-sun dark:shadow-moon group hover:scale-[1.02] transition-transform">
                  <div class="bg-white/80 dark:bg-slate-900/80 rounded-[1.8rem] p-6 h-full transition group-hover:bg-white/90 dark:group-hover:bg-slate-900/90 backdrop-blur">
                     <div class="flex items-start justify-between mb-3">
                        <span class="bg-orange-100 dark:bg-indigo-900/50 text-orange-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Trending</span>
                        <span class="text-xs text-slate-400">2h ago</span>
                     </div>
                     <h4 class="text-base font-bold text-slate-800 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-indigo-400 transition">Calculus I: Derivatives Masterclass</h4>
                     <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">Complete cheat sheet for power rule, chain rule, and implicit differentiation.</p>
                     <div class="mt-4 flex items-center gap-4 text-xs text-slate-400">
                        <span class="flex items-center gap-1">♥ 245</span>
                        <span class="flex items-center gap-1">⬇ 56</span>
                     </div>
                  </div>
               </a>
            </div>

         </div>

      </div>

      <!-- Notifications Overlay -->
      @if (showNotifications()) {
         <div class="fixed inset-0 z-40" (click)="showNotifications.set(false)"></div>
         <div class="fixed top-20 right-4 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-sun-hover dark:shadow-moon-hover border border-white/50 dark:border-white/10 z-50 overflow-hidden animate-fade-up">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <h3 class="font-bold text-sm text-slate-800 dark:text-white">Notifications</h3>
               <button (click)="notificationService.markAllRead()" class="text-[10px] font-bold text-orange-600 dark:text-indigo-400 hover:underline">Mark all read</button>
            </div>
            <div class="max-h-64 overflow-y-auto">
               @if (notificationService.notifications().length === 0) {
                  <div class="p-8 text-center text-slate-400 text-xs">No new notifications</div>
               }
               @for (n of notificationService.notifications(); track n.id) {
                  <div class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800 last:border-none cursor-pointer">
                     <div class="flex gap-3">
                        <div class="mt-1 w-2 h-2 rounded-full shrink-0" [class.bg-orange-500]="!n.read" [class.bg-slate-200]="n.read"></div>
                        <div>
                           <p class="text-sm font-semibold text-slate-800 dark:text-white leading-tight mb-1">{{ n.title }}</p>
                           <p class="text-xs text-slate-500 dark:text-slate-400">{{ n.message }}</p>
                        </div>
                     </div>
                  </div>
               }
            </div>
         </div>
      }

      <app-feedback-widget></app-feedback-widget>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  authService = inject(AuthService);
  studyService = inject(StudyService);
  aiService = inject(AiService);
  spotifyService = inject(SpotifyService);
  t = inject(TranslationService);
  notificationService = inject(NotificationService);
  router = inject(Router);
  
  greeting = signal('good_morning');
  coachTip = signal('');
  coachLoading = signal(true);
  showNotifications = signal(false);

  pomoTime = signal(25 * 60);
  pomoActive = signal(false);
  private pomoInterval: any;

  async ngOnInit() {
    this.setGreeting();
    if (this.authService.isPro()) {
       const user = this.authService.currentUser();
       if (user) {
         this.coachTip.set(await this.aiService.getCoachTip(user.name, user.subjectMastery));
         this.coachLoading.set(false);
       }
    } else {
       setTimeout(() => {
          this.coachTip.set("Consistency is the key to mastery.");
          this.coachLoading.set(false);
       }, 500);
    }
  }

  ngAfterViewInit() {
     if (typeof d3 !== 'undefined') this.renderActivityChart();
  }

  ngOnDestroy() {
    if (this.pomoInterval) clearInterval(this.pomoInterval);
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting.set('good_morning');
    else if (hour < 18) this.greeting.set('good_afternoon');
    else this.greeting.set('good_evening');
  }

  renderActivityChart() {
     const container = this.chartContainer.nativeElement;
     const width = container.clientWidth;
     const height = 96;
     
     // Clean SVG
     d3.select(container).selectAll("*").remove();

     const data = Array.from({length: 12}, (_, i) => ({ i, v: Math.floor(Math.random() * 40) + 10 }));
     const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
     
     const x = d3.scaleLinear().domain([0, 11]).range([0, width]);
     const y = d3.scaleLinear().domain([0, 60]).range([height, 0]);
     
     const line = d3.line().x((d:any) => x(d.i)).y((d:any) => y(d.v)).curve(d3.curveBasis);
     
     // Gradient
     const defs = svg.append("defs");
     const gradient = defs.append("linearGradient").attr("id", "grad").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
     gradient.append("stop").attr("offset", "0%").style("stop-color", "#f97316").style("stop-opacity", 0.5); // Orange for sun
     gradient.append("stop").attr("offset", "100%").style("stop-color", "#f97316").style("stop-opacity", 0);

     const area = d3.area().x((d:any) => x(d.i)).y0(height).y1((d:any) => y(d.v)).curve(d3.curveBasis);

     svg.append("path").datum(data).attr("fill", "url(#grad)").attr("d", area);
     svg.append("path").datum(data).attr("fill", "none").attr("stroke", "#f97316").attr("stroke-width", 2).attr("d", line);
  }

  togglePomo() {
    if (this.pomoActive()) {
      this.pomoActive.set(false);
      clearInterval(this.pomoInterval);
      this.spotifyService.setContext('relax'); 
    } else {
      this.pomoActive.set(true);
      if (this.spotifyService.smartDjEnabled()) {
         this.spotifyService.setContext('focus');
         if (!this.spotifyService.isPlaying()) this.spotifyService.togglePlay();
      }
      this.pomoInterval = setInterval(() => {
        if (this.pomoTime() > 0) this.pomoTime.update(t => t - 1);
        else {
          this.pomoActive.set(false);
          clearInterval(this.pomoInterval);
          this.pomoTime.set(25 * 60);
          this.notificationService.add({ title: 'Break Time', message: 'Good focus session.', type: 'success' });
          if (this.spotifyService.smartDjEnabled()) this.spotifyService.setContext('relax');
        }
      }, 1000);
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}