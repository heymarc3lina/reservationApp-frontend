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
  isReservationActive:boolean
}

export interface DataToPrepareReservation{
  id: number;
  arrivalAirports:  string;
  arrivalDate: Date;
  departureAirports: string;
  departureDate: Date;
  seats: Array<Seats>;
    
}

export interface Seats{
id:number;
seatNumber : number;
classType: string;
price: number;
isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private API_URL_RESERVATION_DATA = "http://localhost:8081/ticketreservation/api/reservation/" ;
  private API_URL_FLIGHTS = "http://localhost:8081/ticketreservation/api/flight/allFlight" ;
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllFlights(): Observable<Array<FlightModel>> {
    return this.http.get<Array<FlightModel>>(this.API_URL_FLIGHTS)
    .pipe(
      map(response => response),
      catchError(() => {
        console.log('error in connection with server');
        return of([]);
      })
    );
  }

  getFilters():  Observable<Array<FlightModel>>{
    return this.http.get<Array<FlightModel>>("http://localhost:8081/ticketreservation/api/reservation/allMyReservation",  { headers: this.getAuthorizationHeaders() });
  }

  getFlightToReservation(id: number): Observable<DataToPrepareReservation> {
    return this.http.get<DataToPrepareReservation>(this.API_URL_RESERVATION_DATA+`${id}`, { headers: this.getAuthorizationHeaders() }).pipe(
      catchError(() => {
        console.log('error in connection with server');
        return EMPTY;
      })
    );
  }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this.authenticationService.tokenValue;
    return new HttpHeaders().set('Authorization', `${token}`);
  }
 
}