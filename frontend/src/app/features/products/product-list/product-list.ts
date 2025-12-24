import { Component, inject, input, effect, signal, computed, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategorySidebarComponent } from '../../../core/components/sidebar/sidebar';
import { ProductCard } from '../../../shared/components/product-card/product-card'; 
import { Paginator, PaginatorState } from '../../../shared/components/paginator/paginator'; 
import { ProductService } from '../../../shared/services/product.service';
import { ProductListItem, ProductFilter } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    CategorySidebarComponent,
    ProductCard,
    Paginator,
    RouterLink,
  ],
  templateUrl: './product-list.html',
})
export default class ProductListComponent {
  private productService = inject(ProductService);
  productCategoryId = input<string>();
  categoryName = signal<string>('');
  currentCategoryValue = computed(() => this.productCategoryId() || 'all');

  products = signal<ProductListItem[]>([]);
  totalItems = signal(0);
  isLoading = signal(true);

  pageSize = signal(20);
  currentPage = signal(1);

  isSidebarCollapsed = signal(false);

  constructor() {
    effect(() => {
      const catId = this.productCategoryId(); 
      untracked(() => {
        this.currentPage.set(1); // reset pagina
        this.loadProducts();
        this.resolveCategoryName();
      });
    });
  }

   // funzione per trovare il nome della categoria
  resolveCategoryName(): void {
    const val = this.currentCategoryValue();
    
    if (val === 'all') {
        this.categoryName.set('All Products');
        return;
    }

    this.productService.getCategories().subscribe({
        next: (res) => {
            const categories = res.data || [];
            const found = categories.find(c => c.productCategoryId.toString() === val);
            if (found) {
                this.categoryName.set(found.name);
            } else {
                this.categoryName.set('Category Products'); // fallback se non trovato
            }
        },
        error: () => this.categoryName.set('Category Products')
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const catValue = this.currentCategoryValue();
    const isNumericCat = !isNaN(Number(catValue));
    const filter: ProductFilter = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      categoryId: isNumericCat ? Number(catValue) : undefined,
      // search: '', // TODO: logica ricerca se vuoi
      // sort: 'name' // Default sort
    };

    this.productService.getProducts(filter).subscribe({
      next: (response) => {
        this.products.set(response.data || []);
        if (response.pagination) {
          this.totalItems.set(response.pagination.totalItems);
        } else {
          this.totalItems.set(response.data?.length || 0); // fallback, se manca pagination
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

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();

    document.querySelector('mat-sidenav-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed.set(collapsed);
  }
}
