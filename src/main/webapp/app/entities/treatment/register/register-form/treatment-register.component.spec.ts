import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentRegisterComponent } from './treatment-register.component';

describe('TreatmentRegisterComponent', () => {
  let component: TreatmentRegisterComponent;
  let fixture: ComponentFixture<TreatmentRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
