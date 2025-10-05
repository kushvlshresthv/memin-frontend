import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { MemberSearchResult } from './models/models';
import { BACKEND_URL } from '../global_constants';
import { Response } from './response/response';
import { HttpClient } from '@angular/common/http';
import { map, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadMemberService implements OnDestroy {
  constructor(private httpClient: HttpClient) {}

  subscription!: Subscription;

  public loadAllMembers() {
    return this.httpClient
      .get<Response<MemberSearchResult[]>>(BACKEND_URL + '/api/getAllMembers', {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          return response.mainBody;
        }),
      );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
