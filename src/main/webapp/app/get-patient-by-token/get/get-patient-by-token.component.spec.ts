import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPatientByTokenComponent } from './get-patient-by-token.component';

describe('GetPatientByTokenComponent', () => {
  let component: GetPatientByTokenComponent;
  let fixture: ComponentFixture<GetPatientByTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetPatientByTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetPatientByTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
