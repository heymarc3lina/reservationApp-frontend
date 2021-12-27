import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AllReservation, ReservationService } from '../service/reservation.service';

@Component({
  selector: 'app-all-user-reservation-list.component',
  templateUrl: './all-user-reservation-list.component.html',
  styleUrls: ['./all-user-reservation-list.component.css']
})
export class AllUserReservationListComponent implements OnInit {
  listOfReservation : Array<AllReservation> = []
  dataLoaded = false;
  activeReservation = "ACTIVE";
  completedReservation = "COMPLETED"
  isactiveReservation = true;
  succesfullyCancelled = false;
  pageSize = 5;
  page : Array<number> = []
  pageQuantity= 0
  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService, private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.getAllReservation();
  }

  getAllReservation(): void {
    this.dataLoaded = false;
    this.reservationService.getAllUsersReservation().subscribe(reservations => {
      reservations.forEach(reservation =>{
        if (reservation.reservationDto.reservationStatus == this.activeReservation) {
          reservation.reservationDto.reservationStatus = "Aktywna"
          reservation.reservationDto.isReservationActive= true;
        }else if(reservation.reservationDto.reservationStatus == this.completedReservation){
          reservation.reservationDto.reservationStatus = "Zakończona"
          reservation.reservationDto.isReservationActive= false;
        }else{
          reservation.reservationDto.reservationStatus = "Anulowana"
          reservation.reservationDto.isReservationActive= false;
        }
        this.listOfReservation.push(reservation);
      });      
    });
   this.page.length =Math.ceil(this.listOfReservation.length / 5);
   this.pageQuantity = this.page.length
  
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
