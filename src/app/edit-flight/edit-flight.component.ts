import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { Airport, EditFlightData, EditFlightService, Plane, UpdateFlightData } from '../service/edit-flight.service';
import { FlightModel, FlightService, FlightStatus } from '../service/flight.service';

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
 
  regexTime = new RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

 priceSubscription: Subscription | undefined;
  arrivalAirportSubscription: Subscription | undefined;
  departureAirportSubscription: Subscription | undefined;
  planeSubscription: Subscription | undefined;
  arrivalDateSubscription: Subscription | undefined;
  departureDateSubscription: Subscription | undefined;
  formChangesSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,  private authenticationService: AuthenticationService, private editFlightService : EditFlightService) {
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
     this.isUserLoged = this.authenticationService.isLoged();
    const routeParams = this.route.snapshot.paramMap;
    const flightId = Number(routeParams.get('flightId'));
    this.retriveFlight(flightId);
  }

  retriveFlight(flightId: number) : void{
    this.dataLoaded = false;
      this.editFlightService.getFlightToEdit(flightId).subscribe(flight =>{
      this.editFlight = flight;
      this.arrivalAirport = this.editFlight.flightDto.arrivalAirports;
      this.departureAirport =  this.editFlight.flightDto.departureAirports;
      this.prepareFormsForManager(this.editFlight);
      this.dataLoaded = true;
      console.log(this.editFlight);
    })

  }

  prepareFormsForManager(editFlight:UpdateFlightData ): void {

    editFlight.airportAndPlaneDto.airportList.forEach(
      aiport =>{ 
        if(aiport.city == editFlight.flightDto.arrivalAirports){
        this.listOfArrivalAirports.push(aiport.city);
        }
        if(aiport.city == editFlight.flightDto.departureAirports){
          this.listOfDepartureAirports.push(aiport.city);
          }
      }
    );

    editFlight.airportAndPlaneDto.planeList.forEach(
      plane =>{ 
        if(plane.planeId === editFlight.flightDto.planeId){
          this.plane = plane.name;
        this.listOfPlane.push(plane.name);
        }
      }
    );

    editFlight.airportAndPlaneDto.planeList.forEach(
      plane =>{ 
        if(!this.listOfPlane.includes(plane.name)){
        this.listOfPlane.push(plane.name);
        this.seatQuantity = plane.place;
        }
      }
    );
    this.price = editFlight.flightDto.minPrice;

    editFlight.airportAndPlaneDto.airportList.forEach(
      aiport =>{ 
        if (!this.listOfArrivalAirports.includes(aiport.city)) {
          this.listOfArrivalAirports.push(aiport.city);
        }
        if (!this.listOfDepartureAirports.includes(aiport.city)) {
          this.listOfDepartureAirports.push(aiport.city);
        }
      }
    );

  this.status = editFlight.flightDto.flightStatus;
  this.departureDate = editFlight.flightDto.departureDate;
  this.arrivalDate = editFlight.flightDto.arrivalDate;
  console.log(this.departureDate);

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
        this.editFlight?.airportAndPlaneDto.planeList.forEach(plane => {
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

    if((this.dataForms.get('price')?.value as number) < 1){
      this.isNotValidPrice = true;
      this.isSomethingWrong = true;
    } 
    if((this.dataForms.get('timeDeparture')?.value) !== "" && !this.regexTime.test(this.dataForms.get('timeDeparture')?.value)){
      this.isNotValidHourDeparture = true;
      this.isSomethingWrong = true;
    } 
    if((this.dataForms.get('timeArrival')?.value) !== "" && !this.regexTime.test(this.dataForms.get('timeArrival')?.value)){
      this.isNotValidHourArrival = true;
      this.isSomethingWrong = true;
    }

    if(!((this.dataForms.get('dateDeparture')?.value as Date  )instanceof Date)){
      console.log(this.departureDate);
      if((this.dataForms.get('timeDeparture')?.value) !== ""){
        console.log((this.departureDate)?.toLocaleString().split(" ", 1) + " " + this.dataForms.get('timeDeparture')?.value);
        this.dataForms.get('dateDeparture')?.setValue((this.departureDate)?.toLocaleString().split(" ", 1) + " " + this.dataForms.get('timeDeparture')?.value)
      }else{
        console.log(this.dataForms.get('dateDeparture')?.setValue(this.departureDate));
      }
    }else{
      var dateToEdit = (this.dataForms.get('dateDeparture')?.value as Date).toLocaleString();
      if((this.dataForms.get('timeDeparture')?.value) !== ""){
        console.log(dateToEdit.split(",", 1) + " " + this.dataForms.get('timeDeparture')?.value);
        this.dataForms.get('dateDeparture')?.setValue(dateToEdit.split(",", 1) + " " + this.dataForms.get('timeDeparture')?.value)
      }else{
      console.log(dateToEdit.split(",", 1) + " " + (this.departureDate)?.toLocaleString().split(" ", 2)[1]);
      this.dataForms.get('dateDeparture')?.setValue(dateToEdit.split(",", 1) + " " + (this.departureDate)?.toLocaleString().split(" ", 2)[1])
      }
    }

    if(!((this.dataForms.get('dateArrival')?.value as Date  )instanceof Date)){
      console.log(this.arrivalDate);
      
      if((this.dataForms.get('timeArrival')?.value) !== ""){
        console.log((this.arrivalDate)?.toLocaleString().split(" ", 1) + " " + this.dataForms.get('timeArrival')?.value);
        this.dataForms.get('dateArrival')?.setValue((this.arrivalDate)?.toLocaleString().split(" ", 1) + " " + this.dataForms.get('timeArrival')?.value)
      }else{
        console.log(this.dataForms.get('dateArrival')?.setValue(this.arrivalDate));
      }
    }else{
      var dateToEdit = (this.dataForms.get('dateArrival')?.value as Date).toLocaleString();
      if((this.dataForms.get('timeArrival')?.value) !== ""){
        console.log(dateToEdit.split(",", 1) + " " + this.dataForms.get('timeArrival')?.value);
        this.dataForms.get('dateArrival')?.setValue(dateToEdit.split(",", 1) + " " + this.dataForms.get('timeArrival')?.value)
      }else{
      console.log(dateToEdit.split(",", 1) + " " + (this.arrivalDate)?.toLocaleString().split(" ", 2)[1]);
      this.dataForms.get('dateArrival')?.setValue(dateToEdit.split(",", 1) + " " + (this.arrivalDate)?.toLocaleString().split(" ", 2)[1])
      }
    }
    if(!this.isSomethingWrong){  
      const flightModel : EditFlightData ={
        arrivalAirport: (this.dataForms.get('inputArrivalAirports')?.value),
        arrivalDate: this.dataForms.get('dateArrival')?.value,
        departureAirport: (this.dataForms.get('inputDepartureAirports')?.value),
        departureDate: this.dataForms.get('dateDeparture')?.value ,
        price: (this.dataForms.get('price')?.value),
        plain: (this.dataForms.get('inputPlane')?.value)
  };
  const routeParams = this.route.snapshot.paramMap;
    const flightId = Number(routeParams.get('flightId'));
  this.editFlightService.editFlight(flightModel, flightId).subscribe(success => {
    if (success) {
      window.location.replace('/');
    } else {
      this.isServerErrorAlert = true;
    }
  })
  }
}
}
