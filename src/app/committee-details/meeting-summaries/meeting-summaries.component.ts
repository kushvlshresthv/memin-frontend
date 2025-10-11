import { Component, input } from '@angular/core';
import { CommitteeDetailsDto, MeetingSummaryDto } from '../../models/models';
import { MeetingSummaryComponent } from './meeting-summary/meeting-summary.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import {Response} from "../../response/response";
@Component({
  selector: 'app-meeting-summaries',
  standalone: true,
  imports: [MeetingSummaryComponent, RouterLink, RouterOutlet],
  templateUrl: './meeting-summaries.component.html',
  styleUrl: './meeting-summaries.component.scss'
})
export class MeetingSummariesComponent {
  meetingSummaries = input.required<MeetingSummaryDto[]>();
}

