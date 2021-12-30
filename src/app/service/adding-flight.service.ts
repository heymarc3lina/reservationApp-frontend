import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { AirportAndPlane, EditFlightData } from './edit-flight.service';

@Injectable({
  providedIn: 'root'
})
export class AddingFlightService {
  private API_URL_GET_DATA_TO_CREATE_FLIGHT = "http://localhost:8081/ticketreservation/api/flight/data";
  private API_URL_TO_CREATE_FLIGHT = "http://localhost:8081/ticketreservation/api/flight";
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getDataToCreateFlight(): Observable<AirportAndPlane>{
    return this.http.get<AirportAndPlane>(this.API_URL_GET_DATA_TO_CREATE_FLIGHT, { headers: this.getAuthorizationHeaders() }).pipe(
      catchError(() => {
        console.log('error in connection with server');
        return EMPTY;
      }));
    
  }

  createFlight(flightDto: EditFlightData) : Observable<boolean> {
    const token = this.authenticationService.tokenValue;
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.post(this.API_URL_TO_CREATE_FLIGHT, flightDto, { headers, observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 201) {
          return false;
        }
        return true;
      }),
      catchError(() => {
        window.alert('Dates are the same or are overdue.');
        return of(false);
      })
    );
  }

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this.authenticationService.tokenValue;
    return new HttpHeaders().set('Authorization', `${token}`);
  }
}
