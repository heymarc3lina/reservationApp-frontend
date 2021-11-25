import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { DataToPrepareReservation, FlightModel, FlightService } from '../service/flight.service';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit, OnDestroy {
  available = "AVAILABLE"
  reservationActive = true;
  listOfFlights: Array<FlightModel> = [];
  listOfFlights1: Array<FlightModel> = [];
  isLogged =true;

  listOfArrivalAirports: Array<String> = [];
  listOfDepartureAirports: Array<String> = [];

  filteredListOfFlights: Array<FlightModel> = [];

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

  numberOfReadyFlights = 0;
  dataLoaded = false;

  constructor(private flightService: FlightService, private fb: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.dataForms = this.fb.group({
      // date: [''||   Validators.required
      // ], 
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
      // flights?.forEach(flight => {
      //   if(flight.flightStatus == )
      //   this.listOfFlights.push(flight);
      //     // if (numberOfReadyProducts > flights.length - 2) {
      //     //   this.prepareForms();
      //     }

      //   });
    });
  
    this.dataLoaded = true;
  };


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

  setFormsSubscriptions(): void {

    this.maxPriceSubscription = this.dataForms.get('maxPrice')?.valueChanges.subscribe(newValue => {
      if (!newValue) {
        this.dataForms.get('maxPrice')?.setValue(this.maxPrice);
      }
    });

    // this.formChangesSubscription = this.dataForms.valueChanges.subscribe(changedValue => {
    //   this.filterFlights();

    // });
  }

  reservationClick(flightId: number): void{
    if(this.authService.isLoged()){
      window.location.replace(this.URL+flightId);
      this.isLogged = true;
      
    }else {
      this.isLogged = false;
    }
    
    
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
    this.dataLoaded = false;
    var isDate = (this.dataForms.get('date')?.value as Date) instanceof Date;

    if (isDate) {
      this.filteredListOfFlights = this.listOfFlights.filter(flight => {
        if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.compareDate(flight.arrivalDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value == this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value != this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputDepartureAirports')?.value == flight.departureAirports
            && this.compareDate(flight.arrivalDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        }
        else if (this.dataForms.get('inputArrivalAirports')?.value != this.defaultOption && this.dataForms.get('inputDepartureAirports')?.value == this.defaultOption) {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.arrivalAirports
            && this.compareDate(flight.arrivalDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
        } else {
          return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value
            && this.dataForms.get('inputArrivalAirports')?.value == flight.arrivalAirports && this.dataForms.get('inputDepartureAirports')?.value == flight.departureAirports
            && this.compareDate(flight.arrivalDate.toLocaleString(), (this.dataForms.get('date')?.value as Date).toLocaleString());;
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