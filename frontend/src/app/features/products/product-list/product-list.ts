import { Component, inject, input, effect, signal, computed, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Components
import { CategorySidebarComponent } from '../../../core/components/sidebar/sidebar';
import { ProductCard } from '../../../shared/components/product-card/product-card'; // Assicurati il percorso
import { Paginator, PaginatorState } from '../../../shared/components/paginator/paginator'; // Assicurati il percorso

// Services & Models
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
  // Se non usi SCSS specifico, puoi rimuovere styleUrl o lasciarlo vuoto
})
export default class ProductListComponent {
  private productService = inject(ProductService);

  // Input da URL (es: /products/category/:categoryId)
  productCategoryId = input<string>();
  categoryName = signal<string>('');
  // Calcolo valore categoria corrente (default 'all')
  currentCategoryValue = computed(() => this.productCategoryId() || 'all');

  // Stato Prodotti
  products = signal<ProductListItem[]>([]);
  totalItems = signal(0);
  isLoading = signal(true);

  // Stato Paginazione
  pageSize = signal(20);
  currentPage = signal(1);

  // Stato Sidebar
  isSidebarCollapsed = signal(false);

  constructor() {
    // Effetto: Quando cambia la categoria nell'URL, ricarica i prodotti
    effect(() => {
      const catId = this.productCategoryId(); // Dipendenza

      // Untracked per evitare loop se loadProducts modifica altri signal tracciati qui (raro ma possibile)
      untracked(() => {
        this.currentPage.set(1); // Reset pagina
        this.loadProducts();
        this.resolveCategoryName(); // <--- NUOVA CHIAMATA
      });
    });
  }

   // Nuova funzione per trovare il nome della categoria
  resolveCategoryName(): void {
    const val = this.currentCategoryValue();
    
    if (val === 'all') {
        this.categoryName.set('All Products');
        return;
    }

    // Se abbiamo un ID, scarichiamo le categorie per trovare il nome
    // (Nota: in un'app reale potresti avere un endpoint getCategoryById o una cache)
    this.productService.getCategories().subscribe({
        next: (res) => {
            const categories = res.data || [];
            const found = categories.find(c => c.productCategoryId.toString() === val);
            
            if (found) {
                this.categoryName.set(found.name);
            } else {
                this.categoryName.set('Category Products'); // Fallback se non trovato
            }
        },
        error: () => this.categoryName.set('Category Products')
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);

    const catValue = this.currentCategoryValue();
    const isNumericCat = !isNaN(Number(catValue));

    // Costruzione del Filtro secondo il tuo Service
    const filter: ProductFilter = {
      page: this.currentPage(),
      pageSize: this.pageSize(),
      // Se è 'all' o non numerico, mandiamo undefined per categoryId
      categoryId: isNumericCat ? Number(catValue) : undefined,
      // search: '', // Aggiungi logica ricerca se vuoi
      // sort: 'name' // Default sort
    };

    this.productService.getProducts(filter).subscribe({
      next: (response) => {
        // 1. Assegna l'array dei prodotti (response.data)
        this.products.set(response.data || []);

        // 2. Assegna il numero totale items
        // Se c'è l'oggetto pagination usa quello, altrimenti usa la lunghezza dell'array (fallback)
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

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();

    // Scroll to top
    document.querySelector('mat-sidenav-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed.set(collapsed);
  }
}
