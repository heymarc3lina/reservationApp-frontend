import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingFlightComponent } from './adding-flight.component';

describe('AddingFlightComponent', () => {
  let component: AddingFlightComponent;
  let fixture: ComponentFixture<AddingFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
