import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states/';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: String): Observable<State[]>{

    const searchUrl = `${this.statesUrl}search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardMonths(starthMonth : number): Observable<number[]> {

    let data: number[] = [];

    for(let theMonth = starthMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear ; theYear++){
      data.push(theYear);
    }
    return of(data);
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  };
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}