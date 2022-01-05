import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { FlightModel } from './flight.service';

export interface User{
  id:number;
  name : string;
  surname: string;
  email: string;
  role: string;
  isActive : Boolean;
  createdDate: Date;
  activationDate: Date;
  userStatus : string;
  }


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL_USERS = "http://localhost:8081/ticketreservation/api/register/allRegisteredUsers";
 constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }


 getAllUsers(): Observable<Array<User>> {
  return this.http.get<Array<User>>(this. API_URL_USERS, { headers: this.getAuthorizationHeaders() })
    .pipe(
      map(response => response),
      catchError(() => {
        console.log('error in connection with server');
        return of([]);
      })
    );
 }

 private getAuthorizationHeaders(): HttpHeaders {
  const token = this.authenticationService.tokenValue;
  return new HttpHeaders().set('Authorization', `${token}`);
}
}
