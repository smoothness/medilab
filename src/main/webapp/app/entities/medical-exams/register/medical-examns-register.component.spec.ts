import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalExamnsRegisterComponent } from './medical-examns-register.component';

describe('RegisterComponent', () => {
  let component: MedicalExamnsRegisterComponent;
  let fixture: ComponentFixture<MedicalExamnsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalExamnsRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalExamnsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
