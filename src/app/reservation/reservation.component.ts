import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { DataToPrepareReservation, FlightService, Seats } from '../service/flight.service';
import { ReservationService } from '../service/reservation.service';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  seatsChecked: Array<Seats> = [];
  reservation: Array<DataToPrepareReservation> = [];
  isUserLoged = false;
  dataLoaded = false;

  reservationSuccesfully = false;
  errorDuringReservation = false;

  constructor(private route: ActivatedRoute, private flightService: FlightService, private authenticationService: AuthenticationService, private reservationService: ReservationService) { }

  ngOnInit(): void {

    this.isUserLoged = this.authenticationService.isLoged();
    const routeParams = this.route.snapshot.paramMap;
    const flightId = Number(routeParams.get('flightId'));
    this.retriveFlight(flightId);
  }

  retriveFlight(flightId: number) : void{
      this.flightService.getFlightToReservation(flightId).subscribe(flight =>{
      this.reservation.push(flight);
      this.dataLoaded = true;
    })
  }

  sendCheckedSeats(): void{
    this.seatsChecked = [];
      this.reservation.forEach(res => {
            res.seats.forEach(seat => {
                if(seat.checked){
                  this.seatsChecked.push(seat);
                }
            });
      });
      console.log(this.seatsChecked);
  }



}
