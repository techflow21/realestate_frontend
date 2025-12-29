import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../store/auth/auth.store';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
        </div>

        <app-card>
          <div class="text-center">
            @if (status() === 'pending') {
              <div class="py-8">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p class="mt-6 text-base text-gray-600 dark:text-gray-400">Verifying your email...</p>
              </div>
            } @else if (status() === 'success') {
              <div class="py-8">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
                  <svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Email verified!</h3>
                <p class="mt-3 text-base text-gray-600 dark:text-gray-400">
                  Your email has been successfully verified. You can now log in to your account.
                </p>
                <app-button (click)="goToLogin()" class="mt-6 w-full">
                  Go to Login
                </app-button>
              </div>
            } @else {
              <div class="py-8">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                  <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Verification failed</h3>
                <p class="mt-3 text-base text-gray-600 dark:text-gray-400">
                  The verification token is invalid or has expired. Please request a new verification email.
                </p>
                <app-button variant="secondary" (click)="resend()" class="mt-6 w-full">
                  Resend Verification Email
                </app-button>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: ``
})
export class VerifyComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected store = inject(AuthStore);

  status = signal<'pending' | 'success' | 'error'>('pending');

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.store.verifyEmail(token);
      // Simulate success after 1s (in real: listen to effect)
      setTimeout(() => this.status.set('success'), 1000);
    } else {
      this.status.set('error');
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  resend() {
    // In real app: call API to resend
    alert('Verification email resent!');
  }
}
