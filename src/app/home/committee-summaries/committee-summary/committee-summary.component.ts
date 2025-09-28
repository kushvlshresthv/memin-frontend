import { Component, Input } from '@angular/core';
import { CommitteeSummary } from './committee-summary.model';
import { DatePipe } from '@angular/common';
import { RecognizeNepaliTextDirective } from '../../../utils/recognize-nepali-text.directive';

@Component({
  selector: 'app-committee-summary',
  standalone: true,
  imports: [DatePipe, RecognizeNepaliTextDirective],
  templateUrl: './committee-summary.component.html',
  styleUrl: './committee-summary.component.scss',
})
export class CommitteeSummaryComponent {
  @Input({ required: true }) committeeSummary!: CommitteeSummary;
}
