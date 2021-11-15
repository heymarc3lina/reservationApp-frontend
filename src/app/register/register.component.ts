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
    this.isNotMatchPasswordsAlert = false;
    this.isServerErrorAlert = false;
    if((this.dataForm.get('name')?.value as String).match(/\d+/g)){
      this.isValidName = true;
    } 
    if((this.dataForm.get('surname')?.value as String).match(/\d+/g)){
    this.isValidSurnameName = true;
    }
    if (!this.dataForm.valid) {
      this.isNotCompletedFormAlert = true;
    } else if (this.dataForm.get('password')?.value !== this.dataForm.get('confirmPassword')?.value) {
      this.isNotMatchPasswordsAlert = true;
    } else {
      const registerData: registerModel = {
        email: this.dataForm.get('email')?.value,
        name: this.dataForm.get('name')?.value,
        surname: this.dataForm.get('surname')?.value,
        password: this.dataForm.get('password')?.value
      };
      this.authenticationService.register(registerData).subscribe(success => {
        if (success) {
          window.location.replace('/login');
        } else {
          this.isServerErrorAlert = true;
        }
      })
    }

  }

}