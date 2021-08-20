import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAppointmentComponent } from './register-appointment.component';

describe('RegisterAppointmentComponent', () => {
  let component: RegisterAppointmentComponent;
  let fixture: ComponentFixture<RegisterAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAppointmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
