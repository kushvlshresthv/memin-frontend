import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Route, UrlSegment, Router, UrlTree, ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { BACKEND_URL } from '../global_constants';
import { Response } from './response/response';
import { catchError, map, Observable, of } from 'rxjs';

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
      //when login fails, server returns HTTP error, and this will be executed
      catchError((error: HttpErrorResponse) => {
        return of(router.parseUrl('/login'));
      }),
    );
}

export const committeeRouteGuard: CanActivateFn= (route:ActivatedRouteSnapshot, state: RouterStateSnapshot)=> {
  const router = inject(Router);
  const committeeId = route.queryParams['committeeId'];
  if (committeeId) {
    return true;
  }
  return router.parseUrl('/error'); //redirect
};


//ensures route has a meetingId and committeeId
export const minuteGuard: CanActivateFn= (route:ActivatedRouteSnapshot, state: RouterStateSnapshot)=> {
  const router = inject(Router);
  const committeeId = route.queryParams['committeeId'];
  const meetingId = route.queryParams['meetingId'];
  if (committeeId && meetingId) {
    return true;
  }
  return router.parseUrl('/error'); //redirect
};
