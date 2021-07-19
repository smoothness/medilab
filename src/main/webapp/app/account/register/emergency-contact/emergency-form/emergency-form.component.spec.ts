import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergenncyFormComponent } from './emergenncy-form.component';

describe('EmergenncyFormComponent', () => {
  let component: EmergenncyFormComponent;
  let fixture: ComponentFixture<EmergenncyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmergenncyFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergenncyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
