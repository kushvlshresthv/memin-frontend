import { Component, input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-minute-view',
  standalone: true,
  imports: [],
  templateUrl: './minute-view.component.html',
  styleUrl: './minute-view.component.scss'
})
export class MinuteViewComponent {
  htmlContent =  input.required<SafeHtml>();
}
