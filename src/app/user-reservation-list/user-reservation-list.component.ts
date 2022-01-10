import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import {AllUserReservation, ReservationService } from '../service/reservation.service';

@Component({
  selector: 'app-user-reservation-list',
  templateUrl: './user-reservation-list.component.html',
  styleUrls: ['./user-reservation-list.component.css']
})
export class UserReservationListComponent implements OnInit {
listOfUserReservation : Array<AllUserReservation> = []
dataLoaded = false;
activeReservation = "ACTIVE";
completedReservation = "COMPLETED"
isactiveReservation = true;
succesfullyCancelled = false;
  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService, private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.getAllUserReservation();
  }

  getAllUserReservation(): void {
    this.dataLoaded = false;
    this.reservationService.getUserReservation().subscribe(reservations => {
      reservations.forEach(reservation =>{
        if (reservation.reservationStatus == this.activeReservation) {
          reservation.reservationStatus = "Aktywna"
          reservation.isReservationActive= true;
        }else if(reservation.reservationStatus == this.completedReservation){
          reservation.reservationStatus = "Zakończona"
          reservation.isReservationActive= false;
        }else{
          reservation.reservationStatus = "Anulowana"
          reservation.isReservationActive= false;
        }
        this.listOfUserReservation.push(reservation);
      });  
    }, error=>{
      window.location.replace('/login');
    });
  
    this.dataLoaded = true;
  };

  reservationCancelClick(reservationId: number) : void{
    console.log(reservationId);
    this.reservationService.cancelReservation(reservationId).subscribe(response =>{
      if(response){
          this.succesfullyCancelled = true;
          window.location.reload();
      }
    });
  }

}
