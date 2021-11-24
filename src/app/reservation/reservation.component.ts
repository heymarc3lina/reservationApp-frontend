import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { DataToPrepareReservation, FlightService } from '../service/flight.service';
import { ReservationService } from '../service/reservation.service';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  reservation: DataToPrepareReservation | undefined;
  isUserLoged = false;
  dataLoaded = false;

  reservationSuccesfully = false;
  errorDuringReservation = false;

  constructor(private route: ActivatedRoute, private flightService: FlightService, private authenticationService: AuthenticationService, private reservationService: ReservationService) { }

  ngOnInit(): void {

    this.isUserLoged = this.authenticationService.isLoged();
  }

}
