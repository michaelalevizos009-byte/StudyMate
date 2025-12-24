import { Injectable, signal, inject, computed } from '@angular/core';
import { IntegrationService } from './integration.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  cover: string;
  bpm?: number;
}

export interface Playlist {
  id: string;
  name: string;
  category: 'Focus' | 'Relax' | 'Energy' | 'AI Curated' | 'Community';
  tracks: Track[];
  premiumOnly: boolean;
  cover: string;
  description?: string;
  author?: string; // For community playlists
  likes?: number;
}

export type StudyContext = 'focus' | 'relax' | 'cram' | 'creative' | 'idle';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private integrationService = inject(IntegrationService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  // State
  isPlaying = signal(false);
  currentTrack = signal<Track | null>(null);
  currentPlaylist = signal<Playlist | null>(null);
  volume = signal(50);
  playbackProgress = signal(0); // 0 to 100
  
  // Smart Features
  smartDjEnabled = signal(false);
  currentContext = signal<StudyContext>('idle');
  
  // Data
  playlists = signal<Playlist[]>([]);
  communityPlaylists = signal<Playlist[]>([]);

  private playbackInterval: any;

  constructor() {
    this.initMockPlaylists();
  }

  private initMockPlaylists() {
    this.playlists.set([
      {
        id: 'p1',
        name: 'Lo-Fi Study Beats',
        category: 'Focus',
        premiumOnly: false,
        cover: 'https://picsum.photos/id/1015/300/300',
        description: 'Chill beats to help you concentrate.',
        tracks: [
          { id: 't1', title: 'Rainy Day', artist: 'Chillhop', duration: 180, cover: 'https://picsum.photos/id/1016/100/100', bpm: 80 },
          { id: 't2', title: 'Coffee Shop Vibes', artist: 'Lofi Girl', duration: 210, cover: 'https://picsum.photos/id/1018/100/100', bpm: 85 },
          { id: 't3', title: 'Midnight Coding', artist: 'Synthwave', duration: 240, cover: 'https://picsum.photos/id/1025/100/100', bpm: 90 }
        ]
      },
      {
        id: 'p2',
        name: 'Classical Concentration',
        category: 'Focus',
        premiumOnly: false,
        cover: 'https://picsum.photos/id/1040/300/300',
        description: 'Timeless masterpieces for deep work.',
        tracks: [
          { id: 't4', title: 'Nocturne in E-flat', artist: 'Chopin', duration: 300, cover: 'https://picsum.photos/id/1041/100/100', bpm: 60 },
          { id: 't5', title: 'Clair de Lune', artist: 'Debussy', duration: 280, cover: 'https://picsum.photos/id/1042/100/100', bpm: 55 }
        ]
      },
      {
        id: 'p3',
        name: 'Deep Work: Alpha Waves',
        category: 'AI Curated',
        premiumOnly: true,
        cover: 'https://picsum.photos/id/106/300/300',
        description: 'Scientifically engineered sounds to boost focus.',
        tracks: [
          { id: 't6', title: 'Binaural Focus 40Hz', artist: 'BrainFM', duration: 600, cover: 'https://picsum.photos/id/109/100/100', bpm: 40 },
          { id: 't7', title: 'Deep Flow State', artist: 'NeuroSound', duration: 540, cover: 'https://picsum.photos/id/110/100/100', bpm: 40 }
        ]
      },
      {
        id: 'p4',
        name: 'Exam Power Up',
        category: 'Energy',
        premiumOnly: true,
        cover: 'https://picsum.photos/id/145/300/300',
        description: 'High energy tracks for last-minute review.',
        tracks: [
          { id: 't8', title: 'Eye of the Tiger (Remix)', artist: 'Survivor', duration: 240, cover: 'https://picsum.photos/id/146/100/100', bpm: 120 },
          { id: 't9', title: 'Limitless', artist: 'Motivational', duration: 200, cover: 'https://picsum.photos/id/147/100/100', bpm: 128 }
        ]
      }
    ]);

    this.communityPlaylists.set([
       {
          id: 'cp1',
          name: 'Late Night Biology',
          category: 'Community',
          premiumOnly: false,
          author: 'Sarah J.',
          likes: 245,
          cover: 'https://picsum.photos/id/200/300/300',
          tracks: [
             { id: 't10', title: 'Cellular', artist: 'Osmosis', duration: 200, cover: 'https://picsum.photos/id/201/100/100', bpm: 100 }
          ]
       },
       {
          id: 'cp2',
          name: 'Calculus Crunch',
          category: 'Community',
          premiumOnly: false,
          author: 'Mike C.',
          likes: 189,
          cover: 'https://picsum.photos/id/202/300/300',
          tracks: [
             { id: 't11', title: 'Derivative', artist: 'The Limits', duration: 220, cover: 'https://picsum.photos/id/203/100/100', bpm: 110 }
          ]
       }
    ]);
  }

  connect() {
    return this.integrationService.toggleConnection('spotify');
  }

  isConnected() {
    return this.integrationService.isConnected('spotify');
  }

  // --- Playback Controls ---

  playTrack(track: Track, playlist: Playlist) {
    if (!this.isConnected()) return;
    
    // Check Premium
    if (playlist.premiumOnly && !this.authService.isPro()) {
      alert("Upgrade to Pro to access AI Curated playlists!");
      return;
    }

    this.currentTrack.set(track);
    this.currentPlaylist.set(playlist);
    this.isPlaying.set(true);
    this.startProgress();
  }

  togglePlay() {
    if (!this.currentTrack()) {
       // Smart Start: Play based on context if no track
       if (this.currentContext() === 'focus') {
          const focusP = this.playlists().find(p => p.name.includes('Deep Work')) || this.playlists()[0];
          this.playTrack(focusP.tracks[0], focusP);
       } else {
          const first = this.playlists()[0];
          if (first) this.playTrack(first.tracks[0], first);
       }
       return;
    }
    this.isPlaying.update(v => !v);
    if (this.isPlaying()) this.startProgress();
    else this.stopProgress();
  }

  next() {
    const current = this.currentTrack();
    const playlist = this.currentPlaylist();
    if (!current || !playlist) return;

    const idx = playlist.tracks.findIndex(t => t.id === current.id);
    const nextIdx = (idx + 1) % playlist.tracks.length;
    this.playTrack(playlist.tracks[nextIdx], playlist);
  }

  prev() {
    const current = this.currentTrack();
    const playlist = this.currentPlaylist();
    if (!current || !playlist) return;

    const idx = playlist.tracks.findIndex(t => t.id === current.id);
    const prevIdx = (idx - 1 + playlist.tracks.length) % playlist.tracks.length;
    this.playTrack(playlist.tracks[prevIdx], playlist);
  }

  // --- Smart Context Awareness ---

  setContext(context: StudyContext) {
     this.currentContext.set(context);
     
     if (this.smartDjEnabled() && this.isPlaying()) {
        this.adaptMusicToContext(context);
     }
  }

  toggleSmartDj() {
     this.smartDjEnabled.update(v => !v);
     if (this.smartDjEnabled()) {
        this.adaptMusicToContext(this.currentContext());
        this.notificationService.add({
           title: 'Smart DJ Enabled',
           message: 'Music will now adapt to your study activity.',
           type: 'success'
        });
     }
  }

  private adaptMusicToContext(context: StudyContext) {
     if (!this.isConnected()) return;

     let targetPlaylist: Playlist | undefined;

     switch(context) {
        case 'focus':
           // Prefer Alpha Waves (Premium) or Lo-Fi
           targetPlaylist = this.playlists().find(p => p.name.includes('Deep Work'));
           if (!targetPlaylist || (targetPlaylist.premiumOnly && !this.authService.isPro())) {
              targetPlaylist = this.playlists().find(p => p.category === 'Focus');
           }
           break;
        case 'relax':
           targetPlaylist = this.playlists().find(p => p.name.includes('Classical'));
           break;
        case 'cram':
           targetPlaylist = this.playlists().find(p => p.category === 'Energy');
           break;
        case 'creative':
           targetPlaylist = this.playlists().find(p => p.name.includes('Lo-Fi'));
           break;
     }

     if (targetPlaylist && this.currentPlaylist()?.id !== targetPlaylist.id) {
        // Smooth transition simulation
        console.log(`Smart DJ: Switching to ${targetPlaylist.name} for ${context} mode.`);
        this.playTrack(targetPlaylist.tracks[0], targetPlaylist);
     }
  }

  // --- AI Recommendation Logic ---
  recommendPlaylist(topic: string): Playlist | undefined {
    const topicLower = topic.toLowerCase();
    
    // Logic based on cognitive load
    if (topicLower.includes('math') || topicLower.includes('physics') || topicLower.includes('deep')) {
       return this.playlists().find(p => p.name.includes('Deep Work') || p.name.includes('Classical'));
    }
    if (topicLower.includes('history') || topicLower.includes('reading') || topicLower.includes('literature')) {
       return this.playlists().find(p => p.name.includes('Lo-Fi'));
    }
    if (topicLower.includes('exam') || topicLower.includes('cram') || topicLower.includes('review')) {
       return this.playlists().find(p => p.name.includes('Exam'));
    }
    
    return this.playlists()[0]; // Default
  }

  // --- Export (Premium) ---
  async exportPlaylistToSpotify(playlist: Playlist): Promise<boolean> {
     if (!this.authService.isPro()) {
        alert("Exporting playlists is a Pro feature. Upgrade to sync with your real Spotify account!");
        return false;
     }
     
     if (!this.isConnected()) return false;

     // Mock API call
     await new Promise(r => setTimeout(r, 1500));
     this.notificationService.add({
        title: 'Playlist Exported',
        message: `"${playlist.name}" has been added to your Spotify library.`,
        type: 'success'
     });
     return true;
  }

  private startProgress() {
    this.stopProgress();
    this.playbackInterval = setInterval(() => {
      this.playbackProgress.update(v => {
        if (v >= 100) {
          this.next();
          return 0;
        }
        return v + 1; // fast simulation
      });
    }, 1000);
  }

  private stopProgress() {
    if (this.playbackInterval) clearInterval(this.playbackInterval);
  }
}