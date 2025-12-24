import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService, CardDetails } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-2 cursor-pointer" (click)="goBack()">
          <div class="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">S</div>
          <span class="font-bold text-slate-900">StudyMate AI</span>
        </div>
        <div class="flex items-center gap-2 text-slate-500 text-sm">
          <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <span class="font-medium">Secure Checkout</span>
        </div>
      </header>

      <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
        
        <div class="text-center mb-10">
           <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">Unlock Your Potential</span>
           <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Invest in your future self.</h1>
           <p class="text-slate-500 max-w-2xl mx-auto text-lg">Don't just study harder. Study smarter with the personalized AI coach that adapts to you.</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8 items-start">
          
          <!-- Left Column: Benefits & Emotion -->
          <div class="order-2 lg:order-1 space-y-6">
             <!-- Testimonial Card -->
             <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div class="flex gap-1 mb-2">
                   <span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span><span class="text-yellow-400">★</span>
                </div>
                <p class="text-slate-700 italic mb-4">"I used to spend hours just organizing my notes. Now StudyMate does it instantly, and the Deep Dive mode helps me actually understand the concepts."</p>
                <div class="flex items-center gap-3">
                   <div class="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">J</div>
                   <div>
                      <p class="text-xs font-bold text-slate-900">Jessica T.</p>
                      <p class="text-[10px] text-slate-500">Pre-Med Student</p>
                   </div>
                </div>
             </div>

             <!-- Features List -->
             <div class="bg-indigo-900 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
                
                <h2 class="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-6">What you get with Pro</h2>
                <ul class="space-y-4 mb-8">
                   <li class="flex items-start gap-3">
                      <div class="h-6 w-6 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 text-sm shrink-0">✓</div>
                      <div>
                         <strong class="block text-white">AI Study Coach</strong>
                         <span class="text-sm text-indigo-200">Personalized daily tips based on your weak spots.</span>
                      </div>
                   </li>
                   <li class="flex items-start gap-3">
                      <div class="h-6 w-6 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 text-sm shrink-0">✓</div>
                      <div>
                         <strong class="block text-white">Deep Dive Mode</strong>
                         <span class="text-sm text-indigo-200">Advanced AI reasoning for complex topics.</span>
                      </div>
                   </li>
                   <li class="flex items-start gap-3">
                      <div class="h-6 w-6 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 text-sm shrink-0">✓</div>
                      <div>
                         <strong class="block text-white">Unlimited Generations</strong>
                         <span class="text-sm text-indigo-200">Create as many quizzes and guides as you need.</span>
                      </div>
                   </li>
                   <li class="flex items-start gap-3">
                      <div class="h-6 w-6 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 text-sm shrink-0">✓</div>
                      <div>
                         <strong class="block text-white">Smart Planner Optimization</strong>
                         <span class="text-sm text-indigo-200">Automatically reschedule missed sessions.</span>
                      </div>
                   </li>
                </ul>

                <div class="flex justify-between items-end border-t border-indigo-800 pt-6">
                   <div>
                      <p class="text-sm font-medium text-indigo-200">Exam Passer Plan</p>
                      <h1 class="text-3xl font-bold">$9</h1>
                   </div>
                   <div class="text-right">
                      <span class="text-indigo-300 text-sm">per month</span>
                   </div>
                </div>
             </div>
          </div>

          <!-- Right Column: Payment Form -->
          <div class="order-1 lg:order-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 class="text-xl font-bold text-slate-900 mb-6">Payment Details</h2>

            <!-- Error Banner -->
            @if (error()) {
               <div class="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
                  <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span class="text-sm font-medium">{{ error() }}</span>
               </div>
            }

            <!-- Success State -->
            @if (isSuccess()) {
               <div class="text-center py-12 animate-fade-in">
                  <div class="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 class="text-2xl font-bold text-slate-900 mb-2">Welcome to Pro!</h3>
                  <p class="text-slate-500 mb-6">Your account has been upgraded. Get ready to excel.</p>
                  <button (click)="goBack()" class="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Go to Dashboard</button>
               </div>
            } @else {

               <form (submit)="onSubmit($event)" class="space-y-6">
                  
                  <!-- Card Name -->
                  <div>
                     <label class="block text-sm font-medium text-slate-700 mb-1.5">Cardholder Name</label>
                     <input 
                        type="text" 
                        [(ngModel)]="card.name" 
                        name="name" 
                        placeholder="John Doe"
                        class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white"
                        [class.border-red-300]="hasTriedSubmit() && !card.name"
                     >
                  </div>

                  <!-- Card Number -->
                  <div>
                     <label class="block text-sm font-medium text-slate-700 mb-1.5">Card Number</label>
                     <div class="relative">
                        <input 
                           type="text" 
                           [ngModel]="card.number" 
                           (ngModelChange)="onCardNumberChange($event)"
                           name="number" 
                           placeholder="0000 0000 0000 0000"
                           maxlength="19"
                           class="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white font-mono"
                           [class.border-red-300]="hasTriedSubmit() && !isValidNumber()"
                        >
                        <div class="absolute left-4 top-3.5 text-slate-400">
                           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                     </div>
                     @if (hasTriedSubmit() && !isValidNumber()) {
                        <p class="text-red-500 text-xs mt-1">Invalid card number</p>
                     }
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                     <!-- Expiry -->
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Expiry Date</label>
                        <input 
                           type="text" 
                           [ngModel]="card.expiry" 
                           (ngModelChange)="onExpiryChange($event)"
                           name="expiry" 
                           placeholder="MM/YY"
                           maxlength="5"
                           class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white text-center"
                           [class.border-red-300]="hasTriedSubmit() && !isValidExpiry()"
                        >
                         @if (hasTriedSubmit() && !isValidExpiry()) {
                           <p class="text-red-500 text-xs mt-1">Invalid date</p>
                        }
                     </div>

                     <!-- CVC -->
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                           <span>CVC</span>
                           <span class="text-slate-400 text-xs cursor-help" title="3 or 4 digit code on the back">?</span>
                        </label>
                        <div class="relative">
                           <input 
                              type="text" 
                              [(ngModel)]="card.cvc" 
                              name="cvc" 
                              placeholder="123"
                              maxlength="4"
                              class="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white"
                              [class.border-red-300]="hasTriedSubmit() && !isValidCVC()"
                           >
                           <div class="absolute left-4 top-3.5 text-slate-400">
                              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                           </div>
                        </div>
                     </div>
                  </div>

                  <!-- Zip -->
                  <div>
                     <label class="block text-sm font-medium text-slate-700 mb-1.5">Zip / Postal Code</label>
                     <input 
                        type="text" 
                        [(ngModel)]="card.zip" 
                        name="zip" 
                        placeholder="10001"
                        class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white"
                        [class.border-red-300]="hasTriedSubmit() && !card.zip"
                     >
                  </div>

                  <!-- Submit Button -->
                  <button 
                     type="submit" 
                     [disabled]="isProcessing()"
                     class="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                     @if (isProcessing()) {
                        <div class="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                     } @else {
                        <span>Pay $9.00</span>
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     }
                  </button>

                  <p class="text-center text-xs text-slate-400 mt-4">
                     Payments are securely processed by Stripe. <br> Your card information is encrypted.
                  </p>
               </form>
            }
          </div>
        </div>
      </main>
    </div>
  `
})
export class UpgradeComponent {
  paymentService = inject(PaymentService);
  authService = inject(AuthService);
  router = inject(Router);

  card: CardDetails = {
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    zip: ''
  };

  isProcessing = signal(false);
  isSuccess = signal(false);
  error = signal('');
  hasTriedSubmit = signal(false);

  // Validation Signals
  isValidNumber = computed(() => this.paymentService.validateCardNumber(this.card.number));
  isValidExpiry = computed(() => this.paymentService.validateExpiry(this.card.expiry));
  isValidCVC = computed(() => this.paymentService.validateCVC(this.card.cvc));
  
  isValidForm = computed(() => 
    this.card.name.length > 0 &&
    this.isValidNumber() &&
    this.isValidExpiry() &&
    this.isValidCVC() &&
    this.card.zip.length > 0
  );

  onCardNumberChange(value: string) {
     this.card.number = this.paymentService.formatCardNumber(value);
  }

  onExpiryChange(value: string) {
     this.card.expiry = this.paymentService.formatExpiry(value);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.hasTriedSubmit.set(true);
    this.error.set('');

    if (!this.isValidForm()) {
       this.error.set("Please check your card details.");
       return;
    }

    this.isProcessing.set(true);

    this.paymentService.processPayment(this.card).subscribe({
      next: (result) => {
        this.isProcessing.set(false);
        if (result.success) {
           this.authService.upgradeToPro();
           this.isSuccess.set(true);
        } else {
           this.error.set(result.error || 'Payment failed. Please try again.');
        }
      },
      error: (err) => {
         this.isProcessing.set(false);
         this.error.set(err.message || 'An unexpected error occurred.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/app/dashboard']);
  }
}