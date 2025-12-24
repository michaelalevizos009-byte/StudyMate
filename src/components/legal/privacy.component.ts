import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-6">
      <div class="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-200">
        <a routerLink="/" class="inline-flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:underline">
          ← Back to Home
        </a>
        <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p class="text-slate-500 mb-8 text-sm">Last updated: May 20, 2024</p>
        
        <div class="prose prose-slate max-w-none text-sm leading-relaxed space-y-6">
          <section>
            <h2 class="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, upload study materials, or contact customer support. This includes your email address and the content of your notes.</p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, including generating study guides and quizzes. <strong>We do not use your personal uploaded data to train public AI models.</strong></p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-slate-900">3. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. Your data is encrypted in transit and at rest.</p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-slate-900">4. Third-Party Services</h2>
            <p>We use trusted third-party providers (such as Stripe for payments and Google for AI processing) to help us operate our service. These providers have access to your information only to perform specific tasks on our behalf.</p>
          </section>
          
          <section>
            <h2 class="text-lg font-bold text-slate-900">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@studymate.ai.</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}