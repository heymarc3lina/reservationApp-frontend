import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { FlightStatus, FlightModel, FlightService , FlightWithStatuses, Role, StatusChange} from '../service/flight.service';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit, OnDestroy {
  available = "AVAILABLE"
  reservationActive = true;
  listOfFlights: Array<FlightModel> = [];
  listOfAllFlights: Array<FlightWithStatuses> = [];
  whoIsIt:  Role | undefined;
  statusChange: StatusChange | undefined;
  isLogged = true;
  isNotAuthorized = false;
  isManager : Boolean | undefined;
  isAdmin = false;
  succesfullyCChanged: boolean | undefined;

  listOfArrivalAirports: Array<String> = [];
  listOfDepartureAirports: Array<String> = [];

  filteredListOfFlights: Array<FlightModel> = [];
  filteredListOfAllFlights: Array<FlightWithStatuses> = [];

  dataForms: FormGroup = new FormGroup({});

  maxPriceSubscription: Subscription | undefined;
  minPriceSubscription: Subscription | undefined;
  arrivalAirportSubscription: Subscription | undefined;
  departureAirportSubscription: Subscription | undefined;
  dateSubscription: Subscription | undefined;
  formChangesSubscription: Subscription | undefined;

  maxPrice = 0;
  minPrice = 0;
  defaultOption = "Wszystkie";
  URL = "flights/";
  EDIT_URL = "flights/edit/";

  numberOfReadyFlights = 0;
  dataLoaded = false;
  

  constructor(private flightService: FlightService, private fb: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.dataForms = this.fb.group({
      date: "mm/dd/yyyy",
      minPrice: [0],
      maxPrice: [this.maxPrice],
      inputArrivalAirports: [this.listOfArrivalAirports[0] || ''],
      inputDepartureAirports: [this.listOfDepartureAirports[0] || '']
    });
  }

  ngOnInit(): void {
    this.getAllFlights();
  }

  getAllFlights(): void {
    this.dataLoaded = false;
    this.numberOfReadyFlights = 0;
    this.isManager = false;
    this.isAdmin = false;
    if(this.authService.isLoged()){
      this.flightService.whoIsIt().subscribe(who=>{
        console.log(who.role);
        if(who.role == "USER" || who.role == "ADMIN"){
          if(who.role === "ADMIN"){
            this.isAdmin = true;
          }  
         this.flightsForUser();
        }else if(who.role == "MANAGER") {
          this.isManager = true;
         console.log("manager");
         this.flightsForManager();
        }
       });
    }else{
      this.flightsForUser();
    }
    
    this.dataLoaded = true;
  };

flightsForUser() : void{
  this.flightService.getAllFlights().subscribe(flights => {
  flights?.forEach(flight => {
    if (flight.flightStatus == this.available) {
      flight.flightStatus = "Dostępny";
      flight.isReservationActive = true;
    } else {
      flight.flightStatus = "Pełny"
      flight.isReservationActive = false;
    }
    this.listOfFlights.push(flight);
    this.numberOfReadyFlights++;
  });
  if (this.numberOfReadyFlights > flights.length - 2) {
    this.prepareForms();
  }
});
}

flightsForManager() : void{
  this.flightService.getAllExistingFlights().subscribe(flights => {
  flights?.forEach(flight => {
   this.translateStatus(flight);
    this.listOfAllFlights.push(flight);
    this.numberOfReadyFlights++;
  });
  if (this.numberOfReadyFlights > flights.length - 2) {
    this.prepareFormsForManager();
  }
});
}
  prepareForms(): void {
    this.listOfArrivalAirports.push(this.defaultOption);
    this.listOfDepartureAirports.push(this.defaultOption);
    this.listOfFlights.forEach(flight => {
      if (flight.minPrice > this.maxPrice) {
        this.maxPrice = flight.minPrice;
      }
      if (!this.listOfArrivalAirports.includes(flight.arrivalAirports)) {
        this.listOfArrivalAirports.push(flight.arrivalAirports);
      }
      if (!this.listOfDepartureAirports.includes(flight.departureAirports)) {
        this.listOfDepartureAirports.push(flight.departureAirports);
      }
    });

    this.dataForms = this.fb.group({
      date: ['' || Validators.required],
      minPrice: [0],
      maxPrice: [this.maxPrice],
      inputArrivalAirports: [this.listOfArrivalAirports[0] || ''],
      inputDepartureAirports: [this.listOfDepartureAirports[0] || '']
    });

    this.setFormsSubscriptions();
    this.filterFlights();
  }

  translateStatus(flight :FlightWithStatuses): void {
    if(flight.flightDto.flightStatus === "NEW"){
      flight.flightDto.flightStatus = "Nowy";
       flight.flightDto.isNewStatus = true;
     }
     else{
       if(flight.flightDto.flightStatus === 	"AVAILABLE"){
        flight.flightDto.flightStatus = "Dostępny";
       }
       if(flight.flightDto.flightStatus === 	"OVERDATE"){
        flight.flightDto.flightStatus = "Zakończony";
       }
       if(flight.flightDto.flightStatus === 	"FULL"){
        flight.flightDto.flightStatus = "Pełny";
       }
       if(flight.flightDto.flightStatus === 	"CANCELLED"){
        flight.flightDto.flightStatus = "Anulowany";
       }
      flight.flightDto.isNewStatus = false;
     }

  }

  prepareFormsForManager(): void {
    this.listOfArrivalAirports.push(this.defaultOption);
    this.listOfDepartureAirports.push(this.defaultOption);
    this.listOfAllFlights.forEach(flight => {
      if (flight.flightDto.minPrice > this.maxPrice) {
        this.maxPrice = flight.flightDto.minPrice;
      }
      if (!this.listOfArrivalAirports.includes(flight.flightDto.arrivalAirports)) {
        this.listOfArrivalAirports.push(flight.flightDto.arrivalAirports);
      }
      if (!this.listOfDepartureAirports.includes(flight.flightDto.departureAirports)) {
        this.listOfDepartureAirports.push(flight.flightDto.departureAirports);
      }
    });

    this.dataForms = this.fb.group({
      date: ['' || Validators.required],
      minPrice: [0],
      maxPrice: [this.maxPrice],
      inputArrivalAirports: [this.listOfArrivalAirports[0] || ''],
      inputDepartureAirports: [this.listOfDepartureAirports[0] || '']
    });

    this.setFormsSubscriptions();
    this.filterFlightsForManager();
  }

  setFormsSubscriptions(): void {

    this.maxPriceSubscription = this.dataForms.get('maxPrice')?.valueChanges.subscribe(newValue => {
      if (!newValue) {
        this.dataForms.get('maxPrice')?.setValue(this.maxPrice);
      }
    });

    this.formChangesSubscription = this.dataForms.valueChanges.subscribe(changedValue => {
      if(this.isManager){
        this.filterFlightsForManager();
      }else{
        this.filterFlights();
      }
      

    });
  }

  reservationClick(flightId: number): void{
    this.isNotAuthorized = false;
    if(this.isAdmin){
      this.isNotAuthorized = true;
    }else{
    if(this.authService.isLoged()){
      window.location.replace(this.URL+flightId);
      this.isLogged = true;
      
    }else {
      this.isLogged = false;
    }
  }
    
    
  }

  editionClick(flightId: number): void{
   console.log("edition click");
    if(this.authService.isLoged()){
      window.location.replace(this.EDIT_URL+flightId);
      this.isLogged = true;
      
    }else {
      this.isLogged = false;
    }
    
    
  }

  flightStatusChangeClick(flightId: number, status: FlightStatus ): void{
    this.statusChange = new StatusChange(flightId, status);
    console.log( this.statusChange);
    this.flightService.changeFlightStatus(this.statusChange).subscribe(response =>{
      if(response){
          this.succesfullyCChanged = true;
          window.location.reload();
      }
    });
  }
  

  unsubscribeForms(): void {
    this.maxPriceSubscription?.unsubscribe();
    this.minPriceSubscription?.unsubscribe();
    this.departureAirportSubscription?.unsubscribe();
    this.arrivalAirportSubscription?.unsubscribe();
    this.formChangesSubscription?.unsubscribe();
    this.dateSubscription?.unsubscribe();
  }

  filterFlights(): void {
    console.log("filter flights");
    this.dataLoaded = false;
    var isDate = (this.dataForms.get('date')?.value as Date) instanceof Date;

    if (isDate) {
      this.filteredListOfFlights = this.listOfFlights.filter(flight => {
        if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.compareDate(flight.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value != this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputDepartureAirports')?.value == flight.departureAirports
            && this.compareDate(flight.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value != this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.arrivalAirports
            && this.compareDate(flight.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        } else {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.arrivalAirports && this.dataForms.get('inputDepartureAirports')?.value == flight.departureAirports
            && this.compareDate(flight.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        }
      });
    }
    else {
      this.filteredListOfFlights = this.listOfFlights.filter(flight => {
        if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value != this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputDepartureAirports')?.value == flight.departureAirports;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value != this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.arrivalAirports;
        } else {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.arrivalAirports && this.dataForms.get('inputDepartureAirports')?.value == flight.departureAirports;
        }
      });
    }
    // console.log((this.dataForms.get('date')?.value as Date).toLocaleString());
    console.log(this.dataLoaded);
    this.dataLoaded = true;
    console.log(this.dataLoaded);
  }

  filterFlightsForManager(): void {
    console.log("filter flights");
    this.dataLoaded = false;
    var isDate = (this.dataForms.get('date')?.value as Date) instanceof Date;

    if (isDate) {
      this.filteredListOfAllFlights = this.listOfAllFlights.filter(flight => {
        if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.compareDate(flight.flightDto.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value != this.defaultOption) {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputDepartureAirports')?.value == flight.flightDto.departureAirports
            && this.compareDate(flight.flightDto.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value != this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.flightDto.arrivalAirports
            && this.compareDate(flight.flightDto.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        } else {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.flightDto.arrivalAirports
            && this.dataForms.get('inputDepartureAirports')?.value == flight.flightDto.departureAirports
            && this.compareDate(flight.flightDto.departureDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        }
      });
    }
    else {
      this.filteredListOfAllFlights = this.listOfAllFlights.filter(flight => {
        if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value != this.defaultOption) {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputDepartureAirports')?.value == flight.flightDto.departureAirports;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value != this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.flightDto.arrivalAirports;
        } else {
          return flight.flightDto.minPrice >= this.dataForms.get('minPrice')?.value && flight.flightDto.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.flightDto.arrivalAirports 
            && this.dataForms.get('inputDepartureAirports')?.value == flight.flightDto.departureAirports;
        }
      });
    }
    // console.log((this.dataForms.get('date')?.value as Date).toLocaleString());
    console.log(this.dataLoaded);
    this.dataLoaded = true;
    console.log(this.dataLoaded);
  }

  compareDate(firstDate: String, secondDate: String): boolean {
    let splitted = firstDate.split(" ", 1);
    let splitted1 = secondDate.split(",", 1);
    if (splitted1.toString() === splitted.toString()) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    this.unsubscribeForms();
  }

}