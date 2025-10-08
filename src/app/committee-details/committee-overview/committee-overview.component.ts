import { HttpParams, HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { CommitteeDetailsDto } from '../../models/models';
import { Response } from '../../response/response';
import { MemberSummariesComponent } from './member-summaries/member-summaries.component';
import { MeetingSummariesComponent } from '../meeting-summaries/meeting-summaries.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RecognizeNepaliTextDirective } from '../../utils/recognize-nepali-text.directive';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-committee-overview',
  standalone: true,
  imports: [MemberSummariesComponent, CalendarComponent, RecognizeNepaliTextDirective, DatePipe],
  templateUrl: './committee-overview.component.html',
  styleUrl: './committee-overview.component.scss',
})
export class CommitteeOverviewComponent {
  committeeDetails!: CommitteeDetailsDto;
  meetingDates!: string[];
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
          Response<CommitteeDetailsDto>
        >(BACKEND_URL + '/api/getCommitteeDetails', { params: params, withCredentials: true })
        .subscribe({
          next: (response) => {
            this.committeeDetails = response.mainBody;
            this.meetingDates = response.mainBody.meetings.map(meeting => meeting.heldDate);
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
