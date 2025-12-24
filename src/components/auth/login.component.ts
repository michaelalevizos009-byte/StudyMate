import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div class="text-center mb-8">
          <div class="inline-flex h-10 w-10 rounded-lg bg-indigo-600 items-center justify-center text-white font-bold text-xl mb-4">S</div>
          <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p class="text-slate-500 mt-2">Enter your email to sign in or create an account.</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              placeholder="student@school.edu"
              class="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
              autofocus
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              class="w-full rounded-lg border-slate-300 border px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            >
          </div>
          
          <button 
            (click)="handleLogin()"
            class="w-full rounded-lg bg-indigo-600 py-2.5 text-white font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            Continue
          </button>
          
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
            <div class="relative flex justify-center text-sm"><span class="bg-white px-2 text-slate-500">Or</span></div>
          </div>

           <button 
            (click)="handleSignup()"
            class="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Create new account
          </button>

        </div>
        
        <p class="text-center text-xs text-slate-400 mt-8">
          By clicking continue, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  authService = inject(AuthService);

  handleLogin() {
    if (this.email) {
      this.authService.login(this.email);
    }
  }

  handleSignup() {
    if (this.email) {
      this.authService.signup(this.email);
    } else {
        // Quick demo signup if empty
        this.authService.signup("demo@studymate.ai");
    }
  }
}