import { TestBed } from '@angular/core/testing';

import { AddingFlightService } from './adding-flight.service';

describe('AddingFlightService', () => {
  let service: AddingFlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddingFlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
