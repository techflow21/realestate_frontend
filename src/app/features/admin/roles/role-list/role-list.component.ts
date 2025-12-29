import { Component, inject, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService, Role } from '../../../../core/services/role.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { NotificationService } from '../../../../shared/components/notification/notification.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, ModalComponent, ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Roles Management</h1>
        <app-button (click)="openCreateModal()">
          <fa-icon [icon]="['fas', 'plus']" class="mr-2" />
          Add Role
        </app-button>
      </div>

      <!-- Roles Table -->
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                @for (role of roles(); track role.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ role.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {{ role.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        (click)="openEditModal(role)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                      >
                        <fa-icon [icon]="['fas', 'edit']" />
                      </button>
                      @if (role.name !== 'ROLE_ADMIN') {
                        <button
                          (click)="openDeleteModal(role)"
                          class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <fa-icon [icon]="['fas', 'trash']" />
                        </button>
                      }
                    </td>
                  </tr>
                }
                @empty {
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No roles found
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </app-card>

      <!-- Create Role Modal -->
      <app-modal
        #createModal
        title="Create New Role"
        confirmText="Create"
        size="md"
        [disableConfirm]="createForm.invalid"
        (confirm)="createRole()"
      >
        <form [formGroup]="createForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name *</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                ROLE_
              </span>
              <input
                formControlName="name"
                type="text"
                class="w-full pl-16 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="AGENT"
              />
            </div>
            @if (createForm.get('name')?.errors && createForm.get('name')?.touched) {
              <p class="mt-1 text-sm text-red-600">Role name is required</p>
            }
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Role names will be prefixed with <code>ROLE_</code> automatically.
          </p>
        </form>
      </app-modal>

      <!-- Edit Role Modal -->
      <app-modal
        #editModal
        title="Edit Role"
        confirmText="Update"
        size="sm"
        [disableConfirm]="editForm.invalid"
        (confirm)="updateRole()"
      >
        <form [formGroup]="editForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name *</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                ROLE_
              </span>
              <input
                formControlName="name"
                type="text"
                class="w-full pl-16 pr-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="AGENT"
              />
            </div>
          </div>
        </form>
      </app-modal>

      <!-- Delete Confirmation Modal -->
      <app-modal
        #deleteModal
        title="Delete Role"
        confirmText="Delete"
        size="sm"
        (confirm)="deleteRole()"
      >
        <p class="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the role 
          <span class="font-medium text-red-600 dark:text-red-400">{{ selectedRole()?.name }}</span>?
          This action cannot be undone.
        </p>
        <p class="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
          <fa-icon [icon]="['fas', 'exclamation-triangle']" class="mr-1" />
          Users with this role will lose access.
        </p>
      </app-modal>
    </div>
  `,
  styles: ``
})
export class RoleListComponent {
  private roleService = inject(RoleService);
  private fb = inject(FormBuilder);
  private library = inject(FaIconLibrary);
  private notificationService = inject(NotificationService);

  @ViewChild('createModal') createModal!: ModalComponent;
  @ViewChild('editModal') editModal!: ModalComponent;
  @ViewChild('deleteModal') deleteModal!: ModalComponent;

  roles = signal<Role[]>([]);
  loading = signal(true);
  selectedRole = signal<Role | null>(null);

  createForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern('^[A-Z_]+$')]]
  });

  editForm = this.fb.nonNullable.group({
    id: [0],
    name: ['', [Validators.required, Validators.pattern('^[A-Z_]+$')]]
  });

  constructor() {
    this.library.addIcons(faEdit, faTrash, faPlus, faExclamationTriangle);
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading.set(true);
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.notificationService.error('Failed to load roles');
        console.error('Load roles error:', error);
      }
    });
  }

  openCreateModal() {
    this.createForm.reset();
    this.createModal.open();
  }

  openEditModal(role: Role) {
    this.editForm.patchValue({
      id: role.id,
      name: role.name.replace('ROLE_', '')
    });
    this.editModal.open();
  }

  openDeleteModal(role: Role) {
    this.selectedRole.set(role);
    this.deleteModal.open();
  }

  createRole() {
    if (this.createForm.valid) {
      const roleName = `ROLE_${this.createForm.value.name}`;
      
      this.roleService.createRole(roleName).subscribe({
        next: (newRole) => {
          this.roles.update(roles => [...roles, newRole]);
          this.notificationService.success(`Role "${roleName}" created successfully`);
          this.createModal.close();
          this.createForm.reset();
        },
        error: (error) => {
          console.error('Create role error:', error);
          this.notificationService.error(error?.error?.message || 'Failed to create role');
        }
      });
    }
  }

  updateRole() {
    if (this.editForm.valid) {
      const id = this.editForm.value.id!;
      const roleName = `ROLE_${this.editForm.value.name}`;
      
      this.roleService.updateRole(id, roleName).subscribe({
        next: (updatedRole) => {
          this.roles.update(roles => 
            roles.map(role => role.id === id ? updatedRole : role)
          );
          this.notificationService.success(`Role updated successfully`);
          this.editModal.close();
        },
        error: (error) => {
          console.error('Update role error:', error);
          this.notificationService.error(error?.error?.message || 'Failed to update role');
        }
      });
    }
  }

  deleteRole() {
    const role = this.selectedRole();
    if (role) {
      this.roleService.deleteRole(role.id).subscribe({
        next: () => {
          this.roles.update(roles => roles.filter(r => r.id !== role.id));
          this.notificationService.success(`Role "${role.name}" deleted successfully`);
          this.deleteModal.close();
        },
        error: (error) => {
          console.error('Delete role error:', error);
          this.notificationService.error(error?.error?.message || 'Failed to delete role');
          this.deleteModal.close();
        }
      });
    }
  }
}
