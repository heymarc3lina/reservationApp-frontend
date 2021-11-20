import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, registerModel } from '../service/authentication.service';
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
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { 
    this.dataForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
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
    } if( !this.isSomethingWrong){
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

}