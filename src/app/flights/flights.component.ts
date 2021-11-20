import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {FlightModel, FlightService } from '../service/flight.service';


@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit, OnDestroy {


  listOfFlights: Array<FlightModel> = [];

  filteredListOfFlights: Array<FlightModel> = [];
  
  dataForms: FormGroup = new FormGroup({});

  maxPriceSubscription: Subscription | undefined;
  formChangesSubscription: Subscription | undefined;

  maxPrice = 0;

  dataLoaded = false;

  constructor(private flightService: FlightService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.flightService.getAllFlights().subscribe(flights => {
        this.listOfFlights = flights;
      // flights?.forEach(flight => {
      //   this.listOfFlights.push(flight);
        //   if (numberOfReadyProducts > flights.length - 2) {
            // this.prepareForms();
        //   }
        
        });
      // });
    };
  

  prepareForms(): void {
    this.listOfFlights.forEach(flight => {
      if (flight.minPrice > this.maxPrice) {
        this.maxPrice = flight.minPrice;
      }
    });
    this.dataForms = this.fb.group({
      minPrice: [0],
      maxPrice: [this.maxPrice]
    });

    this.setFormsSubscriptions();
    this.filterProducts();
  }

  setFormsSubscriptions(): void {
    // this.minPriceSubscription = this.priceForm.get('minPrice')?.valueChanges.subscribe(minValue => {
    //   this.filterProducts();
    // });

    // this.maxPriceSubscription = this.priceForm.get('maxPrice')?.valueChanges.subscribe(maxValue => {
    //   this.filterProducts();
    // });

    this.maxPriceSubscription = this.dataForms.get('maxPrice')?.valueChanges.subscribe(newValue => {
      if (!newValue) {
        this.dataForms.get('maxPrice')?.setValue(this.maxPrice);
      }
    })

    this.formChangesSubscription = this.dataForms.valueChanges.subscribe(changedValue => {
      this.filterProducts();
    })
  }

  unsubscribeForms(): void {
    this.maxPriceSubscription?.unsubscribe();
    this.formChangesSubscription?.unsubscribe();
  }

  filterProducts(): void {
    this.filteredListOfFlights = this.listOfFlights.filter(flight => {
      return flight.minPrice >= this.dataForms.get('minPrice')?.value && flight.minPrice <= this.dataForms.get('maxPrice')?.value ;
    });
    console.log(this.dataLoaded);
    this.dataLoaded = true;
    console.log(this.dataLoaded);
  }

  ngOnDestroy(): void {
    this.unsubscribeForms();
  }

}