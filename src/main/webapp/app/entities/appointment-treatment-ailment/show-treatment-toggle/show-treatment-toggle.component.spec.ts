import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTreatmentToggleComponent } from './show-treatment-toggle.component';

describe('ShowTreatmentToggleComponent', () => {
  let component: ShowTreatmentToggleComponent;
  let fixture: ComponentFixture<ShowTreatmentToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowTreatmentToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTreatmentToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
