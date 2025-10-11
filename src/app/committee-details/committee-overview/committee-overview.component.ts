import { HttpParams, HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { CommitteeDetailsDto, CommitteeOverviewDto, MeetingSummaryDto } from '../../models/models';
import { Response } from '../../response/response';
import { CalendarComponent } from './calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { MemberSummariesComponent } from './member-summaries/member-summaries.component';
import { MeetingSummariesComponent } from './meeting-summaries/meeting-summaries.component';

@Component({
  selector: 'app-committee-overview',
  standalone: true,
  imports: [MemberSummariesComponent, CalendarComponent,DatePipe, MeetingSummariesComponent, MeetingSummariesComponent],
  templateUrl: './committee-overview.component.html',
  styleUrl: './committee-overview.component.scss',
})
export class CommitteeOverviewComponent {
  committeeOverview!: CommitteeOverviewDto;
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
          Response<CommitteeOverviewDto>
        >(BACKEND_URL + '/api/getCommitteeOverview', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.committeeOverview = response.mainBody;
            this.dataLoaded = true;
          },
          error: (response) => {
            console.log(response);
            //TODO: handle error with popup message
          },
        });
    });

    //TODO: combine both of these requests to a single one from the backend
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
