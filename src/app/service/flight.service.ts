import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

export interface FlightModel {
  id: number;
  arrivalAirports: string;
  arrivalDate: Date;
  departureAirports: string;
  departureDate: Date;
  flightStatus: string;
  minPrice: number
}


interface AllFlightsModel {
  flights: Array<FlightModel>;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private API_URL_FLIGHTS = "http://localhost:8081/ticketreservation/api/flight/allFlight" ;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllFlights(): Observable<Array<FlightModel>> {
    return this.http.get<Array<FlightModel>>(this.API_URL_FLIGHTS);
    // .pipe(
    //   map(response => response.flights),
    //   catchError(() => {
    //     console.log('error in connection with server');
    //     return of([]);
    //   })
    // );
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