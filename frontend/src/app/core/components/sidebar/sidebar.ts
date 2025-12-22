import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Material
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip'; // <--- Importato Tooltip Material

// Models & Services
import { ProductService } from '../../../shared/services/product.service';
import { Category } from '../../../shared/models/product.model';

// Interfaccia locale per la visualizzazione raggruppata
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
    MatTooltipModule, // <--- Aggiunto agli imports
  ],
  template: `
    <!-- Toggle Button -->

    <!-- Toggle Button -->
    <!-- Nota: Ho aggiunto '!' davanti alle classi per sovrascrivere qualsiasi stile globale -->
    <button
      (click)="toggleSidebar()"
      type="button"
      class="absolute top-6 -right-4 z-50 
             !bg-white !border !border-gray-200 !shadow-md 
             !w-8 !h-8 !rounded-full !p-0
             flex items-center justify-center 
             cursor-pointer hover:!bg-gray-50 transition-transform hover:scale-110
             focus:outline-none"
      [matTooltip]="isCollapsed() ? 'Espandi categorie' : 'Comprimi categorie'"
      matTooltipPosition="right"
    >
      <!-- Icona -->
      <mat-icon
        class="!w-5 !h-5 !text-[20px] !text-gray-600 flex items-center justify-center leading-none"
      >
        {{ isCollapsed() ? 'chevron_right' : 'chevron_left' }}
      </mat-icon>
    </button>

    @if(!isCollapsed()){
    <div class="bg-white pb-10">
      <!-- Header Categorie -->
      <div class="p-6 border-b border-gray-100 h-20 flex items-center">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <mat-icon class="text-red-600">category</mat-icon>
          Categories
        </h2>
      </div>

      <!-- Lista Categorie -->
      <div class="flex-1 overflow-y-auto hover-scrollbar py-2 pb-10">
        <!-- Link "Tutti i prodotti" -->
        <div class="px-5 mb-1">
          <mat-nav-list class="!pt-0 !pb-0">
            <a
              mat-list-item
              [routerLink]="['/products/category/all']"
              routerLinkActive="bg-red-50"
              [class.bg-red-50]="activeCategory() === 'all'"
              class="!rounded-md !h-10 flex items-center hover:bg-gray-50 transition-colors"
            >
              <span
                matListItemTitle
                class="font-medium transition-colors !ml-6"
                [class.text-red-700]="activeCategory() === 'all'"
              >
                All Products
              </span>
            </a>
          </mat-nav-list>
        </div>

        <!-- Accordion Gruppi -->
        <mat-accordion multi="true" displayMode="flat">
          @for (group of categoryGroups(); track group.parentId) {
          <mat-expansion-panel
            class="!rounded-none !shadow-none border-b border-gray-50 bg-transparent"
            [expanded]="true"
          >
            <mat-expansion-panel-header class="h-12 hover:bg-gray-50 px-6">
              <mat-panel-title class="text-sm font-bold text-gray-700 uppercase tracking-wide">
                {{ group.parentName }}
              </mat-panel-title>
            </mat-expansion-panel-header>

            <mat-nav-list dense class="!pt-0">
              @for (cat of group.categories; track cat.productCategoryId) {
              <a
                mat-list-item
                [routerLink]="['/products/category', cat.productCategoryId]"
                routerLinkActive="bg-red-50"
                class="!pl-8 transition-colors hover:bg-gray-50"
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
      </div>
    </div>
    }
  `,
  styles: [],
})
export class CategorySidebarComponent implements OnInit {
  private productService = inject(ProductService);

  activeCategory = input<string>('all');
  collapsedChange = output<boolean>();

  // Utilizziamo l'interfaccia locale CategoryGroup per il rendering
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

  // Logica corretta basata sugli ID del modello fornito
  private groupCategoriesByParent(allCategories: Category[]): CategoryGroup[] {
    // 1. Trova le categorie "padre" (quelle che hanno parentProductCategoryId null)
    // Se il tuo DB non usa null per i root, adatta questa condizione (es. parentProductCategoryId === undefined)
    const rootCategories = allCategories.filter(
      (c) => c.parentProductCategoryId === null || c.parentProductCategoryId === undefined
    );

    // 2. Trova le categorie "figlie" (tutte le altre)
    const childCategories = allCategories.filter(
      (c) => c.parentProductCategoryId !== null && c.parentProductCategoryId !== undefined
    );

    // 3. Mappa i genitori ai loro figli
    const groups: CategoryGroup[] = rootCategories.map((parent) => {
      return {
        parentName: parent.name,
        parentId: parent.productCategoryId,
        categories: childCategories.filter(
          (c) => c.parentProductCategoryId === parent.productCategoryId
        ),
      };
    });

    // Opzionale: Se vuoi mostrare solo gruppi che hanno effettivamente prodotti o sottocategorie
    // return groups.filter(g => g.categories.length > 0);
    return groups;
  }
}
