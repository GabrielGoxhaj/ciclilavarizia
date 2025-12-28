import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
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
    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const doScroll = () => {
          // Scroll Window/Body (Standard)
          try {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          } catch (err) {}

          try {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          } catch (err) {}

          // Scroll Angular Material Sidenav (Se presente)
          try {
            const matContent = document.querySelector('.mat-drawer-content');
            if (matContent) {
              matContent.scrollTop = 0;
            }
          } catch (err) {}

          // Scroll Main (sicurezza)
          try {
            const main = document.querySelector('main');
            if (main) main.scrollTop = 0;
          } catch (err) {}
        };

        try {
          const active = document.activeElement as HTMLElement | null;
          if (active && typeof active.blur === 'function') active.blur();
        } catch (err) {}

        doScroll();

        setTimeout(doScroll, 10);
        setTimeout(doScroll, 100);
        setTimeout(doScroll, 300);
        setTimeout(doScroll, 500);
      });
  }
}
