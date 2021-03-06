import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { FlightModel } from './flight.service';

export interface UpdateFlightData{
  airportAndPlaneDto : AirportAndPlane;
  flightDto : FlightModel;
}

export interface EditFlightData{
  plain: String;
  arrivalAirport: string;
  departureAirport: string;
  arrivalDate: Date | undefined;
  departureDate: Date | undefined;
  price: number;
}


export interface AirportAndPlane{
  airportList: Array<Airport> ;
  planeList: Array<Plane> ;
}

export interface Airport{
  airportId : number;
  city: String;
}

export interface Plane{
  place: number;
  planeId : number;
  name: String;
}

@Injectable({
  providedIn: 'root'
})

export class EditFlightService {
  private API_URL_EDIT_FLIGHT = "http://localhost:8081/ticketreservation/api/flight/";
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getFlightToEdit(id: number): Observable<UpdateFlightData> {
    return this.http.get<UpdateFlightData>(this.API_URL_EDIT_FLIGHT+`${id}`+"/update", { headers: this.getAuthorizationHeaders() }).pipe(
      catchError(() => {
        console.log('error in connection with server');
        return EMPTY;
      })
    );
  }


  editFlight(editFlight: EditFlightData, id: number) : Observable<boolean> {
    const token = this.authenticationService.tokenValue;
    const headers = new HttpHeaders().set('authorization', token || '');
    return this.http.put(this.API_URL_EDIT_FLIGHT+`${id}`+"/update", editFlight, { headers, observe: 'response' }).pipe(
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
