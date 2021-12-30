import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthGuardService } from './service/auth-guard.service';
import { FlightsComponent } from './flights/flights.component';
import {MaterialExampleModule} from './material.modules';
// import {MatNativeDateModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ConfirmReservationComponent } from './confirm-reservation/confirm-reservation.component';
import { ConfirmRegistrationComponentComponent } from './confirm-registration-component/confirm-registration-component.component';
import { ReservationComponent } from './reservation/reservation.component';
import { UserReservationListComponent } from './user-reservation-list/user-reservation-list.component';
import { AllUserReservationListComponent } from './all-user-reservation-list/all-user-reservation-list.component';
import { AddingFlightComponent } from './adding-flight/adding-flight.component';
import { EditFlightComponent } from './edit-flight/edit-flight.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    FlightsComponent,
    ConfirmReservationComponent,
    ConfirmRegistrationComponentComponent,
    ReservationComponent,
    UserReservationListComponent,
    AllUserReservationListComponent,
    EditFlightComponent,
    AddingFlightComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    MaterialExampleModule
  ],
  exports:[],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
