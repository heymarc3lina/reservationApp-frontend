import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { FlightService, Role } from '../service/flight.service';

@Component({
  selector: 'app-confirm-registration-component',
  templateUrl: './confirm-registration-component.component.html',
  styleUrls: ['./confirm-registration-component.component.css']
})
export class ConfirmRegistrationComponentComponent implements OnInit {

  isLoged = false;
  isAdmin = false;
  whoIsIt:  Role | undefined;


  constructor(private authenticationService: AuthenticationService, private flightService: FlightService) {}

  ngOnInit() {
    this.isLoged = this.authenticationService.isLoged();
    this.checkWhoIsIt();
    
  }

  checkWhoIsIt() : void {
    this.isAdmin = false;
    if(this.isLoged){
      this.flightService.whoIsIt().subscribe(who=>{
        console.log(who.role);
       if(who.role == "ADMIN") {
          this.isAdmin = true;
         console.log("admin");
        }
      });
    } 
  }

}
