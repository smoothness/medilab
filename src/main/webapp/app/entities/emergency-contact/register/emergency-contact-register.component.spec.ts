import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyContactRegisterComponent } from './emergency-contact-register.component';

describe('RegisterComponent', () => {
  let component: EmergencyContactRegisterComponent;
  let fixture: ComponentFixture<EmergencyContactRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmergencyContactRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyContactRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
