import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddingFlightService } from '../service/adding-flight.service';
import { AuthenticationService } from '../service/authentication.service';
import { AirportAndPlane, EditFlightData, Plane } from '../service/edit-flight.service';

@Component({
  selector: 'app-adding-flight',
  templateUrl: './adding-flight.component.html',
  styleUrls: ['./adding-flight.component.css']
})
export class AddingFlightComponent implements OnInit {
 airportAndPlanes: AirportAndPlane |undefined;
 dataLoaded = false;
 dataForms: FormGroup = new FormGroup({});
  price = 0;
  listOfArrivalAirports: Array<String> = [];
  listOfDepartureAirports: Array<String> = [];
  listOfPlane : Array<String> = [];
  arrivalDate: Date | undefined;
  departureDate: Date | undefined;
  arrivalAirport: String | undefined;
  departureAirport: String | undefined;
  plane: String | undefined;
  seatQuantity = 0;
  status: string | undefined;

  
  isServerErrorAlert = false;
  isNotValidHourDeparture = false;
  isNotValidHourArrival = false;
  isNotValidDateDeparture = false;
  isNotValidDateArrival = false;
  isNotValidPrice = false;
  isSomethingWrong = false;
  isNotValidAirports= false;
  isEmptyHourDeparture = false;
  isEmptyHourArrival = false;
  isNotValidDataDeparture=false;
  isNotValidDataArrival=false;
  succesfullyCreatingFlight = false;

  priceSubscription: Subscription | undefined;
  arrivalAirportSubscription: Subscription | undefined;
  departureAirportSubscription: Subscription | undefined;
  planeSubscription: Subscription | undefined;
  arrivalDateSubscription: Subscription | undefined;
  departureDateSubscription: Subscription | undefined;
  formChangesSubscription: Subscription | undefined;
 
