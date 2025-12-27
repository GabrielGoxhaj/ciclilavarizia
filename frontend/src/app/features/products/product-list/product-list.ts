import {
  Component,
  inject,
  input,
  effect,
  signal,
  computed,
  untracked,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { CategorySidebarComponent } from '../../../core/components/sidebar/sidebar';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Paginator, PaginatorState } from '../../../shared/components/paginator/paginator';
import { ProductService } from '../../../shared/services/product.service';
import { ProductListItem, ProductFilter } from '../../../shared/models/product.model';

interface FilterChip {
  key: keyof ProductFilter;
  label: string;
  value: any;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    CategorySidebarComponent,
    ProductCard,
    Paginator,
  ],
  templateUrl: './product-list.html',
  styles: [
    `
      .controls-wrapper {
        display: flex;
        gap: 12px;
        align-items: center;
        height: 48px;
      }

      ::ng-deep .dense-select .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
      ::ng-deep .dense-select .mat-mdc-text-field-wrapper {
        height: 42px;
        padding-top: 0;
        padding-bottom: 0;
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export default class ProductListComponent {
  private productService = inject(ProductService);
  private router = inject(Router);

  productCategoryId = input<string>();

  categoryName = signal<string>('');
  currentCategoryValue = computed(() => this.productCategoryId() || 'all');
  viewMode = signal<'grid' | 'list'>('grid');
  isSidebarCollapsed = signal(false);
  isLoading = signal(true);

  // products data
  products = signal<ProductListItem[]>([]);
  totalItems = signal(0);

  // filter state
  pageSize = signal(20);
  currentPage = signal(1);
  currentSort = signal<string>('name_asc');

  // current applied filters
  currentFilters = signal<Partial<ProductFilter>>({});

  activeFiltersCount = computed(() => {
    const f = this.currentFilters();
    let count = 0;
    if (f.search) count++;
    if (f.minPrice && f.minPrice > 0) count++;
    if (f.maxPrice && f.maxPrice < 3500) count++;
    if (f.color) count++;
    if (f.size) count++;
    return count;
  });

  constructor() {
    effect(() => {
      const catId = this.productCategoryId();
      untracked(() => { // cambia categoria, resetta filtri e pagina
        this.currentFilters.set({});
        this.currentPage.set(1);
        this.loadProducts();
        this.resolveCategoryName();
      });
    });
  }

  resolveCategoryName(): void {
    const val = this.currentCategoryValue();
    if (val === 'all') {
      this.categoryName.set('All Products');
      return;
    }
    this.productService.getCategories().subscribe({
      next: (res) => {
        const categories = res.data || [];
        const found = categories.find((c) => c.productCategoryId.toString() === val);
        this.categoryName.set(found ? found.name : 'Category Products');
      },
      error: () => this.categoryName.set('Category Products'),
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const catValue = this.currentCategoryValue();
    const isNumericCat = !isNaN(Number(catValue));

    const filters = this.currentFilters();

    const requestFilter: ProductFilter = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      categoryId: isNumericCat ? Number(catValue) : undefined,
      sort: this.currentSort(),
      ...filters, // Spread operator per aggiungere search, price, color, size
    };

    this.productService.getProducts(requestFilter).subscribe({
      next: (response) => {
        this.products.set(response.data || []);
        if (response.pagination) {
          this.totalItems.set(response.pagination.totalItems);
        } else {
          this.totalItems.set(response.data?.length || 0);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.products.set([]);
        this.totalItems.set(0);
        this.isLoading.set(false);
      },
    });
  }

  onFilterChange(newFilters: Partial<ProductFilter>) {
    this.currentFilters.set(newFilters);
    this.currentPage.set(1); 
    this.loadProducts();
  }

  onSortChange(sortValue: string) {
    this.currentSort.set(sortValue);
    this.loadProducts();
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed.set(collapsed);
  }

  resetAll() {
    // ricarica tutto e resetta grazie all'effect
    this.router.navigate(['/products/category', this.currentCategoryValue()]);
  }

  activeFiltersList = computed<FilterChip[]>(() => {
    const f = this.currentFilters();
    const chips: FilterChip[] = [];

    if (f.search) {
      chips.push({ key: 'search', label: `Cerca: "${f.search}"`, value: f.search });
    }
    if (f.minPrice && f.minPrice > 0) {
      chips.push({ key: 'minPrice', label: `Min: €${f.minPrice}`, value: f.minPrice });
    }
    if (f.maxPrice && f.maxPrice < 3500) {
      chips.push({ key: 'maxPrice', label: `Max: €${f.maxPrice}`, value: f.maxPrice });
    }
    if (f.color) {
      chips.push({ key: 'color', label: `Colore: ${f.color}`, value: f.color });
    }
    if (f.size) {
      chips.push({ key: 'size', label: `Taglia: ${f.size}`, value: f.size });
    }

    return chips;
  });

  // for removing single filter chip
  removeFilter(chip: FilterChip) {
    const current = { ...this.currentFilters() };

    delete current[chip.key];

    if (chip.key === 'minPrice') current.minPrice = undefined;
    if (chip.key === 'maxPrice') current.maxPrice = undefined; 

    this.onFilterChange(current);
  }
}
