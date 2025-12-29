import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ChartComponent } from '../../../shared/components/chart/chart.component';
import { AuthStore } from '../../../store/auth/auth.store';
import { PropertyStore } from '../../../store/properties/property.store';
import { UserStore } from '../../../store/users/user.store';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faUsers, 
  faHome, 
  faChartBar, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CardComponent, ChartComponent, FontAwesomeModule],
  template: `
    <div class="space-y-6">
      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a [routerLink]="['/admin/users']" class="block hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between h-24 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4 shadow-md">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg bg-blue-500 text-white">
                <fa-icon [icon]="['fas', 'users']" class="text-2xl" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics().totalUsers || 0 }}</p>
              </div>
            </div>
          </div>
        </a>

        <a [routerLink]="['/admin/properties']" class="block hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between h-24 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-4 shadow-md">
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg bg-green-500 text-white">
                <fa-icon [icon]="['fas', 'home']" class="text-2xl" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Properties</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics().activeProperties || 0 }}</p>
              </div>
            </div>
          </div>
        </a>

        <div class="flex items-center justify-between h-24 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-4 shadow-md">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-purple-500 text-white">
              <fa-icon [icon]="['fas', 'chart-bar']" class="text-2xl" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">This Month</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics().propertiesThisMonth || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between h-24 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 rounded-lg p-4 shadow-md">
          <div class="flex items-center space-x-3">
            <div class="p-2 rounded-lg bg-amber-500 text-white">
              <fa-icon [icon]="['fas', 'exclamation-triangle']" class="text-2xl" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Rate Limit Violations</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ metrics().rateLimitViolations || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Placeholder -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-card title="Properties by Status">
          <app-chart
            type="doughnut"
            [data]="propertiesChartData"
            [options]="chartOptions"
            height="300px"
          />
        </app-card>
        <app-card title="Monthly Property Listings">
          <app-chart
            type="line"
            [data]="monthlyChartData"
            [options]="chartOptions"
            height="300px"
          />
        </app-card>
      </div>
    </div>
  `,
  styles: ``
})
export class DashboardComponent {
  protected authStore = inject(AuthStore);
  protected propertyStore = inject(PropertyStore);
  protected userStore = inject(UserStore);
  
  metrics = signal({
    totalUsers: 0,
    activeUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    propertiesThisMonth: 0,
    rateLimitViolations: 0
  });

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  propertiesChartData: any = {
    labels: ['Active', 'Pending', 'Sold', 'Inactive'],
    datasets: [
      {
        data: [45, 12, 28, 15],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  monthlyChartData: any = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Listings',
        data: [12, 19, 15, 25, 22, 30],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  constructor(library: FaIconLibrary) {
    library.addIcons(faUsers, faHome, faChartBar, faExclamationTriangle);
    
    // Load data
    this.propertyStore.loadProperties({ page: 0 });
    this.userStore.loadUsers({ page: 0 });
  }
}
