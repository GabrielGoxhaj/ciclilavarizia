import { Component, inject, input, output, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../shared/services/product.service';
import { Category, ProductFilter } from '../../../shared/models/product.model';

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
    ReactiveFormsModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatButtonModule,
  ],
  template: `
    <div class="h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300">
      <!-- header sidebar -->
      <div
        class="flex items-center shrink-0 border-b border-gray-100 h-16 transition-all duration-300"
        [class.justify-between]="!isCollapsed()"
        [class.px-4]="!isCollapsed()"
        [class.justify-center]="isCollapsed()"
        [class.px-0]="isCollapsed()"
      >
        @if(!isCollapsed()){
        <h2
          class="text-xl font-bold text-gray-800 flex items-center gap-2 overflow-hidden whitespace-nowrap"
        >
          <mat-icon class="text-red-600">filter_list</mat-icon>
          Filtri & Categorie
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

      <!-- sidebar content -->
      @if(!isCollapsed()){
      <div class="flex-1 overflow-hidden w-full relative group">
        <div class="h-full overflow-y-auto overflow-x-hidden custom-scrollbar px-5 py-4">
          <!-- filter section -->
          <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
            <!-- search -->
            <mat-form-field appearance="outline" class="w-full dense-form-field">
              <mat-label>Cerca prodotto...</mat-label>
              <input matInput formControlName="search" placeholder="Es. Mountain Bike" />
              <mat-icon matSuffix class="text-gray-400">search</mat-icon>
            </mat-form-field>

            <div class="mb-6 mt-2">
              <div class="flex justify-between text-xs text-gray-500 mb-2">
                <span>Prezzo</span>
                <span
                  >{{ filterForm.get('minPrice')?.value | currency : 'EUR' : 'symbol' : '1.0-0' }} -
                  {{
                    filterForm.get('maxPrice')?.value | currency : 'EUR' : 'symbol' : '1.0-0'
                  }}</span
                >
              </div>
              <mat-slider
                min="0"
                max="3500"
                step="50"
                showTickMarks
                discrete
                [displayWith]="formatLabel"
                class="w-full!"
              >
                <input matSliderStartThumb formControlName="minPrice" />
                <input matSliderEndThumb formControlName="maxPrice" />
              </mat-slider>
            </div>

            <!-- color/size -->
            <div class="flex gap-2 mb-4">
              <mat-form-field appearance="outline" class="w-1/2 dense-form-field">
                <mat-label>Colore</mat-label>
                <input matInput formControlName="color" placeholder="Es. Red" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-1/2 dense-form-field">
                <mat-label>Taglia</mat-label>
                <input matInput formControlName="size" placeholder="Es. XL" />
              </mat-form-field>
            </div>

            <!-- action buttons -->
            <div class="flex gap-2 mb-6 border-b border-gray-100 pb-6">
              <button mat-stroked-button type="button" class="flex-1" (click)="resetFilters()">
                Reset
              </button>
              <button mat-flat-button color="primary" type="submit" class="flex-1">Applica</button>
            </div>
          </form>

          <!-- categories -->
          <h3 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Categorie</h3>

          <mat-nav-list class="pt-0 pb-0 -mx-4">
            <a
              mat-list-item
              [routerLink]="['/products/category/all']"
              routerLinkActive="bg-red-50"
              [class.bg-red-50]="activeCategory() === 'all'"
              class="w-full"
            >
              <span
                matListItemTitle
                class="font-medium ml-2"
                [class.text-red-700]="activeCategory() === 'all'"
              >
                All Products
              </span>
            </a>
          </mat-nav-list>

          <mat-accordion multi="true" displayMode="flat" class="-mx-4 block">
            @for (group of categoryGroups(); track group.parentId) {
            <mat-expansion-panel
              class="transparent-panel border-b border-gray-50"
              [expanded]="true"
            >
              <mat-expansion-panel-header class="h-12 hover:bg-gray-50 px-4">
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
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }
      .group:hover .custom-scrollbar {
        scrollbar-color: #d1d5db transparent;
      }
      .transparent-panel {
        box-shadow: none !important;
      }
      .sub-category-link {
        padding-left: 1.5rem !important;
        transition: background-color 0.2s;
        --mat-list-list-item-container-color: transparent;
      }

      ::ng-deep .dense-form-field .mat-mdc-form-field-flex {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        height: 48px;
        align-items: center;
      }
      ::ng-deep .dense-form-field .mat-mdc-text-field-wrapper {
        height: 48px;
      }
    `,
  ],
})
export class CategorySidebarComponent implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  activeCategory = input<string>('all');

  currentFilters = input<Partial<ProductFilter>>({});

  collapsedChange = output<boolean>();
  filterChange = output<Partial<ProductFilter>>();

  categoryGroups = signal<CategoryGroup[]>([]);
  isCollapsed = signal(false);

  filterForm = this.fb.group({
    search: [''],
    minPrice: [0],
    maxPrice: [3500],
    color: [''],
    size: [''],
  });

  constructor() {
    // sync form values with external filters when father remove chips
    effect(() => {
      const externalFilters = this.currentFilters();
      if (externalFilters) {
        this.filterForm.patchValue(
          {
            search: externalFilters.search || '',
            minPrice: externalFilters.minPrice ?? 0,
            maxPrice: externalFilters.maxPrice ?? 3500,
            color: externalFilters.color || '',
            size: externalFilters.size || '',
          },
          { emitEvent: false }
        );
      }
    });
  }

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

  applyFilters() {
    const val = this.filterForm.value;
    const search = val.search?.trim() || undefined;
    const color = val.color?.trim() || undefined;
    const size = val.size?.trim() || undefined;

    this.filterChange.emit({
      search,
      minPrice: val.minPrice || undefined,
      maxPrice: val.maxPrice === 3500 ? undefined : val.maxPrice || undefined,
      color,
      size,
    });
  }

  resetFilters() {
    this.filterForm.patchValue({
      search: '',
      minPrice: 0,
      maxPrice: 3500,
      color: '',
      size: '',
    });
    this.applyFilters();
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return `${value}`;
  }

  private groupCategoriesByParent(allCategories: Category[]): CategoryGroup[] {
    const rootCategories = allCategories.filter((c) => !c.parentProductCategoryId);
    const childCategories = allCategories.filter((c) => !!c.parentProductCategoryId);

    return rootCategories.map((parent) => ({
      parentName: parent.name,
      parentId: parent.productCategoryId,
      categories: childCategories.filter(
        (c) => c.parentProductCategoryId === parent.productCategoryId
      ),
    }));
  }
}
