import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BACKEND_URL } from '../../../global_constants';
import { CommitteeSummary } from './committee-summary/committee-summary.model';
import { Response } from '../../response/response';
import { CommitteeSummaryComponent } from './committee-summary/committee-summary.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-committee-summaries',
  standalone: true,
  imports: [CommitteeSummaryComponent, RouterLink, FormsModule],
  templateUrl: './committee-summaries.component.html',
  styleUrl: './committee-summaries.component.scss',
})
export class CommitteeSummariesComponent {
  committeeSummaries!: CommitteeSummary[];
  sortBy: 'createdDate' | 'title' = 'createdDate';
  constructor(private httpClient: HttpClient) {}
  hasCommitteesLoaded = false;

  ngOnInit(): void {
    this.httpClient
      .get<Response<CommitteeSummary[]>>(
        BACKEND_URL + '/api/getMyActiveCommittees',
        {
          withCredentials: true,
        }
      )
      .subscribe({
        next: (response) => {
          this.committeeSummaries = response.mainBody;
          this.sortCommittees();
          this.hasCommitteesLoaded = true;
        },
        error: (response) => {
          console.log('error fetching committee');
        },
      });
  }

  onSortChange(event: Event): void {
    this.sortCommittees();
  }

  private sortCommittees(): void {
    if (!this.committeeSummaries) return;

    this.committeeSummaries.sort((a, b) => {
      if (this.sortBy === 'createdDate') {
        return (
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        );
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }
}
