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
  seatsChecked: Array<Number> = [];
  reservation: DataToPrepareReservation | undefined;
  isUserLoged = false;
  dataLoaded = false;
  isSomethingClicked = false;
  succesfullyMakingReservation = false;
  errorDuringMakingReservation = false;


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
      this.reservation  = flight;
      this.dataLoaded = true;
    })
  }

  sendCheckedSeats(): void{
    this.dataLoaded = false;
    if(this.reservation){
    this.isSomethingClicked = false;
    this.seatsChecked = [];
    this.reservation?.seats.forEach(seat => {
                if(seat.checked){
                  this.seatsChecked.push(seat.id);
                }
              });

      if(this.seatsChecked.length < 1){
        this.isSomethingClicked = true;
        this.dataLoaded = true;
      }else{
        console.log(this.seatsChecked);
        this.reservationService.createReservation( this.reservation?.id ,this.seatsChecked ).subscribe(response =>{
          console.log(response);
          if(response){
              this.succesfullyMakingReservation = true;
              window.location.replace("/reservationConfirm");
          }
        });
      }
      console.log(this.seatsChecked);
  }else {
    this.errorDuringMakingReservation = true;
  }

}


}
