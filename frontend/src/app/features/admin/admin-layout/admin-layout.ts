import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatListModule, MatIconModule, MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="min-h-[calc(100vh-64px)]" autosize>
      
      <mat-sidenav mode="side" opened class="w-64 border-r border-gray-200 bg-gray-900 text-white">
        <div class="p-4 border-b border-gray-800">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <mat-icon class="text-red-500">admin_panel_settings</mat-icon>
            Admin Panel
          </h2>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="/admin" routerLinkActive="bg-gray-800 text-red-400" class="text-gray-300 hover:bg-gray-800">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            Dashboard
          </a>
          <a mat-list-item routerLink="/admin/users" routerLinkActive="bg-gray-800 text-red-400" class="text-gray-300 hover:bg-gray-800">
            <mat-icon matListItemIcon>group</mat-icon>
            Utenti
          </a>
          <a mat-list-item routerLink="/admin" routerLinkActive="bg-gray-800 text-red-400" class="text-gray-300 hover:bg-gray-800">
            <mat-icon matListItemIcon>shopping_cart</mat-icon>
            Ordini
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="bg-gray-50 p-8">
        <router-outlet></router-outlet>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styles: [`
    :host ::ng-deep .mat-mdc-list-item { color: inherit !important; }
    :host ::ng-deep .mat-icon { color: inherit; }
  `]
})
export class AdminLayoutComponent {}