import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { MinuteDataDto } from '../../models/models';
import { Response } from '../../response/response';

@Injectable()
export class MinuteDataService {
  private minuteData = signal<MinuteDataDto>(new MinuteDataDto());
  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      let params = new HttpParams().set(
        'meetingId',
        receivedParams['meetingId'],
      );
      params = params.set('committeeId', receivedParams['committeeId']);
      this.httpClient
        .get<Response<MinuteDataDto>>(BACKEND_URL + '/api/getDataForMinute', {
          params: params,
          withCredentials: true,
        })
        .subscribe({
          next: (response) => {
            console.log(response.mainBody);
            this.minuteData.set(response.mainBody);
          },
          error: (response) => {
            console.log(response);
          },
        });
    });
  }

  getMinuteData(): Signal<MinuteDataDto> {
    return this.minuteData;
  }
}
