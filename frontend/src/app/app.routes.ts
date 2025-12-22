import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent) },
  { path: 'products', redirectTo: 'products/category/all', pathMatch: 'full' },
  {
    path: 'products/category/:productCategoryId',
    loadComponent: () => import('./features/products/product-list/product-list'),
  },
  {
    path: 'products/:productId',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail').then(
        (m) => m.ProductDetailComponent
      ),
  },
    {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/sign-up/sign-up').then(
        (m) => m.SignUpComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/my-cart/my-cart'), // o MyCartComponent
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactComponent),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms').then((m) => m.TermsComponent),
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/cookies/cookies').then((m) => m.CookiesComponent),
  },
  {
    path: 'disclaimer',
    loadComponent: () => import('./pages/disclaimer/disclaimer').then((m) => m.DisclaimerComponent),
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help').then((m) => m.HelpComponent),
  },
  {
    path: 'shipping',
    loadComponent: () => import('./pages/shipping/shipping').then((m) => m.ShippingComponent),
  },
  {
    path: 'returns',
    loadComponent: () => import('./pages/returns/returns').then((m) => m.ReturnsComponent),
  },
  {
    path: 'warranty',
    loadComponent: () => import('./pages/warranty/warranty').then((m) => m.WarrantyComponent),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq').then((m) => m.FaqComponent),
  },
  {
    path: 'careers',
    loadComponent: () => import('./pages/careers/careers').then((m) => m.CareersComponent),
  },
  { path: '**', redirectTo: '/products' },
];
