import { Component, input } from '@angular/core';
import { MeetingSummaryDto } from '../../../../models/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-meeting-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './meeting-summary.component.html',
  styleUrl: './meeting-summary.component.scss'
})
export class MeetingSummaryComponent {
  meetingSummary = input.required<MeetingSummaryDto>();
}
