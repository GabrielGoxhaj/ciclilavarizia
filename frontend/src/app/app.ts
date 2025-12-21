import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  HeaderComponent } from './core/components/header/header';
import { Footer } from './core/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('Cicli L Avarizia');
}
