import { Injectable, signal } from '@angular/core';

export type Provider = 'google_drive' | 'dropbox' | 'onedrive' | 'google_calendar' | 'slack' | 'notion' | 'spotify';

export interface Integration {
  id: Provider;
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  integrations = signal<Integration[]>([
    { id: 'google_drive', name: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg', connected: false },
    { id: 'dropbox', name: 'Dropbox', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg', connected: false },
    { id: 'onedrive', name: 'OneDrive', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg', connected: false },
    { id: 'google_calendar', name: 'Google Calendar', icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg', connected: false },
    { id: 'notion', name: 'Notion', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', connected: false },
    { id: 'spotify', name: 'Spotify', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', connected: false }
  ]);

  constructor() {
    const saved = localStorage.getItem('studymate_integrations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.integrations.update(current => 
          current.map(i => {
            const savedState = parsed.find((p: any) => p.id === i.id);
            return savedState ? { ...i, connected: savedState.connected, lastSync: savedState.lastSync } : i;
          })
        );
      } catch(e) {}
    }
  }

  toggleConnection(provider: Provider): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate OAuth popup flow
      setTimeout(() => {
        this.integrations.update(current => 
          current.map(i => i.id === provider ? { ...i, connected: !i.connected, lastSync: !i.connected ? new Date() : undefined } : i)
        );
        this.save();
        resolve(true);
      }, 1000);
    });
  }

  isConnected(provider: Provider): boolean {
    return this.integrations().find(i => i.id === provider)?.connected || false;
  }

  private save() {
    localStorage.setItem('studymate_integrations', JSON.stringify(this.integrations()));
  }

  // --- Google Drive / Cloud Files ---
  async getCloudFiles(provider: Provider): Promise<Array<{name: string, size: string, type: string}>> {
    if (!this.isConnected(provider)) throw new Error('Not connected');
    
    // Mock data based on provider
    await new Promise(r => setTimeout(r, 800)); // Network delay
    
    if (provider === 'google_drive') {
      return [
        { name: 'Biology_Notes_Ch1-5.pdf', size: '2.4 MB', type: 'application/pdf' },
        { name: 'History_Essay_Draft.gdoc', size: '150 KB', type: 'application/vnd.google-apps.document' },
        { name: 'Calculus_Homework.jpg', size: '4.1 MB', type: 'image/jpeg' }
      ];
    }
    if (provider === 'dropbox') {
      return [
        { name: 'Project_Alpha_Specs.docx', size: '1.1 MB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
        { name: 'Shared_Notes_Team.md', size: '45 KB', type: 'text/markdown' }
      ];
    }
    return [];
  }

  async saveFileToDrive(title: string, content: string, type: 'text' | 'pdf'): Promise<string> {
    if (!this.isConnected('google_drive')) throw new Error('Google Drive not connected');
    await new Promise(r => setTimeout(r, 1500));
    return `https://drive.google.com/file/d/${Math.random().toString(36).substr(2, 9)}/view`;
  }

  // --- Google Docs ---
  async exportToDocs(title: string, content: string): Promise<string> {
    if (!this.isConnected('google_drive')) throw new Error('Connect Google Drive to use Docs');
    await new Promise(r => setTimeout(r, 2000));
    return `https://docs.google.com/document/d/${Math.random().toString(36).substr(2, 15)}/edit`;
  }

  // --- Google Slides ---
  async exportToSlides(title: string, slidesData: any[]): Promise<string> {
    if (!this.isConnected('google_drive')) throw new Error('Connect Google Drive to use Slides');
    await new Promise(r => setTimeout(r, 2500));
    return `https://docs.google.com/presentation/d/${Math.random().toString(36).substr(2, 15)}/edit`;
  }

  // --- Google Sheets ---
  async exportToSheets(title: string, data: any[][]): Promise<string> {
    if (!this.isConnected('google_drive')) throw new Error('Connect Google Drive to use Sheets');
    await new Promise(r => setTimeout(r, 1800));
    return `https://docs.google.com/spreadsheets/d/${Math.random().toString(36).substr(2, 15)}/edit`;
  }

  // --- Google Calendar ---
  async syncCalendarEvents(): Promise<any[]> {
    if (!this.isConnected('google_calendar')) throw new Error('Calendar not connected');
    await new Promise(r => setTimeout(r, 1000));
    // Simulate fetching busy slots
    return [
      { title: 'Busy', start: new Date().setHours(14, 0), end: new Date().setHours(15, 0) },
      { title: 'Busy', start: new Date().setHours(16, 30), end: new Date().setHours(17, 30) }
    ];
  }

  async pushToCalendar(events: any[]): Promise<boolean> {
    if (!this.isConnected('google_calendar')) throw new Error('Calendar not connected');
    await new Promise(r => setTimeout(r, 1500));
    return true;
  }
}