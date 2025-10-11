import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  ActivatedRoute,
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  subheading: 'main-menu' | 'committee-menu' | 'login' = 'main-menu';
  constructor(private router: Router, private route: ActivatedRoute) {}

  // Method to get only the committeeId query parameter and ignoring other query parameters if any
  getCommitteeQueryParams(): { [key: string]: any } {
    const currentParams = this.route.snapshot.queryParams;
    return currentParams['committeeId']
      ? { committeeId: currentParams['committeeId'] }
      : {};
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects.startsWith('/committee-details')) {
          this.subheading = 'committee-menu';
        } else if (event.urlAfterRedirects === '/login') {
          this.subheading = 'login';
        } else if (
          event.urlAfterRedirects === '/' ||
          event.urlAfterRedirects.startsWith('/home')
        ) {
          this.subheading = 'main-menu';
        } else {
          this.subheading = 'main-menu'; //default
        }
      });
  }
}
