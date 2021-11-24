import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmRegistrationComponentComponent } from './confirm-registration-component/confirm-registration-component.component';
import { ConfirmReservationComponent } from './confirm-reservation/confirm-reservation.component';
import { FlightsComponent } from './flights/flights.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AuthGuardService } from './service/auth-guard.service';
import { FlightService } from './service/flight.service';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'flights', pathMatch: 'full' },
  { path: 'flights', component: FlightsComponent },
  { path: 'confirm', component: ConfirmRegistrationComponentComponent},
  { path: 'reservationConfirm', component: ConfirmReservationComponent},
  { path: 'flights/:flightId', component: ReservationComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
