import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentCreateFormComponent } from './treatment-create-form.component';

describe('TreatmentCreateFormComponent', () => {
  let component: TreatmentCreateFormComponent;
  let fixture: ComponentFixture<TreatmentCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentCreateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
