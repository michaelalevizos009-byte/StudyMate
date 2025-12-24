import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <!-- Navbar -->
      <nav class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div class="flex items-center gap-2 cursor-pointer" (click)="scrollTo('top')">
            <div class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">S</div>
            <span class="text-xl font-bold tracking-tight text-slate-900">StudyMate AI</span>
          </div>
          <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button (click)="scrollTo('features')" class="hover:text-indigo-600 transition">Features</button>
            <button (click)="scrollTo('how-it-works')" class="hover:text-indigo-600 transition">How it works</button>
            <button (click)="scrollTo('pricing')" class="hover:text-indigo-600 transition">Pricing</button>
          </div>
          <div class="flex items-center gap-4">
            <a routerLink="/login" class="text-sm font-medium text-slate-600 hover:text-indigo-600">Log in</a>
            <a routerLink="/login" class="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 hover:shadow-md transition">Try it free</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section id="top" class="relative overflow-hidden pt-20 pb-32">
        <div class="mx-auto max-w-4xl px-6 text-center">
          <div class="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 mb-8">
            ✨ AI Study Assistant for Students
          </div>
          <h1 class="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl mb-6">
            Turn messy notes into <br> <span class="text-indigo-600">perfect grades.</span>
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-600 mb-10 leading-relaxed">
            Stop wasting time organizing. Upload your class notes and instantly get exam summaries, practice quizzes, and clear explanations. Study faster, stress less.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a routerLink="/login" class="w-full sm:w-auto rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition transform">Try it free</a>
            <a routerLink="/login" class="w-full sm:w-auto rounded-full bg-white border border-slate-200 px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition">Upload your notes</a>
          </div>
          
          <!-- Hero Visual -->
          <div class="mt-16 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 transform rotate-1 hover:rotate-0 transition duration-500">
            <div class="rounded-xl bg-slate-50 p-8 h-64 flex items-center justify-center overflow-hidden relative">
               <div class="absolute inset-0 bg-[url('https://cdn.tailwindcss.com/img/patterns/grid-slate.svg')] opacity-10"></div>
               <div class="flex gap-8 items-center animate-pulse">
                  <div class="h-32 w-24 bg-white rounded shadow-sm border border-slate-200 p-2 flex flex-col gap-2">
                    <div class="h-2 w-full bg-slate-200 rounded"></div>
                    <div class="h-2 w-3/4 bg-slate-200 rounded"></div>
                    <div class="h-2 w-full bg-slate-200 rounded"></div>
                  </div>
                  <div class="text-slate-400">→</div>
                  <div class="h-32 w-48 bg-white rounded shadow-md border border-indigo-100 p-4 flex flex-col gap-2 relative">
                    <div class="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">AI Summary</div>
                    <div class="h-3 w-full bg-indigo-100 rounded"></div>
                    <div class="h-2 w-full bg-slate-100 rounded"></div>
                    <div class="h-2 w-5/6 bg-slate-100 rounded"></div>
                    <div class="h-2 w-full bg-slate-100 rounded"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Problem Section -->
      <section class="py-24 bg-white">
        <div class="mx-auto max-w-6xl px-6">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold tracking-tight text-slate-900 mb-6">Studying shouldn't feel like a punishment.</h2>
              <div class="space-y-6">
                <div class="flex gap-4">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">✕</div>
                  <div>
                    <h3 class="font-semibold text-slate-900">Overwhelmed by messy notes?</h3>
                    <p class="text-slate-600 mt-1">Staring at pages of scribbles makes it impossible to know what actually matters for the exam.</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">✕</div>
                  <div>
                    <h3 class="font-semibold text-slate-900">Don't know where to start?</h3>
                    <p class="text-slate-600 mt-1">Wasting hours organizing material instead of actually learning it.</p>
                  </div>
                </div>
                <div class="flex gap-4">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">✕</div>
                  <div>
                    <h3 class="font-semibold text-slate-900">Exam anxiety?</h3>
                    <p class="text-slate-600 mt-1">Walking into tests unsure if you've covered the right topics.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 rounded-2xl p-8 border border-slate-100">
               <!-- Abstract chaos visual -->
               <div class="grid grid-cols-2 gap-4 opacity-50">
                  <div class="bg-white h-24 rounded-lg shadow-sm rotate-3"></div>
                  <div class="bg-white h-24 rounded-lg shadow-sm -rotate-2"></div>
                  <div class="bg-white h-24 rounded-lg shadow-sm -rotate-6 translate-y-4"></div>
                  <div class="bg-white h-24 rounded-lg shadow-sm rotate-1 translate-y-2"></div>
               </div>
               <p class="text-center mt-8 font-medium text-slate-500">Does your desk look like this?</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Solution Section -->
      <section id="how-it-works" class="py-24 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div class="mx-auto max-w-6xl px-6 text-center">
          <h2 class="text-3xl font-bold text-slate-900 mb-16">Three steps to better grades</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div class="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6 mx-auto">1</div>
              <h3 class="text-xl font-semibold mb-3">Upload your notes</h3>
              <p class="text-slate-600">Drag and drop PDFs, images of your notebook, or paste text directly. We support clear handwriting too.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div class="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6 mx-auto">2</div>
              <h3 class="text-xl font-semibold mb-3">AI Analysis</h3>
              <p class="text-slate-600">We analyze, decipher, and extract the core educational value instantly. No more fluff.</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
              <div class="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6 mx-auto">3</div>
              <h3 class="text-xl font-semibold mb-3">Ace the Exam</h3>
              <p class="text-slate-600">Get perfectly structured notes, summaries, quizzes, and deep explanations all at once.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-24 bg-white scroll-mt-20">
        <div class="mx-auto max-w-6xl px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-slate-900">Everything you need to ace the test</h2>
            <p class="text-slate-500 mt-4 text-lg">Designed by students, for students.</p>
          </div>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition">
              <div class="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-xl">📝</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Smart Study Notes</h3>
              <p class="text-slate-600">Turn chaotic scribbles into clean, structured bullet points. We extract the signal from the noise.</p>
            </div>
             <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition">
              <div class="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-xl">⚡</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Exam Summaries</h3>
              <p class="text-slate-600">Get a "Cheat Sheet" style summary that focuses only on high-value exam topics.</p>
            </div>
             <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition">
              <div class="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-xl">🧠</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Quiz Generator</h3>
              <p class="text-slate-600">Test yourself before the teacher does. Generate unlimited practice questions with answer keys.</p>
            </div>
             <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition">
              <div class="h-10 w-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-xl">💡</div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Deep Think Mode</h3>
              <p class="text-slate-600">Go beyond the surface. Understand the "Why", connect concepts, and learn to think critically.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Responsible AI Section -->
      <section class="py-24 bg-indigo-900 text-white">
         <div class="mx-auto max-w-4xl px-6 text-center">
            <h2 class="text-3xl font-bold mb-6">Our Commitment to Responsible Learning</h2>
            <p class="text-indigo-200 text-lg mb-10 leading-relaxed">
               StudyMate AI is built to <strong>enhance</strong> your mind, not replace it. We don't write essays for you or help you cheat. We act as a 24/7 tutor that helps you organize information, test your knowledge, and deepen your understanding.
            </p>
            <div class="grid md:grid-cols-3 gap-6 text-left">
               <div class="bg-indigo-800/50 p-6 rounded-xl border border-indigo-700">
                  <h3 class="font-bold mb-2 text-white">Active Recall</h3>
                  <p class="text-sm text-indigo-200">We use quizzes to force your brain to retrieve information, which is scientifically proven to improve memory.</p>
               </div>
               <div class="bg-indigo-800/50 p-6 rounded-xl border border-indigo-700">
                  <h3 class="font-bold mb-2 text-white">Critical Thinking</h3>
                  <p class="text-sm text-indigo-200">Our "Think Deep" mode encourages you to connect dots and understand underlying principles.</p>
               </div>
               <div class="bg-indigo-800/50 p-6 rounded-xl border border-indigo-700">
                  <h3 class="font-bold mb-2 text-white">Safe & Ethical</h3>
                  <p class="text-sm text-indigo-200">We prioritize student safety and data privacy. Your educational journey is personal and protected.</p>
               </div>
            </div>
         </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="py-24 bg-white scroll-mt-20">
        <div class="mx-auto max-w-6xl px-6">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-slate-900">Simple, student-friendly pricing</h2>
            <p class="text-slate-500 mt-4 text-lg">Invest in your education for less than the cost of a lunch.</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- Free -->
            <div class="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col relative">
              <div class="mb-6">
                 <h3 class="text-xl font-bold text-slate-900">Study Starter</h3>
                 <p class="text-slate-500 text-sm mt-1">For casual studying.</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-bold text-slate-900">$0</span>
                <span class="text-slate-500">/forever</span>
              </div>
              <ul class="space-y-4 text-sm text-slate-600 mb-8 flex-1">
                <li class="flex gap-3"><span class="text-green-600 font-bold">✓</span> 3 free generations per week</li>
                <li class="flex gap-3"><span class="text-green-600 font-bold">✓</span> Smart Notes & Summaries</li>
                <li class="flex gap-3"><span class="text-green-600 font-bold">✓</span> Basic Quizzes</li>
                <li class="flex gap-3"><span class="text-green-600 font-bold">✓</span> 24/7 Access</li>
              </ul>
              <a routerLink="/login" class="block w-full text-center py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm">
                Start for Free
              </a>
            </div>

            <!-- Pro -->
            <div class="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 relative flex flex-col transform md:-translate-y-4">
              <div class="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">MOST POPULAR</div>
              <div class="mb-6">
                 <h3 class="text-xl font-bold text-slate-900">Exam Passer</h3>
                 <p class="text-indigo-600 text-sm mt-1 font-medium">For serious students.</p>
              </div>
              <div class="mb-6">
                <span class="text-4xl font-bold text-slate-900">$9</span>
                <span class="text-slate-500">/month</span>
              </div>
              <ul class="space-y-4 text-sm text-slate-600 mb-8 flex-1">
                <li class="flex gap-3"><span class="text-indigo-600 font-bold">✓</span> <strong>Unlimited</strong> generations</li>
                <li class="flex gap-3"><span class="text-indigo-600 font-bold">✓</span> <strong>Deep Thinking</strong> mode included</li>
                <li class="flex gap-3"><span class="text-indigo-600 font-bold">✓</span> Priority AI processing</li>
                <li class="flex gap-3"><span class="text-indigo-600 font-bold">✓</span> Upload larger & complex files</li>
                <li class="flex gap-3"><span class="text-indigo-600 font-bold">✓</span> Cancel anytime</li>
              </ul>
              <a routerLink="/login" class="block w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200">
                Get Pro Access
              </a>
              <p class="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
                Secure payment via Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="py-24 bg-slate-50 border-t border-slate-100">
        <div class="mx-auto max-w-4xl px-6 text-center">
          <h2 class="text-4xl font-bold text-slate-900 mb-6">Start studying smarter today.</h2>
          <p class="text-lg text-slate-600 mb-10">Join thousands of students who are acing their exams with less stress.</p>
          <a routerLink="/login" class="inline-block rounded-full bg-indigo-600 px-10 py-4 text-lg font-semibold text-white shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition transform">Try it free</a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-white py-12 border-t border-slate-200">
        <div class="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="col-span-2">
            <div class="flex items-center gap-2 mb-4">
               <div class="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">S</div>
               <span class="font-bold text-slate-900">StudyMate AI</span>
            </div>
            <p class="text-sm text-slate-500 max-w-xs">Helping students learn faster and stress less with ethical AI tools.</p>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><button (click)="scrollTo('features')" class="hover:text-indigo-600">Features</button></li>
              <li><button (click)="scrollTo('pricing')" class="hover:text-indigo-600">Pricing</button></li>
              <li><a routerLink="/login" class="hover:text-indigo-600">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              <li><a routerLink="/privacy" class="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a routerLink="/terms" class="hover:text-indigo-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="mx-auto max-w-6xl px-6 mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          © 2024 StudyMate AI. All rights reserved.
        </div>
      </footer>
    </div>
  `
})
export class LandingPageComponent {
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}