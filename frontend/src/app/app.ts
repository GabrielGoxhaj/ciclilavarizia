import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './core/components/header/header';
import { Footer } from './core/components/footer/footer';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, HeaderComponent, Toast],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Cicli L Avarizia');

  constructor(router: Router) {
    // Scroll handling: when navigation finishes without a saved position or anchor,
    // force scroll to top (avoids partial shifts when components render lazily)
    router.events.pipe(filter((e): e is Scroll => e instanceof Scroll)).subscribe((e) => {
      // if position exists (popstate) -> let router restore
      if (e.position) return;
      // if anchor -> let router handle anchor scrolling
      if (e.anchor) return;
      // otherwise, perform a robust scroll-to-top with retries and blur
      const doScroll = () => {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        } catch (err) {}
        try {
          document.documentElement.scrollTop = 0;
        } catch (err) {}
        try {
          (document.scrollingElement || document.body).scrollTop = 0;
        } catch (err) {}
      };

      // Remove accidental focus that may pull viewport
      try {
        const active = document.activeElement as HTMLElement | null;
        if (active && typeof active.blur === 'function') active.blur();
      } catch (err) {}

      // Run immediate and scheduled attempts (covers lazy rendering and microtask timing)
      doScroll();
      requestAnimationFrame(() => {
        doScroll();
        requestAnimationFrame(doScroll);
      });
      setTimeout(doScroll, 50);
      setTimeout(doScroll, 150);
      setTimeout(doScroll, 300);
    });
  }
}
