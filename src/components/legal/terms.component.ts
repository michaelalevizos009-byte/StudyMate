import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-6">
      <div class="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
        <a routerLink="/" class="inline-flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
          ← Back to Home
        </a>
        <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
        <p class="text-slate-500 mb-8 text-sm">Last updated: May 20, 2024</p>
        
        <div class="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
          <section>
            <h2 class="text-lg font-bold text-slate-900">1. Introduction</h2>
            <p>Welcome to StudyMate AI. By accessing or using our website and services, you agree to be bound by these Terms of Service.</p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-slate-900">2. Usage Rights</h2>
            <p>StudyMate AI grants you a limited, non-exclusive, non-transferable license to use our services for personal, educational purposes. You agree not to use the service for any illegal or unauthorized purpose.</p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-slate-900">3. AI Content</h2>
            <p>Our service uses Artificial Intelligence to generate study materials. While we strive for accuracy, AI models can make mistakes. You should verify important information from your primary educational resources.</p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-slate-900">4. Subscriptions & Payments</h2>
            <p>Paid subscriptions are billed in advance on a monthly basis. You may cancel your subscription at any time. Refunds are handled on a case-by-case basis as per our refund policy.</p>
          </section>
          
          <section>
            <h2 class="text-lg font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>StudyMate AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}