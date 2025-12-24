import { Component, inject, signal, computed, OnInit, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudyService, StudySession } from '../../services/study.service';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';
import { IntegrationService } from '../../services/integration.service';
import { FormsModule } from '@angular/forms';
import { Chat } from '@google/genai';

declare var d3: any;

interface QuizQuestion { type?: string; question: string; options?: string[]; correctAnswer: string; explanation: string; }
interface Resource { title: string; url: string; type: 'video' | 'article' | 'book'; }
interface Flashcard { front: string; back: string; tag?: string; state?: 'hidden' | 'revealed'; }
interface MindMapNode { label: string; children?: MindMapNode[]; }
interface ComprehensiveContent { language: string; notes: string; summary: string | { short: string; balanced: string; detailed: string }; quiz: QuizQuestion[]; flashcards?: Flashcard[]; mindMap?: MindMapNode; thinkDeep: string; resources?: Resource[]; }
interface ChatMessage { role: 'user' | 'model'; text: string; }

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-500 font-sans">
       <!-- Floating Header -->
       <header class="fixed top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <button (click)="goBack()" class="pointer-events-auto bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-soft px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-zinc-300 hover:text-slate-900 hover:scale-105 transition flex items-center gap-2">
             ← Back
          </button>
          
          <div class="pointer-events-auto flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-soft p-1.5 rounded-full">
             <button (click)="copyToClipboard()" class="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition" title="Copy">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
             </button>
             <div class="w-px h-4 bg-slate-200 dark:bg-zinc-700"></div>
             <button (click)="exportToDocs()" class="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 transition" title="Export">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
             </button>
          </div>
       </header>

       <main class="max-w-3xl w-full mx-auto px-6 pt-24 pb-32 animate-fade-up">
        
        @if (session()) {
          <div class="mb-10 text-center">
             <h1 class="text-3xl font-light text-slate-900 dark:text-white mb-2 tracking-tight">{{ session()?.title }}</h1>
             <p class="text-xs text-slate-400 uppercase tracking-widest">{{ readingTime() }} min read • {{ session()?.date | date:'mediumDate' }}</p>
          </div>

          @if (isComprehensive()) {
            <!-- Floating Tabs -->
            <div class="flex justify-center mb-12">
               <div class="inline-flex bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-natural border border-slate-100 dark:border-zinc-800">
                  <button (click)="activeTab.set('notes')" [class.bg-slate-900]="activeTab() === 'notes'" [class.text-white]="activeTab() === 'notes'" [class.text-slate-500]="activeTab() !== 'notes'" class="px-5 py-2 rounded-full text-xs font-bold transition">Notes</button>
                  <button (click)="activeTab.set('summary')" [class.bg-slate-900]="activeTab() === 'summary'" [class.text-white]="activeTab() === 'summary'" [class.text-slate-500]="activeTab() !== 'summary'" class="px-5 py-2 rounded-full text-xs font-bold transition">Summary</button>
                  <button (click)="activeTab.set('quiz')" [class.bg-slate-900]="activeTab() === 'quiz'" [class.text-white]="activeTab() === 'quiz'" [class.text-slate-500]="activeTab() !== 'quiz'" class="px-5 py-2 rounded-full text-xs font-bold transition">Quiz</button>
                  @if(parsedContent()?.flashcards?.length) {
                     <button (click)="activeTab.set('flashcards')" [class.bg-slate-900]="activeTab() === 'flashcards'" [class.text-white]="activeTab() === 'flashcards'" [class.text-slate-500]="activeTab() !== 'flashcards'" class="px-5 py-2 rounded-full text-xs font-bold transition">Cards</button>
                  }
                  <button (click)="activeTab.set('thinkDeep')" [class.bg-slate-900]="activeTab() === 'thinkDeep'" [class.text-white]="activeTab() === 'thinkDeep'" [class.text-slate-500]="activeTab() !== 'thinkDeep'" class="px-5 py-2 rounded-full text-xs font-bold transition">Deep</button>
               </div>
            </div>
          }

          <div class="transition-all relative min-h-[50vh]">
            
            @if (isComprehensive()) {
               @if (parsedContent()) {
                  
                  <!-- Notes Tab -->
                  @if (activeTab() === 'notes') {
                     <div class="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[2rem] shadow-natural border border-slate-50 dark:border-zinc-800 prose prose-slate dark:prose-invert max-w-none prose-headings:font-light prose-p:text-slate-600 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-slate-600 dark:prose-li:text-zinc-300 animate-fade-up">
                        <div class="whitespace-pre-wrap">{{ parsedContent()?.notes }}</div>
                     </div>
                  }

                  <!-- Summary Tab -->
                  @if (activeTab() === 'summary') {
                     <div class="animate-fade-up">
                        <div class="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[2rem] shadow-natural border border-slate-50 dark:border-zinc-800 relative">
                           @if (isObject(parsedContent()?.summary)) {
                              <div class="absolute top-6 right-6 flex bg-slate-50 dark:bg-zinc-800 p-1 rounded-lg">
                                 <button (click)="summaryLevel.set('short')" [class.bg-white]="summaryLevel() === 'short'" [class.dark:bg-zinc-700]="summaryLevel() === 'short'" [class.shadow-sm]="summaryLevel() === 'short'" class="px-3 py-1 rounded-md text-[10px] font-bold text-slate-500 dark:text-zinc-400 transition">Brief</button>
                                 <button (click)="summaryLevel.set('balanced')" [class.bg-white]="summaryLevel() === 'balanced'" [class.dark:bg-zinc-700]="summaryLevel() === 'balanced'" [class.shadow-sm]="summaryLevel() === 'balanced'" class="px-3 py-1 rounded-md text-[10px] font-bold text-slate-500 dark:text-zinc-400 transition">Balanced</button>
                                 <button (click)="summaryLevel.set('detailed')" [class.bg-white]="summaryLevel() === 'detailed'" [class.dark:bg-zinc-700]="summaryLevel() === 'detailed'" [class.shadow-sm]="summaryLevel() === 'detailed'" class="px-3 py-1 rounded-md text-[10px] font-bold text-slate-500 dark:text-zinc-400 transition">Detailed</button>
                              </div>
                           }
                           <div class="prose prose-slate dark:prose-invert max-w-none mt-8">
                              <div class="whitespace-pre-wrap">{{ getSummaryContent() }}</div>
                           </div>
                        </div>
                     </div>
                  }

                   <!-- Quiz Tab -->
                  @if (activeTab() === 'quiz') {
                     <div class="space-y-6 animate-fade-up max-w-2xl mx-auto">
                        <div class="flex justify-between items-center mb-4">
                           <h3 class="font-bold text-slate-900 dark:text-white">Practice</h3>
                           <button (click)="resetQuiz()" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Reset</button>
                        </div>
                        
                        @for (q of parsedContent()?.quiz; track $index) {
                           <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6 shadow-soft hover:shadow-lg transition duration-300">
                              <div class="flex gap-4 mb-4">
                                 <span class="text-xs font-bold text-slate-300 mt-1">0{{ $index + 1 }}</span>
                                 <p class="font-medium text-slate-900 dark:text-zinc-200">{{ q.question }}</p>
                              </div>
                              <div class="pl-8 space-y-2">
                                 @if (q.type === 'short_answer') {
                                    <input placeholder="Type answer..." class="w-full bg-slate-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-indigo-500 transition" [disabled]="showResults()">
                                    @if (showResults()) { <p class="text-sm text-green-600 font-bold mt-2">Model: {{ q.correctAnswer }}</p> }
                                 } @else {
                                    @for (opt of q.options; track opt) {
                                       <button 
                                       (click)="selectAnswer($index, opt)"
                                       [disabled]="showResults()"
                                       [class.bg-slate-900]="quizState()[$index] === opt && !showResults()"
                                       [class.text-white]="quizState()[$index] === opt && !showResults()"
                                       [class.dark:bg-indigo-600]="quizState()[$index] === opt && !showResults()"
                                       [class.text-green-600]="showResults() && opt === q.correctAnswer"
                                       [class.font-bold]="showResults() && opt === q.correctAnswer"
                                       [class.text-red-500]="showResults() && quizState()[$index] === opt && opt !== q.correctAnswer"
                                       [class.opacity-40]="showResults() && opt !== q.correctAnswer && quizState()[$index] !== opt"
                                       class="w-full text-left px-4 py-3 rounded-xl border border-transparent bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition text-sm flex justify-between items-center"
                                       >
                                          <span>{{ opt }}</span>
                                          @if (showResults() && opt === q.correctAnswer) { <span>✓</span> }
                                       </button>
                                    }
                                 }
                              </div>
                              @if (showResults()) {
                                 <div class="mt-4 pl-8 pt-4 border-t border-slate-50 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                                    <strong class="block mb-1 text-slate-700 dark:text-zinc-300">Explanation</strong> {{ q.explanation }}
                                 </div>
                              }
                           </div>
                        }
                        @if(!showResults()) {
                           <button (click)="finishQuiz()" class="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold shadow-lg hover:scale-[1.02] transition">Check Answers</button>
                        }
                     </div>
                  }

                  <!-- Flashcards Tab -->
                  @if (activeTab() === 'flashcards') {
                     <div class="animate-fade-up flex flex-col items-center justify-center min-h-[400px]">
                        @if (parsedContent()?.flashcards?.length) {
                           <div class="relative w-full max-w-sm h-80 perspective-1000 cursor-pointer group" (click)="flipCard()">
                              <div class="relative w-full h-full text-center transition-transform duration-700 transform-style-3d" [class.rotate-y-180]="isCardFlipped()">
                                 <!-- Front -->
                                 <div class="absolute inset-0 w-full h-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl backface-hidden flex flex-col items-center justify-center p-8 shadow-natural group-hover:shadow-lg transition">
                                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Concept</span>
                                    <h3 class="text-2xl font-light text-slate-900 dark:text-white">{{ currentFlashcard().front }}</h3>
                                    <p class="absolute bottom-6 text-xs text-slate-300">Tap to flip</p>
                                 </div>
                                 <!-- Back -->
                                 <div class="absolute inset-0 w-full h-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 shadow-xl">
                                    <span class="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-6">Definition</span>
                                    <p class="text-lg font-medium leading-relaxed">{{ currentFlashcard().back }}</p>
                                 </div>
                              </div>
                           </div>
                           
                           <!-- Controls -->
                           <div class="flex items-center gap-8 mt-10">
                              <button (click)="prevCard()" class="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-soft hover:scale-110 transition text-slate-400 hover:text-slate-900 dark:hover:text-white">←</button>
                              <span class="text-xs font-mono font-bold text-slate-400">{{ currentCardIndex() + 1 }} / {{ parsedContent()?.flashcards?.length }}</span>
                              <button (click)="nextCard()" class="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-soft hover:scale-110 transition text-slate-400 hover:text-slate-900 dark:hover:text-white">→</button>
                           </div>
                        }
                     </div>
                  }

                  <!-- Think Deep Tab -->
                  @if (activeTab() === 'thinkDeep') {
                     <div class="animate-fade-up">
                       <div class="bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-8 rounded-[2rem] border border-indigo-50 dark:border-zinc-700 shadow-natural">
                          <div class="flex items-center gap-3 mb-6">
                             <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">💡</div>
                             <h3 class="text-xl font-bold text-indigo-900 dark:text-indigo-300">Deep Insights</h3>
                          </div>
                          <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-zinc-300">
                             <div class="whitespace-pre-wrap">{{ parsedContent()?.thinkDeep }}</div>
                          </div>
                       </div>
                     </div>
                  }

               } @else {
                  <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
                    <p class="text-slate-400 mb-4">Parsing content...</p>
                    <button (click)="showRawText.set(!showRawText())" class="text-xs text-indigo-600 underline">View Raw</button>
                    @if (showRawText()) { <div class="mt-4 p-4 bg-slate-50 text-xs font-mono text-slate-600 text-left w-full overflow-auto max-h-96 rounded-xl">{{ session()?.content }}</div> }
                  </div>
               }
            } @else {
               <div class="prose prose-slate max-w-none animate-fade-up"><div class="whitespace-pre-wrap font-sans text-base leading-relaxed">{{ session()?.content }}</div></div>
            }
          </div>
        } @else {
          <div class="text-center py-20 text-slate-400">Loading session...</div>
        }
      </main>

      <!-- Minimal AI Chat Bubble -->
      <div class="fixed bottom-6 right-6 z-40">
         @if (isChatOpen()) {
            <div class="absolute bottom-16 right-0 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-800 w-80 h-[28rem] flex flex-col overflow-hidden animate-fade-up origin-bottom-right">
               <div class="p-4 border-b border-slate-50 dark:border-zinc-800 flex justify-between items-center bg-white/50 backdrop-blur">
                  <div class="flex items-center gap-2">
                     <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span class="text-xs font-bold text-slate-600 dark:text-slate-300">AI Tutor</span>
                  </div>
                  <button (click)="toggleChat()" class="text-slate-400 hover:text-slate-600">✕</button>
               </div>
               <div #chatContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-zinc-900/50">
                  @for (msg of chatMessages(); track $index) {
                     <div [class.text-right]="msg.role === 'user'" [class.text-left]="msg.role === 'model'">
                        <span [class.bg-white]="msg.role === 'user'" [class.dark:bg-zinc-800]="msg.role === 'user'" [class.shadow-sm]="msg.role === 'user'" [class.text-slate-800]="msg.role === 'user'" [class.dark:text-zinc-200]="msg.role === 'user'" [class.text-slate-600]="msg.role === 'model'" [class.dark:text-zinc-400]="msg.role === 'model'" class="inline-block px-4 py-2.5 rounded-2xl text-xs max-w-[85%] leading-relaxed">
                           {{ msg.text }}
                        </span>
                     </div>
                  }
               </div>
               <div class="p-3 bg-white dark:bg-zinc-900 border-t border-slate-50 dark:border-zinc-800">
                  <input [(ngModel)]="chatInput" (keyup.enter)="sendMessage()" [disabled]="isChatLoading()" placeholder="Ask a question..." class="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white transition">
               </div>
            </div>
         }
         <button (click)="toggleChat()" class="bg-slate-900 dark:bg-white text-white dark:text-black w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition shadow-glow">
            <span class="text-xl">💬</span>
         </button>
      </div>
    </div>
  `
})
export class ResultComponent implements OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  @ViewChild('mindMapContainer') mindMapContainer!: ElementRef;

  session = signal<StudySession | undefined>(undefined);
  copied = signal(false);
  showRawText = signal(false);
  isExporting = signal(false);
  
  activeTab = signal<'notes' | 'summary' | 'quiz' | 'flashcards' | 'mindMap' | 'thinkDeep' | 'resources'>('notes');
  summaryLevel = signal<'short' | 'balanced' | 'detailed'>('balanced');
  parsedContent = signal<ComprehensiveContent | null>(null);
  
  quizState = signal<{[key: number]: string}>({});
  showResults = signal(false);
  currentCardIndex = signal(0);
  isCardFlipped = signal(false);

  isChatOpen = signal(false);
  isChatLoading = signal(false);
  chatInput = '';
  chatMessages = signal<ChatMessage[]>([]);
  private chatSession: Chat | null = null;
  
  readingTime = computed(() => {
     if (!this.parsedContent()) return 0;
     const text = (this.parsedContent()?.notes || '') + ' ' + this.getSummaryContent();
     return Math.ceil(text.length / 1000);
  });

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studyService = inject(StudyService);
  private aiService = inject(AiService);
  private authService = inject(AuthService);
  private integrationService = inject(IntegrationService);

  isComprehensive = computed(() => this.session()?.type === 'comprehensive');

  constructor() {
    effect(() => {
      if (this.activeTab() === 'mindMap' && this.parsedContent()?.mindMap) {
        setTimeout(() => this.renderMindMap(), 100);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        const s = this.studyService.getSession(id);
        this.session.set(s);
        if (s) {
           if (s.type === 'comprehensive') {
              try {
                 const parsed = JSON.parse(s.content);
                 this.parsedContent.set(parsed);
                 this.initializeChat(parsed);
              } catch (e) {
                 this.initializeChat(s.content);
              }
           } else {
              this.initializeChat(s.content);
           }
        }
      }
    });
  }

  isObject(val: any): boolean { return typeof val === 'object' && val !== null; }

  getSummaryContent(): string {
     const c = this.parsedContent();
     if (!c) return '';
     if (typeof c.summary === 'string') return c.summary;
     return c.summary[this.summaryLevel()] || c.summary.balanced;
  }

  currentFlashcard() {
    return this.parsedContent()?.flashcards?.[this.currentCardIndex()] || { front: '', back: '' };
  }

  flipCard() { this.isCardFlipped.update(v => !v); }
  
  nextCard() {
    if (!this.parsedContent()?.flashcards) return;
    this.isCardFlipped.set(false);
    setTimeout(() => {
       this.currentCardIndex.update(i => (i + 1) % this.parsedContent()!.flashcards!.length);
    }, 150);
  }

  prevCard() {
    if (!this.parsedContent()?.flashcards) return;
    this.isCardFlipped.set(false);
    setTimeout(() => {
       this.currentCardIndex.update(i => (i - 1 + this.parsedContent()!.flashcards!.length) % this.parsedContent()!.flashcards!.length);
    }, 150);
  }

  renderMindMap() {
    const data = this.parsedContent()?.mindMap;
    const container = this.mindMapContainer?.nativeElement;
    if (!data || !container || !d3) return;

    d3.select(container).selectAll("*").remove();
    const width = container.clientWidth;
    const height = 500;
    const root = d3.hierarchy(data);
    const svg = d3.select(container).append("svg").attr("width", width).attr("height", height).attr("viewBox", [-width/2, -height/2, width, height]).style("font", "10px sans-serif");
    const simulation = d3.forceSimulation(root.descendants()).force("link", d3.forceLink(root.links()).id((d: any) => d.data.label).distance(80).strength(1)).force("charge", d3.forceManyBody().strength(-300)).force("x", d3.forceX()).force("y", d3.forceY());
    const link = svg.append("g").attr("stroke", "#999").attr("stroke-opacity", 0.6).selectAll("line").data(root.links()).join("line");
    const node = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll("g").data(root.descendants()).join("g").call(this.drag(simulation));
    node.append("circle").attr("r", (d: any) => d.depth === 0 ? 10 : (d.depth === 1 ? 8 : 5)).attr("fill", (d: any) => d.depth === 0 ? "#4f46e5" : (d.depth === 1 ? "#818cf8" : "#c7d2fe"));
    node.append("text").attr("dy", "0.31em").attr("x", (d: any) => d.children ? -12 : 12).attr("text-anchor", (d: any) => d.children ? "end" : "start").text((d: any) => d.data.label).clone(true).lower().attr("fill", "none").attr("stroke", "white").attr("stroke-width", 3);
    simulation.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y).attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  }

  drag(simulation: any) {
    function dragstarted(event: any, d: any) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
    function dragged(event: any, d: any) { d.fx = event.x; d.fy = event.y; }
    function dragended(event: any, d: any) { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
  }

  async checkConnection(provider: any): Promise<boolean> {
    if (!this.integrationService.isConnected(provider)) {
       const connected = await this.integrationService.toggleConnection(provider);
       if (!connected) return false;
    }
    return true;
  }

  async exportToDocs() {
    if (!await this.checkConnection('google_drive')) return;
    this.isExporting.set(true);
    try {
       const title = this.session()?.title || 'StudyMate Notes';
       const content = this.parsedContent()?.notes || this.session()?.content || '';
       const url = await this.integrationService.exportToDocs(title, content);
       window.open(url, '_blank');
    } catch(e) { alert("Export failed."); } finally { this.isExporting.set(false); }
  }

  async exportToSlides() {
    if (!await this.checkConnection('google_drive')) return;
    this.isExporting.set(true);
    try {
       const title = this.session()?.title || 'StudyMate Presentation';
       const summary = this.getSummaryContent();
       const slides = summary.split('\n\n').map(s => ({ text: s }));
       const url = await this.integrationService.exportToSlides(title, slides);
       window.open(url, '_blank');
    } catch(e) { alert("Export failed."); } finally { this.isExporting.set(false); }
  }

  async exportToSheets() {
    if (!await this.checkConnection('google_drive')) return;
    if (!this.parsedContent()?.quiz) { alert("No quiz data."); return; }
    this.isExporting.set(true);
    try {
       const title = (this.session()?.title || 'Quiz') + " Results";
       const data = this.parsedContent()!.quiz.map(q => [q.question, q.correctAnswer]);
       const url = await this.integrationService.exportToSheets(title, data);
       window.open(url, '_blank');
    } catch(e) { alert("Export failed."); } finally { this.isExporting.set(false); }
  }

  initializeChat(content: ComprehensiveContent | string) {
     const sessionId = this.session()?.id;
     if (sessionId) {
        const history = localStorage.getItem(`chat_history_${sessionId}`);
        if (history) {
           try { this.chatMessages.set(JSON.parse(history)); } catch(e) {}
        } else {
           this.chatMessages.set([{ role: 'model', text: `Hi! I'm ready to help with this topic.` }]);
        }
     }
     let contextString = "";
     if (typeof content === 'string') contextString = content;
     else {
        contextString = `NOTES: ${content.notes}\nSUMMARY: ${typeof content.summary === 'string' ? content.summary : content.summary.balanced}\nQUIZ: ${JSON.stringify(content.quiz)}`;
     }
     this.chatSession = this.aiService.startStudyChat(contextString);
  }

  toggleChat() {
     this.isChatOpen.update(v => !v);
     if (this.isChatOpen()) setTimeout(() => this.scrollToBottom(), 100);
  }

  openChatWithContext(msg: string) {
     this.isChatOpen.set(true);
     this.chatInput = msg;
     this.sendMessage();
  }

  async sendMessage() {
     if (!this.chatInput.trim() || !this.chatSession) return;
     const userMsg = this.chatInput;
     this.chatInput = '';
     this.isChatLoading.set(true);
     this.updateChatHistory({ role: 'user', text: userMsg });
     this.scrollToBottom();
     try {
        const result = await this.chatSession.sendMessage({ message: userMsg });
        this.updateChatHistory({ role: 'model', text: result.text });
        this.scrollToBottom();
     } catch (e) {
        this.updateChatHistory({ role: 'model', text: "Connection error." });
     } finally { this.isChatLoading.set(false); }
  }

  private updateChatHistory(msg: ChatMessage) {
     this.chatMessages.update(msgs => {
        const newMsgs = [...msgs, msg];
        if (this.session()?.id) localStorage.setItem(`chat_history_${this.session()?.id}`, JSON.stringify(newMsgs));
        return newMsgs;
     });
  }

  scrollToBottom() {
     if (this.chatContainer) setTimeout(() => this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight, 50);
  }

  goBack() { this.router.navigate(['/app/dashboard']); }

  copyToClipboard() {
    let content = "";
    if (this.isComprehensive() && this.parsedContent()) {
       const c = this.parsedContent()!;
       if (this.activeTab() === 'quiz') content = c.quiz.map((q, i) => `${i+1}. ${q.question}\nAnswer: ${q.correctAnswer}`).join('\n\n');
       else if (this.activeTab() === 'summary') content = this.getSummaryContent();
       else if (this.activeTab() === 'notes') content = c.notes;
    } else { content = this.session()?.content || ""; }
    if (content) {
      navigator.clipboard.writeText(content);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  print() { window.print(); }

  selectAnswer(index: number, option: string) {
     if (this.showResults()) return;
     this.quizState.update(s => ({...s, [index]: option}));
  }

  resetQuiz() {
     this.quizState.set({});
     this.showResults.set(false);
  }

  finishQuiz() {
     this.showResults.set(true);
     const title = this.session()?.title || "General";
     const subject = title.split(' ')[0] || "General";
     this.authService.updateMastery(subject, 5);
  }
}