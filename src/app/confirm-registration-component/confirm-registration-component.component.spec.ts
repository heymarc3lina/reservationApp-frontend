import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRegistrationComponentComponent } from './confirm-registration-component.component';

describe('ConfirmRegistrationComponentComponent', () => {
  let component: ConfirmRegistrationComponentComponent;
  let fixture: ComponentFixture<ConfirmRegistrationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRegistrationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRegistrationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
