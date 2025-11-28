import { Component, Input } from '@angular/core';
import { CommitteeSummary } from './committee-summary.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Response } from '../../../response/response';
import { BACKEND_URL } from '../../../../global_constants';

@Component({
  selector: 'app-committee-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './committee-summary.component.html',
  styleUrl: './committee-summary.component.scss',
})
export class CommitteeSummaryComponent {
  @Input({ required: true }) committeeSummary!: CommitteeSummary;

  showMenuOptions = false;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenuOptions = !this.showMenuOptions;
  }

  onEditOptionClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['./committee-details/edit'], {
      queryParams: {
        committeeId: this.committeeSummary.id,
      },
    });
  }

  onOverviewOptionClick(event: Event) {
    event.stopPropagation();
    this.router.navigate(['./committee-details/overview'], {
      queryParams: {
        committeeId: this.committeeSummary.id,
      },
    });
  }

  onSummaryOptionClick(event: Event) {
    event.stopPropagation();
    // this.router.navigate(['./committee-details/summary'], {
    //   queryParams: {
    // 	committeeId: this.committeeSummary.id
    //   }
    // })
  }

  onArchiveOptionClick(event: Event) {
    event.stopPropagation();

    const httpParams = new HttpParams().set(
      'committeeId',
      this.committeeSummary.id,
    );
    this.http
      .patch<Response<Object>>(
        BACKEND_URL + '/api/toggleCommitteeStatus',
        null,
        {
          withCredentials: true,
          params: httpParams,
        },
      )
      .subscribe({
        next: (response) => {
          console.log('TODO: handle this response');
          const currentUrl = this.router.url;

          // Navigate to a non-existent or temporary path for reloading data
          this.router
            .navigateByUrl('/non-existent', { skipLocationChange: true })
            .then(() => {

              // Navigate back to the original URL
              this.router.navigate([currentUrl]);
	      console.log("rerouting complete");
            });
        },
      });
  }
}
