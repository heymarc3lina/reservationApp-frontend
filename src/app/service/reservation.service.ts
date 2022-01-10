import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Seats } from './flight.service';


export interface AllReservation{
  userName: string;
  userSurname: string;
  userEmail: string;
  reservationDto:AllUserReservation;
}

export interface AllUserReservation{
  reservationId: number;
  reservationDate: Date;
  planeName: string;
  arrivalAirport: string;
  arrivalDate: Date;
  departureAirport: string;
  departureDate: Date;
  seatNumber: number;
  reservationStatus: string;
  price: number;
  isReservationActive: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private API_URL_CREATE_RESERVATION = "http://localhost:8081/ticketreservation/api/reservation/createReservation";
  private API_URL_USER_RESERVATION = "http://localhost:8081/ticketreservation/api/reservation/allMyReservation";
  private API_URL_ALL_USER_RESERVATION = "http://localhost:8081/ticketreservation/api/reservation/allReservationForUsers";
  private API_URL_CANCEL_RESERVATION = "http://localhost:8081/ticketreservation/api/reservation/editStatus";
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }


    private getAuthorizationHeaders(): HttpHeaders {
    const token = this.authenticationService.tokenValue;
    return new HttpHeaders().set('Authorization', `${token}`);
  }


  createReservation(flightId: number, seatList: Array<Number>) : Observable<boolean> {
    const token = this.authenticationService.tokenValue;
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.post(this.API_URL_CREATE_RESERVATION, { flightId, seatList }, { headers, observe: 'response' }).pipe(
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


  getUserReservation(): Observable<Array<AllUserReservation>> {
    return this.http.get<Array<AllUserReservation>>(this.API_URL_USER_RESERVATION, { headers: this.getAuthorizationHeaders() }).pipe(
      catchError(() => {
        console.log('error in connection with server');
        return EMPTY;
      })
    );
  }

  getAllUsersReservation(): Observable<Array<AllReservation>> {
    return this.http.get<Array<AllReservation>>(this.API_URL_ALL_USER_RESERVATION, { headers: this.getAuthorizationHeaders() }).pipe(
      catchError(() => {
        console.log('error in connection with server');
        return EMPTY;
      })
    );
  }

  cancelReservation(reservationId: number) : Observable<boolean> {
    const token = this.authenticationService.tokenValue;
    const headers = new HttpHeaders().set('authorization', token || '');
    return this.http.put(this.API_URL_CANCEL_RESERVATION, reservationId, { headers, observe: 'response' }).pipe(
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
}
