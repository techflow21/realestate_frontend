import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        @if (success) {
          <app-card>
            <div class="rounded-md bg-green-50 dark:bg-green-900 p-4">
              <p class="text-sm text-green-800 dark:text-green-200">
                Password reset link has been sent to your email. Please check your inbox.
              </p>
            </div>
            <div class="mt-6">
              <a [routerLink]="['/auth/login']" 
                 class="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Back to login
              </a>
            </div>
          </app-card>
        } @else {
          <app-card>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  required
                  class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-base"
                  placeholder="Enter your email"
                />
                @if (form.controls.email.invalid && form.controls.email.touched) {
                  <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                    Please enter a valid email address
                  </p>
                }
              </div>

              @if (error) {
                <div class="rounded-md bg-red-50 dark:bg-red-900 p-4">
                  <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
                </div>
              }

              <div>
                <app-button 
                  type="submit" 
                  [disabled]="form.invalid || loading"
                  class="w-full">
                  {{ loading ? 'Sending...' : 'Send reset link' }}
                </app-button>
              </div>

              <div class="text-sm text-center">
                <a [routerLink]="['/auth/login']" 
                   class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Back to login
                </a>
              </div>
            </form>
          </app-card>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';
  success = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.error = '';
      
      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.success = true;
      }, 1500);
      
      // In real app:
      // this.authService.forgotPassword(this.form.value.email).subscribe({
      //   next: () => {
      //     this.loading = false;
      //     this.success = true;
      //   },
      //   error: (err) => {
      //     this.loading = false;
      //     this.error = err.error?.message || 'Failed to send reset link';
      //   }
      // });
    }
  }
}
