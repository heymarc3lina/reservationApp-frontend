import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoged = false;

  constructor(public router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.isLoged = this.authenticationService.isLoged();
  }

  ngOnCheck() {
    this.isLoged = this.authenticationService.isLoged();
  }

  logOut(): void {
    this.authenticationService.logOut();
  }

}