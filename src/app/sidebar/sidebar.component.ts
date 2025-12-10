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
export class SidebarComponent {
  constructor( private route: ActivatedRoute) {}

  // Method to get only the committeeId query parameter and ignoring other query parameters if any
  getCommitteeQueryParams(): { [key: string]: any } {
    const currentParams = this.route.snapshot.queryParams;
    return currentParams['committeeId']
      ? { committeeId: currentParams['committeeId'] }
      : {};
  }
}
