import { HttpParams, HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { CommitteeDetailsDto, CommitteeOverviewDto, MeetingSummaryDto, MemberOfCommitteeDto } from '../../models/models';
import { Response } from '../../response/response';
import { CalendarComponent } from './calendar/calendar.component';
import { DatePipe } from '@angular/common';
import { MemberSummariesComponent } from './member-summaries/member-summaries.component';
import { MeetingSummariesComponent } from './meeting-summaries/meeting-summaries.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-committee-overview',
  standalone: true,
  imports: [RouterOutlet, MemberSummariesComponent, CalendarComponent,DatePipe, MeetingSummariesComponent, MeetingSummariesComponent],
  templateUrl: './committee-overview.component.html',
  styleUrl: './committee-overview.component.scss',
})
export class CommitteeOverviewComponent {

  //used to display template
  hasCommitteeMembersLoaded = false;
  hasOverviewDataLoaded = false;
  hasMeetingDataLoaded = false;


  //variables to store the loaded data
  membersOfCommittee!: MemberOfCommitteeDto[];
  committeeOverview!: CommitteeOverviewDto;
  meetingSummaries!: MeetingSummaryDto[];

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {

    //load committee members
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      const params = new HttpParams().set(
        'committeeId',
        receivedParams['committeeId'],
      );
      this.httpClient
        .get<
          Response<MemberOfCommitteeDto[]>
        >(BACKEND_URL + '/api/getAllMembersOfCommittee', {params: params,  withCredentials: true })
        .subscribe({
          next: (response) => {
            this.membersOfCommittee = response.mainBody;
            this.hasCommitteeMembersLoaded = true;
          },
          error: (response) => {
            //TODO: handle error with popup message and redirect to error page
            console.log(response);
          },
        });
    });


    //load committee overview data
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      const params = new HttpParams().set('committeeId', receivedParams['committeeId']);
      this.httpClient
        .get<
          Response<CommitteeOverviewDto>
        >(BACKEND_URL + '/api/getCommitteeOverview', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.committeeOverview = response.mainBody;
            this.hasOverviewDataLoaded = true;
          },
          error: (response) => {
            console.log(response);
            //TODO: handle error with popup message
          },
        });
    });

    //TODO: combine both of these requests to a single one from the backend
    //load meetings data for the committee
        this.activatedRoute.queryParams.subscribe((receivedParams) => {
      const params = new HttpParams().set('committeeId', receivedParams['committeeId']);
      this.httpClient
        .get<
          Response<MeetingSummaryDto[]>
        >(BACKEND_URL + '/api/getMeetingsOfCommittee', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.meetingSummaries = response.mainBody;
            this.hasMeetingDataLoaded = true;
          },
          error: (response) => {
            console.log(response);
            //TODO: handle error with popup message
          },
        });
    });
  }
}
