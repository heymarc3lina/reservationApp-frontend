import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse,  } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe, of, EMPTY } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface loginModel {
  email: string;
  password: string;
}

export interface WhoIsIt {
 role: string;
}

export interface registerModel {
  email: string;
  name: string;
  surname: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private JWT_TOKEN = 'JWT_TOKEN';
  private API_URL_LOGIN = "http://localhost:8081/ticketreservation/api/login";
  private API_URL_REGISTER_USER = "http://localhost:8081/ticketreservation/api/register/user";
  private API_URL_REGISTER_MANAGER = "http://localhost:8081/ticketreservation/api/register/manager";
  private API_URL_REGISTER_ADMIN = "http://localhost:8081/ticketreservation/api/register/admin";
  

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginData: loginModel): Observable<boolean> {
    console.log('make a call');
    return this.http.post(this.API_URL_LOGIN, loginData, { observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 200) {
          return false;
        }
        console.log(response.headers);
        if (response.headers.get('Authorization')) {
          this.storeToken(response.headers.get('Authorization') || '');
          return true;
        }
        return false;
      }),
      catchError(() => {
        console.log('error happened');
        return of(false);
      })
    )
  }

  logOut(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    location.reload()
    window.location.replace('/');
  }

  register(registerData: registerModel): Observable<boolean> {
    return this.http.post(this.API_URL_REGISTER_USER, registerData, { observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 201) {
          console.log('something went wrong');
          return false;
        }
        return true;
      }),
      catchError(() => {
        console.log('error happened');
        return of(false);
      })
    )
  }
 

  registerManager(registerData: registerModel): Observable<boolean> {
    const token = this.tokenValue;
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.post(this.API_URL_REGISTER_MANAGER, registerData,  { headers, observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 201) {
          console.log('something went wrong');
          return false;
        }
        return true;
      }),
      catchError(() => {
        console.log('error happened');
        return of(false);
      })
    )
  }

  registerAdmin(registerData: registerModel): Observable<boolean> {
    const token = this.tokenValue;
    const headers = new HttpHeaders().set('Authorization', token || '');
    return this.http.post(this.API_URL_REGISTER_ADMIN, registerData,  { headers, observe: 'response' }).pipe(
      map(response => {
        if (response.status !== 201) {
          console.log('something went wrong');
          return false;
        }
        return true;
      }),
      catchError(() => {
        console.log('error happened');
        return of(false);
      })
    )
  }


  get tokenValue(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoged(): boolean {
    return !!localStorage.getItem(this.JWT_TOKEN)
  }

  private storeToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }

}