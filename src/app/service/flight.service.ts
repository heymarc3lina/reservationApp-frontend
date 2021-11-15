import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

export interface FlightModel {
  id: number;
  arrivalAirport: string;
  arrivalDate: Date
  departureAirport: string;
  departureDate: Date
  flightStatus: string
  minPrice: number;
}


interface AllFlightsModel {
  flights: Array<FlightModel>;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllFlights(): Observable<Array<FlightModel>> {
    const token = this.authenticationService.tokenValue;
    const headers = new HttpHeaders().set('authorization', token || '');
    return this.http.get<AllFlightsModel>('api/flights', { headers }).pipe(
      map(response => response.flights),
      catchError(() => {
        console.log('error in connection with server');
        return of([]);
      })
    );
  }

//   getProduct(id: number): Observable<DetailedFlightModel> {
//     return this.http.get<DetailedFlightModel>(`api/flight/${id}`).pipe(
//       catchError(() => {
//         console.log('error in connection with server');
//         return EMPTY;
//       })
//     );
//   }
}