import { HttpClient, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BACKEND_URL } from '../../global_constants';
import {
  CommitteeDetailsDto,
  MemberOfCommitteeDto,
  MemberSummaryDto,
} from '../models/models';
import { Response } from '../response/response';
import { MemberSummariesComponent } from './committee-overview/member-summaries/member-summaries.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-committee-details',
  standalone: true,
  imports: [RouterOutlet, MemberSummariesComponent],
  templateUrl: './committee-details.component.html',
  styleUrl: './committee-details.component.scss',
})
export class CommitteeDetailsComponent {
  membersOfCommittee!: MemberOfCommitteeDto[];
  dataLoaded = false;
  showCommitteeMembers = true;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    // '/minute' route doesn't need the membersOfCommittee data
    this.router.events.pipe((filter(event => event instanceof NavigationEnd))).subscribe(() => {
      this.showCommitteeMembers = !this.router.url.includes('minute');
    });

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
            this.dataLoaded = true;
          },
          error: (response) => {
            //TODO: handle error with popup message and redirect to error page
            console.log(response);
          },
        });
    });
  }
}
