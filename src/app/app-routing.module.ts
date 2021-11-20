import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmReservationComponent } from './confirm-reservation/confirm-reservation.component';
import { FlightsComponent } from './flights/flights.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FlightService } from './service/flight.service';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'flights', component: FlightsComponent },
  { path: 'confirm', component: ConfirmReservationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    MatToolbarModule],
  exports: [RouterModule,
    MatToolbarModule]
})
export class AppRoutingModule { }