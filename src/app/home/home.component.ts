import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommitteeSummary } from './committee-summary/committee-summary.model';
import { BACKEND_URL } from '../../global_constants';
import { Response } from '../response/response';
import { CommitteeSummaryComponent } from './committee-summary/committee-summary.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommitteeSummaryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  committeeSummaries!: CommitteeSummary[];
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get<Response<CommitteeSummary[]>>(BACKEND_URL + '/api/getCommittees', {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          this.committeeSummaries = response.mainBody;
        },
        error: (response) => {
          console.log('error fetching committee');
        },
      });
  }
}
