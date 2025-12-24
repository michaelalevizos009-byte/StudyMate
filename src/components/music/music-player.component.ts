import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService, Playlist } from '../../services/spotify.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (authService.isLoggedIn()) {
      <div 
        class="fixed bottom-6 right-6 z-50 transition-all duration-500 ease-in-out font-sans"
        [class.translate-y-0]="isOpen()"
      >
        <!-- Collapsed: Zen Pill -->
        @if (!isOpen()) {
          <div 
            (click)="isOpen.set(true)"
            class="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-full shadow-glow border border-white/20 dark:border-white/5 p-1.5 pr-5 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all group"
          >
            <div class="h-10 w-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
               @if (spotifyService.currentTrack()) {
                  <img [src]="spotifyService.currentTrack()?.cover" class="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition">
               } @else {
                  <span class="text-sm">🎵</span>
               }
               
               @if (spotifyService.isPlaying()) {
                  <div class="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/20 dark:bg-white/20">
                     <div class="w-0.5 bg-white dark:bg-slate-900 animate-[bounce_1s_infinite] h-2"></div>
                     <div class="w-0.5 bg-white dark:bg-slate-900 animate-[bounce_1.2s_infinite] h-3"></div>
                     <div class="w-0.5 bg-white dark:bg-slate-900 animate-[bounce_0.8s_infinite] h-2"></div>
                  </div>
               }
            </div>
            
            <div class="flex flex-col">
               <span class="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[80px] leading-tight">{{ spotifyService.currentTrack()?.title || 'Music' }}</span>
               <span class="text-[9px] text-slate-400 truncate max-w-[80px]">{{ spotifyService.currentTrack()?.artist || 'Focus' }}</span>
            </div>
          </div>
        }

        <!-- Expanded: Floating Panel -->
        @if (isOpen()) {
          <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 w-72 overflow-hidden animate-fade-up flex flex-col h-[26rem] origin-bottom-right">
             
             <!-- Header -->
             <div class="p-4 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/50 backdrop-blur">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <div class="w-1.5 h-1.5 rounded-full bg-green-500" *ngIf="spotifyService.isConnected()"></div>
                   Focus Audio
                </span>
                <button (click)="isOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white transition transform hover:rotate-90">✕</button>
             </div>

             @if (!spotifyService.isConnected()) {
                <div class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                   <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-xl">Spotify</div>
                   <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Connect to play focus music directly in your workflow.</p>
                   <button (click)="connect()" class="bg-green-500 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-green-600 transition shadow-lg shadow-green-200 dark:shadow-none">Connect Spotify</button>
                </div>
             } @else {
                <!-- Active Track Card -->
                <div class="p-4">
                   <div class="relative aspect-square rounded-2xl overflow-hidden shadow-lg mb-4 group">
                      <img [src]="spotifyService.currentTrack()?.cover || 'https://picsum.photos/300/300'" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
                      <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                         <button (click)="spotifyService.togglePlay()" class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition">
                            @if (spotifyService.isPlaying()) { ⏸ } @else { ▶ }
                         </button>
                      </div>
                   </div>
                   
                   <div class="text-center mb-4">
                      <h3 class="font-bold text-slate-900 dark:text-white text-sm truncate">{{ spotifyService.currentTrack()?.title || 'Ready to Focus' }}</h3>
                      <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">{{ spotifyService.currentTrack()?.artist || 'Select a playlist' }}</p>
                   </div>

                   <!-- Progress Bar (Visual) -->
                   <div class="w-full bg-slate-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mb-4">
                      <div class="bg-slate-800 dark:bg-white h-full transition-all duration-1000" [style.width.%]="spotifyService.playbackProgress()"></div>
                   </div>

                   <!-- Controls -->
                   <div class="flex justify-between items-center px-4">
                      <button (click)="spotifyService.prev()" class="text-slate-400 hover:text-slate-800 dark:hover:text-white transition">⏮</button>
                      <button (click)="spotifyService.togglePlay()" class="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
                         @if (spotifyService.isPlaying()) { ⏸ } @else { ▶ }
                      </button>
                      <button (click)="spotifyService.next()" class="text-slate-400 hover:text-slate-800 dark:hover:text-white transition">⏭</button>
                   </div>
                </div>

                <!-- Playlist Selector (Overlay style) -->
                <div class="flex-1 overflow-y-auto px-2 pb-2">
                   <p class="text-[10px] font-bold text-slate-400 uppercase px-2 mb-2">Playlists</p>
                   <div class="space-y-1">
                      @for (playlist of spotifyService.playlists(); track playlist.id) {
                         <button 
                           (click)="selectPlaylist(playlist)"
                           class="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition group"
                           [class.bg-slate-50]="spotifyService.currentPlaylist()?.id === playlist.id"
                           [class.dark:bg-zinc-800]="spotifyService.currentPlaylist()?.id === playlist.id"
                         >
                            <img [src]="playlist.cover" class="h-8 w-8 rounded-lg object-cover opacity-80 group-hover:opacity-100">
                            <div class="flex-1 min-w-0">
                               <p class="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{{ playlist.name }}</p>
                            </div>
                            @if (playlist.premiumOnly && !authService.isPro()) { <span class="text-[10px]">🔒</span> }
                         </button>
                      }
                   </div>
                </div>
                
                <div class="p-3 border-t border-slate-50 dark:border-zinc-800">
                   <button (click)="spotifyService.toggleSmartDj()" [class.text-indigo-600]="spotifyService.smartDjEnabled()" class="w-full py-2 rounded-xl text-[10px] font-bold bg-slate-50 dark:bg-zinc-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-700 transition flex items-center justify-center gap-1.5">
                      <span>🤖</span> Smart DJ {{ spotifyService.smartDjEnabled() ? 'On' : 'Off' }}
                   </button>
                </div>
             }
          </div>
        }
      </div>
    }
  `
})
export class MusicPlayerComponent {
  spotifyService = inject(SpotifyService);
  authService = inject(AuthService);
  
  isOpen = signal(false);
  activeTab = signal<'smart' | 'browse' | 'community'>('smart');
  isExporting = signal(false);

  connect() {
    this.spotifyService.connect();
  }

  selectPlaylist(playlist: Playlist) {
    this.spotifyService.playTrack(playlist.tracks[0], playlist);
  }

  getPlaylistsByCategory(cat: string) {
     return this.spotifyService.playlists().filter(p => p.category === cat);
  }

  setContext(ctx: any) {
     this.spotifyService.setContext(ctx);
  }

  async exportPlaylist() {
     const playlist = this.spotifyService.currentPlaylist();
     if (!playlist) return;
     
     this.isExporting.set(true);
     await this.spotifyService.exportPlaylistToSpotify(playlist);
     this.isExporting.set(false);
  }
}