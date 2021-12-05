import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';


export interface Role{
  role: string;
}
export interface FlightModel {
  id: number;
  arrivalAirports: string;
  arrivalDate: Date;
  departureAirports: string;
  departureDate: Date;
  flightStatus: string;
  minPrice: number;
  isReservationActive:boolean;
  isNewStatus:boolean;
}

export interface FlightWithStatuses{
  flightDto: FlightModel;
  flightStatuses: Array<FlightStatus>;

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
checked ? : boolean;
}

export class StatusChange{
  flightId: number;
  flightStatus: FlightStatus;

  constructor(flightId: number,
    flightStatus: FlightStatus) {
    this.flightId = flightId;
    this.flightStatus=  flightStatus;
  }
}
export enum FlightStatus{
  NEW = "Nowy",
  AVAILABLE = "Dostepny",
  OVERDATE = "Przeterminowany",
  CANCELLED = "Anulowany ",
  FULL= "Pelny",
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private API_URL_RESERVATION_DATA = "http://localhost:8081/ticketreservation/api/reservation/";
  private API_URL_FLIGHTS = "http://localhost:8081/ticketreservation/api/flight/allFlight";
  private API_URL_ALL_FLIGHTS = "http://localhost:8081/ticketreservation/api/flight";
  private API_URL_WHOISIT = "http://localhost:8081/ticketreservation/api/whoami";
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

  getAllExistingFlights(): Observable<Array<FlightWithStatuses>> {
    return this.http.get<Array<FlightWithStatuses>>(this. API_URL_ALL_FLIGHTS, { headers: this.getAuthorizationHeaders() })
    .pipe(
      map(response => response),
      catchError(() => {
        console.log('error in connection with server');
        return of([]);
      })
    );
  }

  whoIsIt(): Observable<Role>{
    return this.http.get<Role>(this.API_URL_WHOISIT, { headers: this.getAuthorizationHeaders() }).pipe(
      catchError(() => {
        console.log('error in connection with server');
        return EMPTY;
      }));
    
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

  changeFlightStatus(statusChange: StatusChange) : Observable<boolean> {
    const token = this.authenticationService.tokenValue;
    const headers = new HttpHeaders().set('authorization', token || '');
    return this.http.put(this.API_URL_ALL_FLIGHTS, statusChange, { headers, observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 200) {
          return false;
        }
        return true;
      }),
      catchError(() => {
        console.log('Error during communication with server.');
        return of(false);
      })
    );
  }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this.authenticationService.tokenValue;
    return new HttpHeaders().set('Authorization', `${token}`);
  }
 
}