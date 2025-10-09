import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MinuteViewComponent } from './minute-view/minute-view.component';
import { MinuteEditComponent } from './minute-edit/minute-edit.component';
import { BACKEND_URL } from '../../../../global_constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-minute',
  standalone: true,
  imports: [MinuteViewComponent, MinuteEditComponent],
  templateUrl: './minute.component.html',
  styleUrl: './minute.component.scss',
})
export class MinuteComponent {
  htmlContent!: SafeHtml;

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      let params = new HttpParams().set(
        'meetingId',
        receivedParams['meetingId'],
      );
      params = params.set('committeeId', receivedParams['committeeId']);
      this.httpClient
        .get<string>(BACKEND_URL + '/api/previewMeetingMinute', {
          responseType: 'text' as 'json',
          params: params,
          withCredentials: true,
        })
        .subscribe({
          next: (response) => {
            this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(response);
            console.log(this.htmlContent);
          },
          error: (response) => {
            console.log(response);
          },
        });
    });
  }
}
// httpClient.get(BACKEND_URL + '/api/previewMeetingMinute')
