import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';



@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }


  

  private getAuthorizationHeaders(): HttpHeaders {
    const token = this.authenticationService.tokenValue;
    return new HttpHeaders().set('Authorization', `${token}`);
  }
}
