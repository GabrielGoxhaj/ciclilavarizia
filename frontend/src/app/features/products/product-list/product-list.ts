import {
  Component,
  inject,
  input,
  effect,
  signal,
  computed,
  untracked,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
export default class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productCategoryId = input<string>();
  categoryName = signal<string>('');
  currentCategoryValue = computed(() => this.productCategoryId() || 'all');
  viewMode = signal<'grid' | 'list'>(this.getSavedViewMode());
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

  private readonly VAT_RATE = 1.22; // 22% IVA

  activeFiltersCount = computed(() => {
    const f = this.currentFilters();
    let count = 0;
    if (f.search) count++;
    if (f.minPrice && f.minPrice > 0) count++;
    if (f.maxPrice && f.maxPrice < 4500) count++;
    if (f.color) count++;
    if (f.size) count++;
    return count;
  });

  constructor() {
    effect(() => {
      const catId = this.productCategoryId(); // quando cambia la categoria
      untracked(() => {
        this.resolveCategoryName();
        //this.currentPage.set(1);
        this.loadProducts();
      });
    });

    effect(() => {
      const mode = this.viewMode();
      localStorage.setItem('shop_view_mode', mode);
    });
  }
  ngOnInit(): void {
    // filters from query params
    this.route.queryParams.subscribe((params) => {
      this.parseParams(params);
      this.loadProducts();
    });
  }

  // legge i parametri dall'URL e aggiorna i Signal locali
  private parseParams(params: Params) {
    const filters: Partial<ProductFilter> = {};

    if (params['search']) filters.search = params['search'];
    if (params['minPrice']) filters.minPrice = Number(params['minPrice']);
    if (params['maxPrice']) filters.maxPrice = Number(params['maxPrice']);
    if (params['color']) filters.color = params['color'];
    if (params['size']) filters.size = params['size'];

    // aggiorna paginazione e ordinamento se presenti nell'URL
    this.currentPage.set(Number(params['page']) || 1); 
    this.currentSort.set(params['sort'] || 'name_asc');
    if (params['pageSize']) this.pageSize.set(Number(params['pageSize']));

    this.currentFilters.set(filters);
  }

  private updateUrl(filters: Partial<ProductFilter>, page: number, sort: string, pageSize: number) {
    const queryParams: Params = {
      search: filters.search || null,
      minPrice: filters.minPrice && filters.minPrice > 0 ? filters.minPrice : null,
      maxPrice: filters.maxPrice && filters.maxPrice < 4500 ? filters.maxPrice : null,
      color: filters.color || null,
      size: filters.size || null,
      page: page > 1 ? page : null, // nascondi page=1
      sort: sort !== 'name_asc' ? sort : null, // nascondi sort default
      pageSize: pageSize !== 20 ? pageSize : null, 
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // mantiene altri parametri non sovrascritti
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

    // conversione prezzi da lordo a netto per backend
    const minPriceNet = filters.minPrice ? filters.minPrice / this.VAT_RATE : undefined;
    const maxPriceNet = filters.maxPrice ? filters.maxPrice / this.VAT_RATE : undefined;

    const requestFilter: ProductFilter = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      categoryId: isNumericCat ? Number(catValue) : undefined,
      sort: this.currentSort(),
      ...filters, // spread operator per copiare gli altri filtri (search, color...)
      minPrice: minPriceNet,
      maxPrice: maxPriceNet,
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
    this.updateUrl(newFilters, 1, this.currentSort(), this.pageSize());
  }

  onSortChange(sortValue: string) {
    this.updateUrl(this.currentFilters(), 1, sortValue, this.pageSize());
  }

  onPageChange(event: PaginatorState): void {
    this.updateUrl(this.currentFilters(), event.pageIndex, this.currentSort(), event.pageSize);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed.set(collapsed);
  }

  resetAll() {
    // naviga pulendo i query params
    this.router.navigate(['/products/category', this.currentCategoryValue()], { queryParams: {} });
  }

  activeFiltersList = computed<FilterChip[]>(() => {
    const f = this.currentFilters();
    const chips: FilterChip[] = [];
    if (this.currentCategoryValue() !== 'all') {
      chips.push({
        key: 'category' as any,
        label: `Categoria: ${this.categoryName()}`,
        value: this.currentCategoryValue(),
      });
    }
    if (f.search) chips.push({ key: 'search', label: `Cerca: "${f.search}"`, value: f.search });
    if (f.minPrice && f.minPrice > 0)
      chips.push({ key: 'minPrice', label: `Min: €${f.minPrice}`, value: f.minPrice });
    if (f.maxPrice && f.maxPrice < 4500)
      chips.push({ key: 'maxPrice', label: `Max: €${f.maxPrice}`, value: f.maxPrice });
    if (f.color) chips.push({ key: 'color', label: `Colore: ${f.color}`, value: f.color });
    if (f.size) chips.push({ key: 'size', label: `Taglia: ${f.size}`, value: f.size });

    return chips;
  });

  // for removing single filter chip
  removeFilter(chip: FilterChip) {
    if (chip.key === ('category' as any)) {
      this.router.navigate(['/products/category/all'], { queryParamsHandling: 'preserve' });
      return;
    }

    const current = { ...this.currentFilters() };
    delete current[chip.key];

    if (chip.key === 'minPrice') current.minPrice = undefined;
    if (chip.key === 'maxPrice') current.maxPrice = undefined;

    // chiama updateUrl invece di loadProducts diretto
    this.onFilterChange(current);
  }

  private getSavedViewMode(): 'grid' | 'list' {
    const saved = localStorage.getItem('shop_view_mode');
    return saved === 'grid' || saved === 'list' ? saved : 'grid';
  }
}
