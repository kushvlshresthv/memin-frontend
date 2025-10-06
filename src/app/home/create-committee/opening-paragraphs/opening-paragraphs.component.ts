import { Component, input } from '@angular/core';
import { OpeningParagraphComponent } from './opening-paragraph/opening-paragraph.component';

@Component({
  selector: 'app-opening-paragraphs',
  standalone: true,
  imports: [OpeningParagraphComponent],
  templateUrl: './opening-paragraphs.component.html',
  styleUrl: './opening-paragraphs.component.scss'
})
export class OpeningParagraphsComponent {
  openingParagraphs = input.required<string[]>();
}
