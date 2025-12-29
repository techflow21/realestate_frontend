import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../store/auth/auth.store';
import { RegisterRequest } from '../../../core/models/auth.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or
            <a [routerLink]="['/auth/login']" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 ml-1">
              sign in to existing account
            </a>
          </p>
        </div>

        <app-card>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            @if (store.error()) {
              <div class="rounded-md bg-red-50 dark:bg-red-900 p-4">
                <p class="text-sm text-red-800 dark:text-red-200">
                  {{ store.error() }}
                </p>
              </div>
            }

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  formControlName="firstName"
                  type="text"
                  required
                  class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-base"
                  placeholder="John"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  formControlName="lastName"
                  type="text"
                  required
                  class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-base"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                formControlName="email"
                type="email"
                required
                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-base"
                placeholder="you@example.com"
              />
              @if (form.controls.email.invalid && form.controls.email.touched) {
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                  Please enter a valid email address
                </p>
              }
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                formControlName="password"
                type="password"
                required
                class="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-base"
                placeholder="••••••••"
              />
              @if (form.controls.password.invalid && form.controls.password.touched) {
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                  Password must be at least 6 characters
                </p>
              }
            </div>

            <app-button
              type="submit"
              [disabled]="form.invalid || store.loading()"
              class="w-full"
            >
              @if (store.loading()) {
                <span>Creating account...</span>
              } @else {
                Create Account
              }
            </app-button>

            <div class="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <a [routerLink]="['/auth/login']" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 ml-1">
                Sign in
              </a>
          </div>
        </form>
      </app-card>
    </div>
  `,
  styles: ``
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected store = inject(AuthStore);

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.store.register(this.form.value as RegisterRequest);
      // On success, redirect to verify
      // In real app: listen to success via effect or signal
    }
  }
}
