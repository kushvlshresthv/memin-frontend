import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from '../../../global_constants';
import { MinuteDataDto } from '../../models/models';
import { Response } from '../../response/response';

@Injectable()
//data loading logic is not in the component because data needs to be shared with minute-edit component. 
export class MinuteDataService {
  private minuteData = signal<MinuteDataDto>(new MinuteDataDto());

  private originalData:string = "";

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((receivedParams) => {
      let params = new HttpParams().set(
        'meetingId',
        receivedParams['meetingId'],
      );
      this.httpClient
        .get<Response<MinuteDataDto>>(BACKEND_URL + '/api/getDataForMinute', {
          params: params,
          withCredentials: true,
        })
        .subscribe({
          next: (response) => {
            this.minuteData.set(response.mainBody);
            this.originalData = JSON.stringify(response.mainBody);
	    console.log(response.mainBody);
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

  hasDataChanged(): boolean {
    if(this.originalData.length != 0 && JSON.stringify(this.minuteData()) !== this.originalData) {
      return true;
    }
    return false;
  }
}
