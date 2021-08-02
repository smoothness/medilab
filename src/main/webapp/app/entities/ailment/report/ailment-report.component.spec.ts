import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AilmentReportComponent } from './ailment-report.component';

describe('AilmentReportComponent', () => {
  let component: AilmentReportComponent;
  let fixture: ComponentFixture<AilmentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AilmentReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AilmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
