import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, registerModel } from '../service/authentication.service';
import { FlightService } from '../service/flight.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  dataForm: FormGroup;
  hise = true;
  isNotCompletedFormAlert = false;
  isNotMatchPasswordsAlert = false;
  isServerErrorAlert = false;
  isValidName = false;
  isValidSurnameName = false;
  isNotEnoughLongPassword = false;
  isSomethingWrong = false;
  isEmailNotCorrect = false;
  isLoged = false;
  isAdmin = false;
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router, private flightService: FlightService) { 
    this.dataForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
  

  createUserAccount(): void {
    this.validForm();
    if( !this.isSomethingWrong){
      const registerData: registerModel = {
        email: this.dataForm.get('email')?.value,
        name: this.dataForm.get('name')?.value,
        surname: this.dataForm.get('surname')?.value,
        password: this.dataForm.get('password')?.value
      };
      this.authenticationService.register(registerData).subscribe(success => {
        if (success) {
          window.location.replace('/confirm');
        } else {
          this.isServerErrorAlert = true;
        }
      })
    }
  }

 

  createManagerAccount(): void{
    this.validForm();
    console.log("Bede Tworzyc managera");
    if( !this.isSomethingWrong){
      const registerData: registerModel = {
        email: this.dataForm.get('email')?.value,
        name: this.dataForm.get('name')?.value,
        surname: this.dataForm.get('surname')?.value,
        password: this.dataForm.get('password')?.value
      };
      console.log("Tworze menagera");
      this.authenticationService.registerManager(registerData).subscribe(success => {
        if (success) {
          window.location.replace('/confirm');
        } else {
          this.isServerErrorAlert = true;
        }
      })
      
    }
  }

  createAdminAccount(): void{
    this.validForm();
    console.log("Bede tworzyc admina");
    if( !this.isSomethingWrong){
      const registerData: registerModel = {
        email: this.dataForm.get('email')?.value,
        name: this.dataForm.get('name')?.value,
        surname: this.dataForm.get('surname')?.value,
        password: this.dataForm.get('password')?.value
      };
      console.log("Tworze admina");
      this.authenticationService.registerAdmin(registerData).subscribe(success => {
        if (success) {
          window.location.replace('/confirm');
        } else {
          this.isServerErrorAlert = true;
        }
      })
    }
  }

  validForm() : void {
    this.isNotCompletedFormAlert = false;
    this.isValidName = false;
    this.isValidSurnameName = false;
    this.isEmailNotCorrect = false;
    this.isNotEnoughLongPassword = false;
    this.isNotMatchPasswordsAlert = false;
    this.isServerErrorAlert = false;
    this.isSomethingWrong = false;

    if((this.dataForm.get('name')?.value as String).match(/\d+/g)){
      this.isValidName = true;
      this.isSomethingWrong = true;
    } 
    if((this.dataForm.get('surname')?.value as String).match(/\d+/g)){
    this.isValidSurnameName = true;
    this.isSomethingWrong = true;
    }
    if(this.dataForm.get('password')?.value.length < 5){
      this.isNotEnoughLongPassword = true;
      this.isSomethingWrong = true;
    }
    if(!this.regexp.test(this.dataForm.get('email')?.value)){
      this.isEmailNotCorrect = true;
      this.isSomethingWrong = true;
    }
    if (!this.dataForm.valid) {
      this.isNotCompletedFormAlert = true;
      this.isSomethingWrong = true;
    }
    if (this.dataForm.get('password')?.value !== this.dataForm.get('confirmPassword')?.value) {
      this.isNotMatchPasswordsAlert = true; 
      this.isSomethingWrong = true;
    } 
  }

}