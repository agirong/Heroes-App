import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, tap, map, catchError, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) { }

  private baseUrl = environments.baseUrl;
  private user?:User;

  get currentUser():User|undefined{
    if(!this.user) return undefined;

    return structuredClone(this.user);
  }

  login(email:string,pass:string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user=> this.user = user),
      tap(user=> localStorage.setItem('token','hjkashdkljashdlhaskjhsda.oiajdoijaiodjaoid.halidhjklashd'))
    )
  }

  checkAuthentication():Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user => this.user = user),
      map(user => !!user),
      catchError(err => of(false))
    )
  }

  logout():void{
    this.user =undefined;
    localStorage.clear();
  }
}
