import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MinuteViewComponent } from './minute-view/minute-view.component';
import { MinuteEditComponent } from './minute-edit/minute-edit.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BACKEND_URL } from '../../../../../global_constants';
import { MinuteDataDto } from '../../../../models/models';
import { Response } from '../../../../response/response';

@Component({
  selector: 'app-minute',
  standalone: true,
  imports: [MinuteViewComponent, MinuteEditComponent],
  templateUrl: './minute.component.html',
  styleUrl: './minute.component.scss',
})
export class MinuteComponent {
  minuteData!: MinuteDataDto;

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
        .get<Response<MinuteDataDto>>(BACKEND_URL + '/api/getDataForNepaliMinute', {
          params: params,
          withCredentials: true,
        })
        .subscribe({
          next: (response) => {
            this.minuteData = response.mainBody;
          },
          error: (response) => {
            console.log(response);
          },
        });
    });
  }
}
