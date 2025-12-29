import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { take, finalize, forkJoin } from 'rxjs';
import { UserStore } from '../../../../store/users/user.store';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { RoleService, Role } from '../../../../core/services/role.service';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ModalComponent, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Manage Users
      </h1>

      <app-card>
        @if (loading()) {
          <div class="flex justify-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roles</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                @for (user of users(); track user.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.firstName }} {{ user.lastName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div class="flex flex-wrap gap-1">
                        @for (role of user.roles; track role) {
                          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {{ role.replace('ROLE_', '') }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (user.enabled) {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Active
                        </span>
                      } @else {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                          Disabled
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="openEditModal(user)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                      >
                        <fa-icon [icon]="['fas', 'edit']" />
                      </button>
                      <button
                        (click)="toggleEnabled(user)"
                        [class]="user.enabled ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300' : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'"
                        [title]="user.enabled ? 'Disable User' : 'Enable User'"
                      >
                        <fa-icon [icon]="['fas', user.enabled ? 'user-slash' : 'user-check']" />
                      </button>
                    </td>
                  </tr>
                }
                @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No users found
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </app-card>

      <!-- Edit User Modal -->
      <app-modal
        #editModal
        title="Edit User"
        confirmText="Update"
        size="md"
        [disableConfirm]="editForm.invalid || submitting()"
        (confirm)="updateUser()"
      >
        @if (loadingUserData()) {
          <div class="flex justify-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        } @else {
          <form [formGroup]="editForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                <input
                  formControlName="firstName"
                  type="text"
                  class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                <input
                  formControlName="lastName"
                  type="text"
                  class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input
                formControlName="email"
                type="email"
                class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Roles *</label>
              <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3">
                @for (role of availableRoles(); track role.id) {
                  <label class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                    <input
                      type="checkbox"
                      [value]="role.id"
                      [checked]="isRoleSelected(role.id)"
                      (change)="toggleRole(role.id, $event)"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span class="text-sm text-gray-900 dark:text-white">{{ role.name.replace('ROLE_', '') }}</span>
                  </label>
                }
              </div>
              @if (selectedRoleIds().length === 0) {
                <p class="mt-1 text-sm text-red-600">Please select at least one role</p>
              }
            </div>
          </form>
        }
      </app-modal>
    </div>
  `,
  styles: ``
})
export class UserListComponent {
  protected userStore = inject(UserStore);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private library = inject(FaIconLibrary);

  @ViewChild('editModal') editModal!: ModalComponent;

  users = this.userStore.users;
  loading = signal(false);
  loadingUserData = signal(false);
  submitting = signal(false);
  selectedUser = signal<User | null>(null);
  availableRoles = signal<Role[]>([]);
  selectedRoleIds = signal<number[]>([]);

  editForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    this.library.addIcons(faEdit, faTrash, faUserCheck, faUserSlash);
    // Load users on init
    this.loading.set(true);
    this.userStore.loadUsers({ page: 1 });
    // Small delay to sync with store loading
    setTimeout(() => this.loading.set(false), 500);
  }

  openEditModal(user: User) {
    this.selectedUser.set(user);
    this.loadingUserData.set(true);
    this.editModal.open();

    // Fetch user details and available roles
    forkJoin({
      userDetails: this.userService.getUser(user.id),
      roles: this.roleService.getRoles()
    })
      .pipe(
        take(1),
        finalize(() => this.loadingUserData.set(false))
      )
      .subscribe({
        next: ({ userDetails, roles }) => {
          // Populate form
          this.editForm.patchValue({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email
          });

          // Set available roles
          this.availableRoles.set(roles);

          // Map user's role names to role IDs
          const userRoleIds = roles
            .filter(role => userDetails.roles.includes(role.name))
            .map(role => role.id);
          this.selectedRoleIds.set(userRoleIds);
        },
        error: (error) => {
          console.error('Failed to load user data:', error);
          this.notificationService.error('Failed to load user details');
          this.editModal.close();
        }
      });
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds().includes(roleId);
  }

  toggleRole(roleId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRoleIds.update(ids => [...ids, roleId]);
    } else {
      this.selectedRoleIds.update(ids => ids.filter(id => id !== roleId));
    }
  }

  updateUser() {
    if (this.editForm.invalid || this.selectedRoleIds().length === 0 || this.submitting()) {
      return;
    }

    const user = this.selectedUser();
    if (!user) return;

    this.submitting.set(true);

    const updateRequest = {
      firstName: this.editForm.value.firstName!,
      lastName: this.editForm.value.lastName!,
      email: this.editForm.value.email!,
      roleIds: this.selectedRoleIds()
    };

    this.userService.updateUser(user.id, updateRequest)
      .pipe(
        take(1),
        finalize(() => this.submitting.set(false))
      )
      .subscribe({
        next: (updatedUser) => {
          this.notificationService.success(`User "${updatedUser.firstName} ${updatedUser.lastName}" updated successfully`);
          this.editModal.close();
          // Reload users
          this.userStore.loadUsers({ page: 1 });
        },
        error: (error) => {
          console.error('Update user failed:', error);
          this.notificationService.error(error?.error?.message || 'Failed to update user');
        }
      });
  }

  toggleEnabled(user: User) {
    this.userService.toggleEnabled(user.id, !user.enabled)
      .pipe(take(1))
      .subscribe({
        next: (updated) => {
          this.notificationService.success(
            `User "${user.firstName} ${user.lastName}" ${updated.enabled ? 'enabled' : 'disabled'} successfully`
          );
          // Reload users
          this.userStore.loadUsers({ page: 1 });
        },
        error: (error) => {
          console.error('Toggle enabled failed:', error);
          this.notificationService.error('Failed to update user status');
        }
      });
  }
}
