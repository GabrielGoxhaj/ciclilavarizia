import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderActionsComponent } from '../header-actions/header-actions'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, HeaderActionsComponent],
  templateUrl: './header.html',
  styleUrl: './header.css' 
})
export class HeaderComponent {}