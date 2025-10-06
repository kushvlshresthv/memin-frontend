import { Component, input } from '@angular/core';
import { MeetingSummaryDto } from '../../../models/models';
import { MeetingSummaryComponent } from './meeting-summary/meeting-summary.component';

@Component({
  selector: 'app-meeting-summaries',
  standalone: true,
  imports: [MeetingSummaryComponent],
  templateUrl: './meeting-summaries.component.html',
  styleUrl: './meeting-summaries.component.scss'
})
export class MeetingSummariesComponent {
  meetingSummaries = input.required<MeetingSummaryDto[]>();
}
