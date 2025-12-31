import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Il mio Account</h1>

      <div class="flex flex-col md:flex-row gap-8">
        
        <aside class="w-full md:w-64 shrink-0">
          <mat-card class="overflow-hidden rounded-lg! border border-gray-200 shadow-sm">
            <mat-nav-list class="py-0">
              
              <a mat-list-item routerLink="/profile/details" routerLinkActive="active-link" class="rounded-none! h-12">
                <mat-icon matListItemIcon class="text-gray-500">person</mat-icon>
                <span matListItemTitle class="font-medium">Dati Personali</span>
              </a>

              <a mat-list-item routerLink="/profile/orders" routerLinkActive="active-link" class="rounded-none! h-12">
                <mat-icon matListItemIcon class="text-gray-500">shopping_bag</mat-icon>
                <span matListItemTitle class="font-medium">I miei Ordini</span>
              </a>

              <a mat-list-item routerLink="/profile/addresses" routerLinkActive="active-link" class="rounded-none! h-12">
                <mat-icon matListItemIcon class="text-gray-500">place</mat-icon>
                <span matListItemTitle class="font-medium">Indirizzi</span>
              </a>

              <mat-divider></mat-divider>

              <a mat-list-item routerLink="/profile/security" routerLinkActive="active-link" class="rounded-none! h-12">
                <mat-icon matListItemIcon class="text-gray-500">lock</mat-icon>
                <span matListItemTitle class="font-medium">Sicurezza</span>
              </a>

            </mat-nav-list>
          </mat-card>
        </aside>

        <div class="flex-1 min-w-0">
           <router-outlet></router-outlet>
        </div>

      </div>
    </div>
  `,
  styles: [`
      .active-link {
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }
    
    .active-link mat-icon {
      color: var(--mat-sys-on-primary-container);
    }
    `]
})
export class ProfileLayoutComponent {}