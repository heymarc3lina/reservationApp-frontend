import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { FlightService, Role } from '../service/flight.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoged = false;
  isManager = false;
  isUser = false;
  isAdmin = false;
  whoIsIt:  Role | undefined;


  constructor(public router: Router, private authenticationService: AuthenticationService, private flightService: FlightService) {}

  ngOnInit() {
    this.isLoged = this.authenticationService.isLoged();
    this.checkWhoIsIt();
    
  }

  ngOnCheck() {
    this.isLoged = this.authenticationService.isLoged();
    this.checkWhoIsIt();
  }

  logOut(): void {
    this.authenticationService.logOut();
  }

  checkWhoIsIt() : void {
    this.isManager = false;
    this.isUser = false;
    this.isAdmin = false;
    if(this.isLoged){
      this.flightService.whoIsIt().subscribe(who=>{
        console.log(who.role);
        if(who.role == "USER"){
         console.log("user");
         this.isUser = true;
        }else if(who.role == "MANAGER") {
          this.isManager = true;
         console.log("manager");
        }
        else if(who.role == "ADMIN") {
          this.isAdmin = true;
         console.log("admin");
        }
       });
      }
  }

}