import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKEND_URL } from '../../../global_constants';
import { CommitteeSummary } from './committee-summary/committee-summary.model';
import { Response } from '../../response/response';
import { CommitteeSummaryComponent } from './committee-summary/committee-summary.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-committee-summaries',
  standalone: true,
  imports: [CommitteeSummaryComponent, RouterLink],
  templateUrl: './committee-summaries.component.html',
  styleUrl: './committee-summaries.component.scss',
})
export class CommitteeSummariesComponent {
  committeeSummaries!: CommitteeSummary[];
  constructor(private httpClient: HttpClient) {}
  hasCommitteesLoaded=false;

  ngOnInit(): void {
    this.httpClient
      .get<Response<CommitteeSummary[]>>(BACKEND_URL + '/api/getCommittees', {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          this.committeeSummaries = response.mainBody;
	  this.hasCommitteesLoaded = true;
        },
        error: (response) => {
          console.log('error fetching committee');
        },
      });
  }
}