  regexTime = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  constructor(private addFlightService: AddingFlightService, private router: Router, private authService: AuthenticationService,  private fb: FormBuilder) {
    this.dataForms = this.fb.group({
      dateArrival: ['' || Validators.required],
      dateDeparture: ['' || Validators.required],
      price: [this.price],
      inputArrivalAirports: [this.listOfArrivalAirports[0] || ''],
      inputPlane: [this.listOfPlane[0] || ''],
      inputDepartureAirports: [this.listOfDepartureAirports[0] || ''],
      timeDeparture: ['', Validators.required],
      timeArrival: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.addFlightService.getDataToCreateFlight().subscribe(airportAndPlanesDto =>{
      this.airportAndPlanes  = airportAndPlanesDto;
      this.dataLoaded = true;
      this.prepareFormsForManager(this.airportAndPlanes );
      console.log(this.airportAndPlanes);
    });
  }
  prepareFormsForManager(dataToCreateFlight:AirportAndPlane ): void {

    dataToCreateFlight.airportList.forEach(
      aiport =>{ 
        this.listOfArrivalAirports.push(aiport.city);
        this.listOfDepartureAirports.push(aiport.city);
      }
    );

    dataToCreateFlight.planeList.forEach(
      plane =>{ 
        this.listOfPlane.push(plane.name);
        if(this.listOfPlane.length == 1){
          this.seatQuantity = plane.place;
        }
      }
    );

    this.dataForms = this.fb.group({
      dateArrival: ['' || Validators.required],
      dateDeparture: ['' || Validators.required],
      timeDeparture: ['', Validators.required],
      timeArrival: ['', Validators.required],
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
        this.airportAndPlanes?.planeList.forEach(plane => {
            if(plane.name ===this.dataForms.get('inputPlane')?.value ){
              this.seatQuantity = plane.place;
            }
        });
      }

    });
  }

  unsubscribeForms(): void {
    this.planeSubscription?.unsubscribe();
    this.departureAirportSubscription?.unsubscribe();
    this.arrivalAirportSubscription?.unsubscribe();
    this.formChangesSubscription?.unsubscribe();
    this.arrivalDateSubscription?.unsubscribe();
    this.departureDateSubscription?.unsubscribe();
  }


  onSubmit(): void {
    this.isNotValidDateArrival = false;
    this.isNotValidDateDeparture = false;
    this.isNotValidHourArrival = false;
    this.isNotValidHourDeparture = false;
    this.isNotValidPrice = false;
    this.isServerErrorAlert = false;
    this.isSomethingWrong = false;
    this.isNotValidAirports= false;
    this.isEmptyHourDeparture = false;
    this.isEmptyHourArrival = false;
    this.isNotValidDataDeparture = false;
    this.isNotValidDataArrival = false;

    this.validData();

    if(!this.isSomethingWrong){  
      const flightModel : EditFlightData ={
        arrivalAirport: (this.dataForms.get('inputArrivalAirports')?.value),
        arrivalDate: this.dataForms.get('dateArrival')?.value,
        departureAirport: (this.dataForms.get('inputDepartureAirports')?.value),
        departureDate: this.dataForms.get('dateDeparture')?.value ,
        price: (this.dataForms.get('price')?.value),
        plain: (this.dataForms.get('inputPlane')?.value)
  };
  console.log(flightModel);
  this.addFlightService.createFlight( flightModel ).subscribe(response =>{
    console.log(response);
    if(response){
        this.succesfullyCreatingFlight = true;
        window.location.replace("/");
    }
  });
  }
}


validData() :void{
  if((this.dataForms.get('price')?.value as number) < 1){
    this.isNotValidPrice = true;
    this.isSomethingWrong = true;
  } 
  if((this.dataForms.get('timeDeparture')?.value) === ""){
    this.isEmptyHourDeparture = true;
    this.isSomethingWrong = true;
  }
  else{
    if(!this.regexTime.test(this.dataForms.get('timeDeparture')?.value)){
    this.isNotValidHourDeparture = true;
    this.isSomethingWrong = true;
    }
  } 
  if((this.dataForms.get('timeArrival')?.value) === ""){
    this.isEmptyHourArrival = true;
    this.isSomethingWrong = true;
  }
  else{
    if(!this.regexTime.test(this.dataForms.get('timeArrival')?.value)){
      this.isNotValidHourArrival = true;
      this.isSomethingWrong = true;
    }
  }
  if(this.dataForms.get('inputDepartureAirports')?.value === this.dataForms.get('inputArrivalAirports')?.value){
    this.isNotValidAirports = true;
    this.isSomethingWrong = true;
  }

  if(!((this.dataForms.get('dateDeparture')?.value as Date  )instanceof Date)){
    console.log("Brak daty");
    this.isNotValidDataDeparture = true;
    this.isSomethingWrong = true;
  }else{
    var dateToEdit = (this.dataForms.get('dateDeparture')?.value as Date).toLocaleString();
    console.log("sprawdzam date")
    if((this.dataForms.get('timeDeparture')?.value) !== ""){
      if(dateToEdit.split(".", 1)[0].length === 1){
        console.log("0"+dateToEdit.split(",", 1)[0] +" " + this.dataForms.get('timeDeparture')?.value);
        this.dataForms.get('dateDeparture')?.setValue("0"+dateToEdit.split(",", 1)[0] +" " + this.dataForms.get('timeDeparture')?.value)
      }else{
      console.log(dateToEdit.split(",", 1)[0]+" " + this.dataForms.get('timeDeparture')?.value);
      this.dataForms.get('dateDeparture')?.setValue(dateToEdit.split(",", 1)[0] + " " + this.dataForms.get('timeDeparture')?.value)
      }
    }
  }

  if(!((this.dataForms.get('dateArrival')?.value as Date  )instanceof Date)){
    console.log("Brak daty");
    this.isNotValidDataArrival = true;
    this.isSomethingWrong = true;
  }else{
    var dateToEdit = (this.dataForms.get('dateArrival')?.value as Date).toLocaleString();
    if((this.dataForms.get('timeArrival')?.value) !== ""){
      if(dateToEdit.split(".", 1)[0].length === 1){
        console.log("0"+dateToEdit.split(",", 1)[0] +" " + this.dataForms.get('timeArrival')?.value);
        this.dataForms.get('dateArrival')?.setValue("0"+dateToEdit.split(",", 1)[0] +" " + this.dataForms.get('timeArrival')?.value)
      }else{
      console.log(dateToEdit.split(",", 1)[0]+" " + this.dataForms.get('timeArrival')?.value);
      this.dataForms.get('dateArrival')?.setValue(dateToEdit.split(",", 1)[0] + " " + this.dataForms.get('timeArrival')?.value)
      }
    }
  }
}
}
