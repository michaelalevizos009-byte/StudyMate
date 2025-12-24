import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export interface CardDetails {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
  zip: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  /**
   * Simulates a secure payment transaction with a payment provider (e.g., Stripe).
   * In a real app, this would use the Stripe SDK to create a token/source and 
   * send it to the backend.
   */
  processPayment(details: CardDetails): Observable<PaymentResult> {
    // Validate before processing (Double check)
    if (!this.validateCardNumber(details.number)) {
      return throwError(() => new Error('Invalid card number'));
    }

    // Simulate network delay for realism
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo
    const transactionId = 'tx_' + Math.random().toString(36).substr(2, 9);

    return of(isSuccess ? { success: true, transactionId } : { success: false, error: 'Card was declined by the issuer.' }).pipe(
      delay(2000)
    );
  }

  // --- Validation Utilities ---

  validateCardNumber(number: string): boolean {
    const san = number.replace(/\s+/g, '');
    if (!/^\d+$/.test(san)) return false;
    return this.luhnCheck(san);
  }

  validateExpiry(expiry: string): boolean {
    // Format: MM/YY
    if (!/^\d\d\/\d\d$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(val => parseInt(val, 10));
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Last 2 digits
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  }

  validateCVC(cvc: string): boolean {
    return /^\d{3,4}$/.test(cvc);
  }

  formatCardNumber(value: string): string {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }

  formatExpiry(value: string): string {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  }

  // Luhn Algorithm for card validation
  private luhnCheck(val: string): boolean {
    let sum = 0;
    let shouldDouble = false;
    for (let i = val.length - 1; i >= 0; i--) {
      let digit = parseInt(val.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  }
}