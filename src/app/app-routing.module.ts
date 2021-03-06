import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddingFlightComponent } from './adding-flight/adding-flight.component';
import { AllUserReservationListComponent } from './all-user-reservation-list/all-user-reservation-list.component';
import { ConfirmRegistrationComponentComponent } from './confirm-registration-component/confirm-registration-component.component';
import { ConfirmReservationComponent } from './confirm-reservation/confirm-reservation.component';
import { EditFlightComponent } from './edit-flight/edit-flight.component';
import { FlightsComponent } from './flights/flights.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UserReservationListComponent } from './user-reservation-list/user-reservation-list.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'flights', pathMatch: 'full' },
  { path: 'flights', component: FlightsComponent },
  { path: 'confirm', component: ConfirmRegistrationComponentComponent},
  { path: 'reservationConfirm', component: ConfirmReservationComponent, canActivate: [AuthGuardService]},
  { path: 'flights/:flightId', component: ReservationComponent, canActivate: [AuthGuardService]},
  {path:  'myReservation', component: UserReservationListComponent, canActivate: [AuthGuardService]}, 
  {path:  'allReservation', component: AllUserReservationListComponent, canActivate: [AuthGuardService]},
  {path:  'flights/edit/:flightId', component: EditFlightComponent, canActivate: [AuthGuardService]},
  {path:  'users', component: UserComponent, canActivate: [AuthGuardService]},
  {path:  'createFlight', component: AddingFlightComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
