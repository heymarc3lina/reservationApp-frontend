import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, loginModel } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  dataForm: FormGroup;
  isInvalidInputsAlert = false;
  isFailedLoginAlert = false;

  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder, private router: Router) {
    this.dataForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isInvalidInputsAlert = false;
    this.isFailedLoginAlert = false;

    if (!this.dataForm.valid) {
      this.isInvalidInputsAlert = true;
    } else {
      const loginData: loginModel = {
        email: this.dataForm.get('email')?.value,
        password: this.dataForm.get('password')?.value
      };
      this.authenticationService.login(loginData).subscribe(success => {
        if (success) {
          window.location.replace('/flights');
        } else {
          this.isFailedLoginAlert = true;
        }
      })
    }
  }

}