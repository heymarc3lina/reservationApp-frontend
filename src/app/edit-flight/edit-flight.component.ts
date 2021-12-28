import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { Airport, EditFlightService, Plane, UpdateFlightData } from '../service/edit-flight.service';
import { FlightStatus } from '../service/flight.service';

@Component({
  selector: 'app-edit-flight',
  templateUrl: './edit-flight.component.html',
  styleUrls: ['./edit-flight.component.css']
})
export class EditFlightComponent implements OnInit {
  isUserLoged = false;
  dataLoaded = false;
  editFlight: UpdateFlightData | undefined;
  dataForms: FormGroup = new FormGroup({});
  price = 0;
  defaultOption = "Wszystkie";
  listOfArrivalAirports: Array<Airport> = [];
  listOfDepartureAirports: Array<Airport> = [];
  listOfPlane : Array<Plane> = [];
  arrivalDate: Date | undefined;
  departureDate: Date | undefined;
  seatQuantity = 0;
  status: string | undefined;

 priceSubscription: Subscription | undefined;
  arrivalAirportSubscription: Subscription | undefined;
  departureAirportSubscription: Subscription | undefined;
  planeSubscription: Subscription | undefined;
  arrivalDateSubscription: Subscription | undefined;
  departureDateSubscription: Subscription | undefined;
  formChangesSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,  private authenticationService: AuthenticationService, private editFlightService : EditFlightService) {
    this.dataForms = this.fb.group({
      dateArrival: "mm/dd/yyyy",
      dateDeparture: "mm/dd/yyyy",
      price: [this.price],
      inputArrivalAirports: [this.listOfArrivalAirports[0] || ''],
      inputPlane: [this.listOfPlane[0] || ''],
      inputDepartureAirports: [this.listOfDepartureAirports[0] || '']
    });
   }

  ngOnInit(): void { 
     this.isUserLoged = this.authenticationService.isLoged();
    const routeParams = this.route.snapshot.paramMap;
    const flightId = Number(routeParams.get('flightId'));
    this.retriveFlight(flightId);
  }

  retriveFlight(flightId: number) : void{
    this.dataLoaded = false;
      this.editFlightService.getFlightToEdit(flightId).subscribe(flight =>{
      this.editFlight = flight;
     this.prepareFormsForManager(this.editFlight);
      this.dataLoaded = true;
      console.log(this.editFlight);
    })

  }

  prepareFormsForManager(editFlight:UpdateFlightData ): void {

    editFlight.airportAndPlaneDto.airportList.forEach(
      aiport =>{ 
        if(aiport.city == editFlight.flightDto.arrivalAirports){
        this.listOfArrivalAirports.push(aiport);
        }
        if(aiport.city == editFlight.flightDto.departureAirports){
          this.listOfDepartureAirports.push(aiport);
          }
      }
    );

    editFlight.airportAndPlaneDto.planeList.forEach(
      plane =>{ 
        if(plane.planeId === editFlight.flightDto.planeId){
        this.listOfPlane.push(plane);
        }
      }
    );

    editFlight.airportAndPlaneDto.planeList.forEach(
      plane =>{ 
        if(!this.listOfPlane.includes(plane)){
        this.listOfPlane.push(plane);
        this.seatQuantity = plane.place;
        }
      }
    );
    this.price = editFlight.flightDto.minPrice;

    editFlight.airportAndPlaneDto.airportList.forEach(
      aiport =>{ 
        if (!this.listOfArrivalAirports.includes(aiport)) {
          this.listOfArrivalAirports.push(aiport);
        }
        if (!this.listOfDepartureAirports.includes(aiport)) {
          this.listOfDepartureAirports.push(aiport);
        }
      }
    );

   this.status = editFlight.flightDto.flightStatus;
  this.departureDate = editFlight.flightDto.departureDate;
  this.arrivalDate = editFlight.flightDto.arrivalDate;
  console.log(this.departureDate);

    this.dataForms = this.fb.group({
      dateArrival: [this.arrivalDate],
      dateDeparture: [this.departureDate],
      timeDeparture: '',
      timeArrival: '',
      price: [this.price],
      inputArrivalAirports: [this.listOfArrivalAirports[0] || ''],
      inputPlane: [this.listOfPlane[0] || ''],
      inputDepartureAirports: [this.listOfDepartureAirports[0] || '']
    });

    this.setFormsSubscriptions();
    
  }


  setFormsSubscriptions(): void {

    this.priceSubscription = this.dataForms.get('price')?.valueChanges.subscribe(newValue => {
      if (!newValue) {
        this.dataForms.get('price')?.setValue(this.price);
      }
    });

    this.planeSubscription = this.dataForms.get('inputPlane')?.valueChanges.subscribe(newValue => {
      if (newValue) {
        this.listOfPlane.forEach(plane => {
            if(plane.name ===this.dataForms.get('inputPlane')?.value ){
              this.seatQuantity = plane.place;
            }
        });
      }

    });
  }

  unsubscribeForms(): void {
    this.planeSubscription?.unsubscribe();
    this.planeSubscription?.unsubscribe();
    this.departureAirportSubscription?.unsubscribe();
    this.arrivalAirportSubscription?.unsubscribe();
    this.formChangesSubscription?.unsubscribe();
    this.arrivalDateSubscription?.unsubscribe();
    this.departureDateSubscription?.unsubscribe();
  }
}
