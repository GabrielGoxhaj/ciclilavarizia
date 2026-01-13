import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private backendHost = environment.apiUrl.replace('/api', '');

  categories: Array<{
    productCategoryId: number | 'all';
    name: string;
    description?: string;
    image?: string;
  }> = [];

  // featured products will be loaded from backend (two random mountain bike products)
  featuredProducts: import('../../shared/models/product.model').ProductListItem[] = [];

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  private loadCategories(): void {
    const desired = [
      { key: 'bici', label: 'Bici', keywords: ['bici', 'bike', 'bikes', 'bicycle', 'bicycles'] },
      { key: 'accessori', label: 'Accessori', keywords: ['accessori', 'accessories', 'accessory'] },
      { key: 'jerseys', label: 'Jerseys', keywords: ['jersey', 'jerseys', 'maglia', 'maglie'] },
    ];

    this.productService.getCategories().subscribe({
      next: (res) => {
        const cats = res.data || [];
        const main: typeof this.categories = [];

        for (const d of desired) {
          // try to find category by keyword match (case-insensitive)
          const match = cats.find((c) => {
            const n = (c.name || '').toLowerCase();
            return d.keywords.some((kw) => n.includes(kw));
          });

          if (match) {
            main.push({
              productCategoryId: match.productCategoryId,
              name: match.name,
              description: '',
              image: undefined,
            });
          } else {
            main.push({
              productCategoryId: 'all',
              name: d.label,
              description: '',
              image: undefined,
            });
          }
        }

        this.categories = main;

        // fetch representative image for each real category
        for (const c of this.categories) {
          if (c.productCategoryId === 'all') {
            c.image = this.placeholder(c.name);
            continue;
          }

          this.productService
            .getProducts({ page: 1, pageSize: 1, categoryId: Number(c.productCategoryId) } as any)
            .subscribe({
              next: (resp) => {
                const items = resp.data || [];
                if (items.length > 0 && items[0].thumbnailUrl) {
                  c.image = this.buildFullImageUrl(items[0].thumbnailUrl);
                } else {
                  c.image = this.placeholder(c.name);
                }
              },
              error: () => {
                c.image = this.placeholder(c.name);
              },
            });
        }
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.categories = [
          { productCategoryId: 'all', name: 'Bici', image: this.placeholder('Bici') },
          { productCategoryId: 'all', name: 'Accessori', image: this.placeholder('Accessori') },
          { productCategoryId: 'all', name: 'Jerseys', image: this.placeholder('Jerseys') },
        ];
      },
    });
  }

  private buildFullImageUrl(thumbnailUrl: string): string {
    if (!thumbnailUrl) return '';
    if (thumbnailUrl.startsWith('http')) return thumbnailUrl;
    return `${this.backendHost}${thumbnailUrl}`;
  }

  placeholder(name: string): string {
    return `https://via.placeholder.com/300x200?text=${encodeURIComponent(name)}`;
  }

  private loadFeaturedProducts(): void {
    // try various search keywords for mountain bikes
    const queries = ['mountain', 'mtb', 'trail', 'enduro', 'cross-country'];
    const fetchPromises: Promise<import('../../shared/models/product.model').ProductListItem[]>[] =
      [];

    // We'll use the observable but convert to Promise for simpler aggregation
    for (const q of queries) {
      fetchPromises.push(
        firstValueFrom(this.productService.getProducts({ page: 1, pageSize: 30, search: q } as any))
          .then((r) => r.data || [])
          .catch(() => [])
      );
    }

    Promise.all(fetchPromises)
      .then((results) => {
        // flatten and deduplicate by productId
        const poolMap = new Map<
          number,
          import('../../shared/models/product.model').ProductListItem
        >();
        for (const list of results) {
          for (const p of list) {
            poolMap.set(p.productId, p);
          }
        }

        const pool = Array.from(poolMap.values());

        if (pool.length < 2) {
          // fallback: fetch any products
          this.productService.getProducts({ page: 1, pageSize: 10 } as any).subscribe({
            next: (r) => {
              const all = r.data || [];
              this.featuredProducts = this.pickRandom(all, 2);
            },
            error: () => {
              this.featuredProducts = [];
            },
          });
          return;
        }

        this.featuredProducts = this.pickRandom(pool, 2);
      })
      .catch(() => {
        this.featuredProducts = [];
      });
  }

  private pickRandom<T>(arr: T[], count: number): T[] {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
}
