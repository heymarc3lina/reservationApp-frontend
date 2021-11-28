import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Seats } from './flight.service';



@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private API_URL_CREATE_RESERVATION = "http://localhost:8081/ticketreservation/api/reservation/createReservation" ;
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
}
