import { Component } from '@angular/core';
import { GlobalSearchComponent } from './global-search/global-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showGlobalSearchDialog = false;
}
