import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Route, UrlSegment, Router, UrlTree } from '@angular/router';
import { BACKEND_URL } from '../global_constants';
import { Response } from './response/response';
import { map, Observable } from 'rxjs';

export function isAuthenticated(
  route: Route,
  segment: UrlSegment[],
): Observable<Boolean | UrlTree> {
  const httpClient = inject(HttpClient);
  const router = inject(Router);

  return httpClient
    .get<Response<Object>>(BACKEND_URL + '/isAuthenticated', {
      withCredentials: true,
    })
    .pipe(
      map((response) => {
        if (response?.message == 'true') {
          return true;
        } else {
          return router.parseUrl('/login');
        }
      }),
    );
}
