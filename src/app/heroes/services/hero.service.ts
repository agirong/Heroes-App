import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { catchError, map, Observable, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';

@Injectable({providedIn: 'root'})
export class HeroesService {
  constructor(private http: HttpClient) { }

  private baseUrl:string = environments.baseUrl;

  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`)
  }

  getHeroById(id:string):Observable<Hero|undefined>{
    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
    //Capturar el error http;
    .pipe(
      catchError( error => of (undefined))
      )
  }

  getSuggestions(query:string):Observable<Hero[]>{
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`)
  }

  //CRUD
  addHero(hero: Hero):Observable<Hero>{
    return this.http.post<Hero>(`${this.baseUrl}/heroes`,hero);
  }

  updateHero(hero: Hero):Observable<Hero>{
    if(!hero.id) throw Error('Hero id is required...');

    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`,hero);
  }

  deleteHero(id: string):Observable<boolean>{
    if(!id) throw Error('Hero id is required...');

    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
    .pipe(
      catchError(err => of(false)),
      map(resp => true)
    );
  }

}
