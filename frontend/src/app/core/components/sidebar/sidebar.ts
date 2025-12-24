import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../../shared/services/product.service';
import { Category } from '../../../shared/models/product.model';

interface CategoryGroup {
  parentName: string;
  parentId: number;
  categories: Category[];
}

@Component({
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
  ],
  template: `
    <div class="h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300">
      
      <div
        class="flex items-center shrink-0 border-b border-gray-100 h-16 transition-all duration-300"
        [class.justify-between]="!isCollapsed()"
        [class.px-4]="!isCollapsed()"
        [class.justify-center]="isCollapsed()"
        [class.px-0]="isCollapsed()"
      >
        @if(!isCollapsed()){
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <mat-icon class="text-red-600">category</mat-icon>
            Categories
          </h2>
        }

        <button
          mat-icon-button
          type="button"
          (click)="toggleSidebar()"
          [matTooltip]="isCollapsed() ? 'Espandi' : 'Comprimi'"
          class="text-gray-500 hover:text-red-600 transition-colors"
        >
          <mat-icon>{{ isCollapsed() ? 'menu' : 'chevron_left' }}</mat-icon>
        </button>
      </div>

      @if(!isCollapsed()){
      <div class="flex-1 overflow-hidden w-full relative group"> 
        <div class="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          <div class="px-5 pt-2 mb-1">
            <mat-nav-list class="pt-0 pb-0">
              <a
                mat-list-item
                [routerLink]="['/products/category/all']"
                routerLinkActive="bg-red-50"
                [class.bg-red-50]="activeCategory() === 'all'"
                class="w-full"
              >
                <span
                  matListItemTitle
                  class="font-medium transition-colors ml-6"
                  [class.text-red-700]="activeCategory() === 'all'"
                >
                  All Products
                </span>
              </a>
            </mat-nav-list>
          </div>

          <mat-accordion multi="true" displayMode="flat">
            @for (group of categoryGroups(); track group.parentId) {
            <mat-expansion-panel
              class="transparent-panel border-b border-gray-50"
              [expanded]="true"
            >
              <mat-expansion-panel-header class="h-12 hover:bg-gray-50 px-6">
                <mat-panel-title class="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  {{ group.parentName }}
                </mat-panel-title>
              </mat-expansion-panel-header>

              <mat-nav-list dense class="pt-0">
                @for (cat of group.categories; track cat.productCategoryId) {
                <a
                  mat-list-item
                  [routerLink]="['/products/category', cat.productCategoryId]"
                  routerLinkActive="bg-red-50"
                  class="sub-category-link w-full"
                >
                  <span
                    matListItemTitle
                    class="text-sm text-gray-600"
                    [class.text-red-700]="activeCategory() === cat.productCategoryId.toString()"
                  >
                    {{ cat.name }}
                  </span>
                </a>
                }
              </mat-nav-list>
            </mat-expansion-panel>
            }
          </mat-accordion>

          <div class="h-10"></div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: transparent transparent; 
      
      /* webkit (Chrome/Edge) */
      &::-webkit-scrollbar {
        width: 6px; 
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background-color: transparent;
        border-radius: 4px;
      }
    }

    .group:hover .custom-scrollbar {
      scrollbar-color: #d1d5db transparent;
      
      &::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #9ca3af;
      }
    }

    /* override background Angular Material */
    .transparent-panel {
      --mat-expansion-container-background-color: transparent;
      --mat-expansion-container-shape: 0;
      
      --mat-expansion-header-collapsed-state-background-color: transparent;
      --mat-expansion-header-expanded-state-background-color: transparent;
      --mat-expansion-header-hover-state-background-color: transparent;

      box-shadow: none !important; 
    }

    .sub-category-link {
      padding-left: 2rem !important; 
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f9fafb;
      }
      
      /* rimuove background di default del list item di Material */
      --mat-list-list-item-container-color: transparent;
      --mat-list-list-item-hover-container-color: transparent;
    }
  `],
})
export class CategorySidebarComponent implements OnInit {
  private productService = inject(ProductService);

  activeCategory = input<string>('all');
  collapsedChange = output<boolean>();

  categoryGroups = signal<CategoryGroup[]>([]);
  isCollapsed = signal(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        const categories = response.data || [];
        this.categoryGroups.set(this.groupCategoriesByParent(categories));
      },
      error: (err) => console.error('Error loading categories', err),
    });
  }

  toggleSidebar() {
    this.isCollapsed.update((val) => !val);
    this.collapsedChange.emit(this.isCollapsed());
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }

  private groupCategoriesByParent(allCategories: Category[]): CategoryGroup[] {
    const rootCategories = allCategories.filter(c => !c.parentProductCategoryId);
    const childCategories = allCategories.filter(c => !!c.parentProductCategoryId);

    return rootCategories.map((parent) => ({
      parentName: parent.name,
      parentId: parent.productCategoryId,
      categories: childCategories.filter(
        (c) => c.parentProductCategoryId === parent.productCategoryId
      ),
    }));
  }
}