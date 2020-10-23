import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  url = 'http://localhost:3000/cars';

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getCars(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.url)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getCarById(id: number): Observable<Car> {
    return this.httpClient.get<Car>(this.url + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  saveCar(car: Car): Observable<Car> {
    return this.httpClient.post<Car>(this.url, JSON.stringify(car), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  updateCar(car: Car): Observable<Car> {
    return this.httpClient.post<Car>(this.url, JSON.stringify(car), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  deleteCar(car: Car) {
    return this.httpClient.delete<Car>(this.url + '/' + car.id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}
