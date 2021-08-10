import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientByTokenComponent } from './view-patient-by-token.component';

describe('ViewPatientByTokenComponent', () => {
  let component: ViewPatientByTokenComponent;
  let fixture: ComponentFixture<ViewPatientByTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPatientByTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientByTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
