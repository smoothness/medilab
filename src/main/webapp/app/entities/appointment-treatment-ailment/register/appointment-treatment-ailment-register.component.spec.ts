import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentTreatmentAilmentRegisterComponent } from './appointment-treatment-ailment-register.component';

describe('AppointmentTreatmentAilmentRegisterComponent', () => {
  let component: AppointmentTreatmentAilmentRegisterComponent;
  let fixture: ComponentFixture<AppointmentTreatmentAilmentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentTreatmentAilmentRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentTreatmentAilmentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
