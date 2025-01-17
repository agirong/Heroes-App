import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard {

    constructor(
      private authService:AuthService,
      private router:Router
    ) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap(isAuthenticated => console.log('Authenticated:',isAuthenticated)),
        tap(isAuthenticated => {
          if (isAuthenticated) {
            this.router.navigate(['./'])
          }
        }),
        map(isAuthenticated => !isAuthenticated)
      );
  }

    canMatch(route: Route, segments: UrlSegment[]): boolean| Observable<boolean> {
      // console.log('CanMatch')
      // console.log({route,segments})
      return this.checkAuthStatus();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean| Observable<boolean> {
      // console.log('CanActivate')
      // console.log({route,state})
      return this.checkAuthStatus();
    }

}
