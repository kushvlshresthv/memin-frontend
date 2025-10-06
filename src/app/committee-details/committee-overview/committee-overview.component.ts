import { HttpParams, HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { CommitteeDetailsDto } from '../../models/models';
import { Response } from '../../response/response';

@Component({
  selector: 'app-committee-overview',
  standalone: true,
  imports: [],
  templateUrl: './committee-overview.component.html',
  styleUrl: './committee-overview.component.scss',
})
export class CommitteeOverviewComponent {
  committeeDetails!: CommitteeDetailsDto;

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
            console.log(response);
          },
          error: (response) => {
            console.log(response);
            //TODO: handle error with popup message
          },
        });
    });
  }
}
