import { Component, input } from '@angular/core';
import { MeetingSummaryComponent } from './meeting-summary/meeting-summary.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, RouterOutlet, RouterLink } from '@angular/router';
import { BACKEND_URL } from '../../../../global_constants';
import { MeetingSummaryDto, CommitteeDetailsDto } from '../../../models/models';
import { Response } from '../../../response/response';

@Component({
  selector: 'app-meeting-summaries',
  standalone: true,
  imports: [MeetingSummaryComponent, RouterOutlet, RouterLink],
  templateUrl: './meeting-summaries.component.html',
  styleUrl: './meeting-summaries.component.scss'
})
export class MeetingSummariesComponent {
  meetingSummaries = input.required<MeetingSummaryDto[]>();
}
