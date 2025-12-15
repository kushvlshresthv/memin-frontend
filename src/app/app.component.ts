import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './service/auth.service';
import { PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent /*DemoComponent*/, PopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.loggedIn$.subscribe(value=> this.isLoggedIn = value)
  }
}
