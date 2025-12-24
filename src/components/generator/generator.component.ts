import { Component, inject, signal, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { StudyService, StudySession } from '../../services/study.service';
import { AuthService } from '../../services/auth.service';
import { IntegrationService, Provider } from '../../services/integration.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col transition-colors duration-500 font-sans">
      
      <!-- Navbar -->
      <header class="fixed top-0 left-0 right-0 py-6 px-8 z-30 flex justify-between items-center pointer-events-none">
        <button (click)="goBack()" class="pointer-events-auto bg-white dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-full shadow-soft text-xs font-bold transition flex items-center gap-2">
          ← Back
        </button>
      </header>

      <main class="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        <div class="w-full max-w-3xl animate-fade-up">
           <h1 class="text-3xl md:text-4xl font-light text-slate-900 dark:text-white text-center mb-8 tracking-tight">What are we studying?</h1>

           <!-- Error -->
           @if (errorMessage()) {
              <div class="mb-6 mx-auto max-w-md bg-red-50 text-red-600 px-4 py-3 rounded-xl text-center text-sm border border-red-100">
                 {{ errorMessage() }} <button (click)="retry()" class="underline font-bold ml-2">Retry</button>
              </div>
           }

           <!-- Input Canvas -->
           <div class="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-natural border border-slate-100 dark:border-zinc-800 p-2 overflow-hidden relative transition-all duration-500 focus-within:shadow-glow focus-within:border-indigo-100">
              
              <!-- Tabs -->
              <div class="flex gap-2 p-2 mb-2 border-b border-slate-50 dark:border-zinc-800">
                 <button (click)="inputType.set('text')" class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all" [class.bg-slate-50]="inputType() === 'text'" [class.dark:bg-zinc-800]="inputType() === 'text'" [class.text-indigo-600]="inputType() === 'text'" [class.text-slate-400]="inputType() !== 'text'">Text Input</button>
                 <button (click)="inputType.set('file')" class="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all" [class.bg-slate-50]="inputType() === 'file'" [class.dark:bg-zinc-800]="inputType() === 'file'" [class.text-indigo-600]="inputType() === 'file'" [class.text-slate-400]="inputType() !== 'file'">Upload File</button>
              </div>

              <div class="p-4 min-h-[300px]">
                 @if (inputType() === 'text') {
                    <textarea 
                      [(ngModel)]="inputText"
                      (ngModelChange)="onTextChange($event)"
                      class="w-full h-full min-h-[300px] bg-transparent outline-none resize-none text-slate-700 dark:text-zinc-300 placeholder:text-slate-300 dark:placeholder:text-zinc-700 text-lg leading-relaxed font-light"
                      placeholder="Paste your notes, syllabus, or rough ideas here..."
                    ></textarea>
                 }

                 @if (inputType() === 'file') {
                    <div (click)="fileInput.click()" class="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 dark:border-zinc-800 rounded-2xl hover:border-indigo-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition cursor-pointer group">
                       <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" [disabled]="isFileProcessing()">
                       
                       @if (isFileProcessing()) {
                          <div class="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          <span class="text-sm font-medium text-indigo-600">{{ uploadStatus() }}</span>
                       } @else if (selectedFile) {
                          <div class="text-4xl mb-4 group-hover:scale-110 transition">📄</div>
                          <p class="font-medium text-slate-900 dark:text-white">{{ selectedFile.name }}</p>
                          <p class="text-xs text-slate-400 mb-6">{{ (selectedFile.size / 1024 / 1024) | number:'1.1-2' }} MB</p>
                          <button (click)="$event.stopPropagation(); clearFile()" class="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20">Remove</button>
                       } @else {
                          <div class="text-slate-300 dark:text-zinc-600 text-3xl mb-4">kp</div>
                          <p class="text-slate-500 dark:text-zinc-400 font-medium">Click to upload document</p>
                          <p class="text-xs text-slate-300 mt-2">PDF, Images, MD supported</p>
                          
                          <div class="flex gap-4 mt-8">
                             <button (click)="$event.stopPropagation(); importFromCloud('google_drive')" class="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 dark:border-zinc-800 text-xs font-bold text-slate-500 hover:bg-white hover:shadow-sm transition">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" class="w-3 h-3"> Drive
                             </button>
                             <button (click)="$event.stopPropagation(); importFromCloud('dropbox')" class="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 dark:border-zinc-800 text-xs font-bold text-slate-500 hover:bg-white hover:shadow-sm transition">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg" class="w-3 h-3"> Dropbox
                             </button>
                          </div>
                       }
                    </div>
                 }
              </div>
           </div>

           <!-- Floating Controls -->
           <div class="mt-8 flex flex-col items-center gap-6">
              
              <!-- Focus Mode Toggles -->
              <div class="flex p-1 bg-white dark:bg-zinc-900 rounded-full shadow-soft border border-slate-100 dark:border-zinc-800">
                 @for (mode of ['general', 'exam', 'simplify']; track mode) {
                    <button (click)="studyFocus.set(mode)" [class.bg-slate-900]="studyFocus() === mode" [class.text-white]="studyFocus() === mode" [class.text-slate-500]="studyFocus() !== mode" class="px-5 py-2 rounded-full text-xs font-bold transition capitalize">{{ mode }}</button>
                 }
                 <button (click)="selectDeepFocus()" [class.bg-slate-900]="studyFocus() === 'deep'" [class.text-white]="studyFocus() === 'deep'" [class.text-slate-500]="studyFocus() !== 'deep'" class="px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-1 group">
                    Deep Dive 
                    @if(!authService.isPro()) { <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> }
                 </button>
              </div>

              <!-- Main Button -->
              @if (isGenerating()) {
                 <div class="flex flex-col items-center gap-4">
                    <div class="relative w-16 h-16">
                       <div class="absolute inset-0 border-4 border-slate-100 dark:border-zinc-800 rounded-full"></div>
                       <div class="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div class="text-center">
                       <p class="text-sm font-bold text-slate-800 dark:text-white animate-pulse">{{ currentProgressStep() }}</p>
                       <p class="text-xs text-slate-400 mt-1 italic max-w-xs">"{{ currentTip() }}"</p>
                    </div>
                 </div>
              } @else {
                 <button 
                    (click)="generate()" 
                    [disabled]="(!inputText && !selectedFile) || (authService.currentUser()?.credits || 0) <= 0 || isFileProcessing()"
                    class="group relative bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-full font-bold shadow-lg shadow-slate-200 dark:shadow-none hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                 >
                    <span class="flex items-center gap-2">
                       Generate Study Guide
                       <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                 </button>
                 <p class="text-[10px] text-slate-400">{{ authService.currentUser()?.credits }} credits remaining</p>
              }
           </div>

        </div>
      </main>
    </div>
  `
})
export class GeneratorComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;

  inputType = signal<'text' | 'file'>('text');
  studyFocus = signal<'general' | 'exam' | 'simplify' | 'deep'>('general'); // Use 'any' to bypass strict check for demo
  
  inputText = '';
  sessionTitle = ''; 
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);
  
  base64Data: string | null = null;
  textContent: string | null = null;
  
  isGenerating = signal(false);
  isFileProcessing = signal(false);
  uploadStatus = signal('Processing...');
  currentProgressStep = signal('Thinking...');
  currentTip = signal('');
  errorMessage = signal('');

  private progressInterval: any;
  private tips = [
     "Active recall boosts memory retention.",
     "Explaining helps understanding.",
     "Short bursts of focus are better than long marathons.",
     "Sleep consolidates learning.",
     "Analyzing patterns in your text...",
     "Connecting concepts..."
  ];

  private router = inject(Router);
  private aiService = inject(AiService);
  private studyService = inject(StudyService);
  private integrationService = inject(IntegrationService);
  private notificationService = inject(NotificationService);
  authService = inject(AuthService);

  ngOnDestroy() {
     if (this.progressInterval) clearInterval(this.progressInterval);
  }

  goBack() {
    this.router.navigate(['/app/dashboard']);
  }

  retry() {
    this.generate();
  }

  isImage(mime: string): boolean {
     return mime.startsWith('image/');
  }

  clearFile() {
     this.selectedFile = null;
     this.imagePreview.set(null);
     this.base64Data = null;
     this.textContent = null;
     if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  selectDeepFocus() {
     if (this.authService.canUseDeepThink()) {
        this.studyFocus.set('deep' as any);
     } else {
        alert("Deep Dive mode is a Pro feature.");
        this.router.navigate(['/app/upgrade']);
     }
  }

  private isTextBased(file: File): boolean {
    const textTypes = ['text/', 'application/json', 'application/javascript', 'application/xml', 'application/csv'];
    const textExtensions = ['.md', '.ts', '.js', '.json', '.csv', '.xml', '.txt', '.html', '.css', '.scss'];
    return textTypes.some(t => file.type.startsWith(t)) || textExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  onTextChange(val: string) {
     if (!this.sessionTitle && val.length > 10) {
        const firstLine = val.split('\n')[0].trim();
        this.sessionTitle = firstLine.substring(0, 40) + (firstLine.length > 40 ? '...' : '');
     }
  }

  async importFromCloud(provider: Provider) {
    if (!this.integrationService.isConnected(provider)) {
       const connected = await this.integrationService.toggleConnection(provider);
       if (!connected) return;
    }
    
    this.isFileProcessing.set(true);
    this.uploadStatus.set(`Connecting...`);
    
    try {
       const files = await this.integrationService.getCloudFiles(provider);
       if (files.length > 0) {
          const file = files[0];
          this.uploadStatus.set(`Importing...`);
          setTimeout(() => {
             const blob = new Blob(["Mock content"], { type: file.type });
             this.selectedFile = new File([blob], file.name, { type: file.type });
             this.sessionTitle = file.name;
             this.isFileProcessing.set(false);
             this.notificationService.add({ title: 'Imported', message: `Imported ${file.name}`, type: 'success' });
          }, 1500);
       } else {
          throw new Error('No files.');
       }
    } catch(e) {
       this.isFileProcessing.set(false);
       this.errorMessage.set("Import failed.");
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const maxBytes = this.authService.getMaxFileSize();
      if (file.size > maxBytes) {
         this.errorMessage.set(`File too large.`);
         this.clearFile();
         return;
      }

      this.selectedFile = file;
      this.isFileProcessing.set(true); 
      this.uploadStatus.set('Reading...');
      this.errorMessage.set('');
      
      this.imagePreview.set(null); 
      this.base64Data = null;
      this.textContent = null;
      
      if (!this.sessionTitle) {
         const name = file.name.replace(/\.[^/.]+$/, "");
         this.sessionTitle = name.charAt(0).toUpperCase() + name.slice(1).replace(/[-_]/g, ' ');
      }
      
      const reader = new FileReader();
      if (this.isTextBased(file)) {
         reader.onload = () => {
           this.textContent = reader.result as string;
           setTimeout(() => this.isFileProcessing.set(false), 500);
         };
         reader.onerror = () => this.handleFileError();
         reader.readAsText(file);
      } else {
         reader.onload = () => {
           const result = reader.result as string;
           this.base64Data = result.split(',')[1]; 
           if (this.isImage(file.type)) this.imagePreview.set(result);
           setTimeout(() => this.isFileProcessing.set(false), 800); 
         };
         reader.onerror = () => this.handleFileError();
         reader.readAsDataURL(file);
      }
    }
  }

  handleFileError() {
      this.isFileProcessing.set(false);
      this.errorMessage.set("Error reading file.");
      this.clearFile();
  }

  async generate() {
    if (this.isGenerating()) return;
    this.errorMessage.set('');
    
    const user = this.authService.currentUser();
    if (!user || user.credits <= 0) {
      alert("No credits left.");
      return;
    }

    this.isGenerating.set(true);
    this.startProgressSimulation();

    try {
      let filePart = undefined;
      let finalContent = this.inputText;

      if (this.inputType() === 'file' && this.selectedFile) {
         if (this.textContent) {
            finalContent = (finalContent ? finalContent + "\n\n" : "") + `[File: ${this.selectedFile.name}]\n` + this.textContent;
         } else if (this.base64Data) {
            filePart = { inlineData: { mimeType: this.selectedFile.type, data: this.base64Data } };
            if (!finalContent) finalContent = `Analyze this document (${this.selectedFile.name}).`;
         } else if (this.selectedFile.name.includes("Mock")) {
             finalContent = "Mock content regarding biology.";
         }
      }

      if (!finalContent && !filePart) throw new Error("Empty content");

      const result = await this.aiService.generateStudyContent(finalContent, 'comprehensive', filePart, this.studyFocus() as any);

      if (!result) throw new Error("Empty response");

      let focusLabel = '';
      if (this.studyFocus() === 'exam') focusLabel = 'Exam Prep: ';
      if (this.studyFocus() === 'simplify') focusLabel = 'Simplified: ';
      
      const title = this.sessionTitle || this.generateTitle(finalContent);

      const newSession: StudySession = {
        id: crypto.randomUUID(),
        title: focusLabel + title,
        type: 'comprehensive',
        date: new Date(),
        content: result,
        originalInput: finalContent.substring(0, 100) + '...'
      };

      this.studyService.addSession(newSession);
      this.authService.deductCredit();
      this.router.navigate(['/app/result', newSession.id]);

    } catch (e: any) {
      this.errorMessage.set(e.message || 'Processing failed. Try again.');
    } finally {
      this.isGenerating.set(false);
      if (this.progressInterval) clearInterval(this.progressInterval);
    }
  }

  private startProgressSimulation() {
     const steps = ['Analyzing...', 'Summarizing...', 'Creating Quiz...', 'Finalizing...'];
     let index = 0;
     let tipIndex = 0;
     this.currentProgressStep.set(steps[0]);
     this.currentTip.set(this.tips[0]);
     
     this.progressInterval = setInterval(() => {
        index = (index + 1);
        if (index < steps.length) this.currentProgressStep.set(steps[index]);
        if (index % 1 === 0) {
           tipIndex = (tipIndex + 1) % this.tips.length;
           this.currentTip.set(this.tips[tipIndex]);
        }
     }, 2000); 
  }

  private generateTitle(text: string): string {
    const cleanText = text.replace(/\[File: .*\]/, '').trim();
    const topic = cleanText.substring(0, 20).replace(/[\n\r]/g, ' ').trim() || "Study Material";
    return `${topic}...`;
  }
}