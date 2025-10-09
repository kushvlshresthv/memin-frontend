import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  state: "main-menu" | "committee-menu" | "login" = "main-menu";
  constructor(private router: Router) {

  }

  ngOnInit():void {
    this.router.events.pipe(filter(
      event => event instanceof NavigationEnd
    )).subscribe((event: NavigationEnd) => {
      if(event.urlAfterRedirects.startsWith('/committee')) {
        this.state = "committee-menu";
      }
      else if(event.urlAfterRedirects === '/login') {
        this.state = "login";
      }
      else if(event.urlAfterRedirects === '/' || event.urlAfterRedirects.startsWith('/home')) {
        this.state = "main-menu";
      }
      else {
        this.state = "main-menu";  //default
      }
    });
  }
}
