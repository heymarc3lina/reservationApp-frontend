import { TestBed } from '@angular/core/testing';

import { EditFlightService } from './edit-flight.service';

describe('EditFlightService', () => {
  let service: EditFlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditFlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
