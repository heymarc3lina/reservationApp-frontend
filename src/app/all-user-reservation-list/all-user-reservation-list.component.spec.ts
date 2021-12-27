import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserReservationListComponent } from './all-user-reservation-list.component';

describe('AllUserReservationListComponent', () => {
  let component: AllUserReservationListComponent;
  let fixture: ComponentFixture<AllUserReservationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllUserReservationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
