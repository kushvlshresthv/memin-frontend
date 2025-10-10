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
  meetingSummaries!: MeetingSummaryDto[];
  dataLoaded = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      const params = new HttpParams().set('committeeId', receivedParams['committeeId']);
      this.httpClient
        .get<
          Response<MeetingSummaryDto[]>
        >(BACKEND_URL + '/api/getMeetingsOfCommittee', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.meetingSummaries = response.mainBody;
            this.dataLoaded = true;
          },
          error: (response) => {
            console.log(response);
            //TODO: handle error with popup message
          },
        });
    });
  }
}

