import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse,  } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface loginModel {
  email: string;
  password: string;
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
  private API_URL_REGISTER = "http://localhost:8081/ticketreservation/api/register/user" ;

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
    this.router.navigate(['flights']);
  }

  register(registerData: registerModel): Observable<boolean> {
    return this.http.post(this.API_URL_REGISTER, registerData, { observe: 'response' }).pipe(
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