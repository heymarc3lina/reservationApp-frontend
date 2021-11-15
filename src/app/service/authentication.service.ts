import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

  constructor(private http: HttpClient, private router: Router) {
  }

  login(loginData: loginModel): Observable<boolean> {
    console.log('make a call');
    return this.http.post('api/login', loginData, { observe: 'response', responseType: 'text' }).pipe(
      map(response => {
        if (response.status !== 200) {
          return false;
        }
        console.log(response.headers.get('authorization'));
        if (response.headers.get('authorization')) {
          this.storeToken(response.headers.get('authorization') || '');
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
    this.router.navigate(['flights']);
  }

  register(registerData: registerModel): Observable<boolean> {
    return this.http.post('api/register/user', registerData, { observe: 'response' }).pipe(
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