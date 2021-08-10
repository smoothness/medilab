import { TestBed } from '@angular/core/testing';

import { ViewPatientService } from './view-patient.service';

describe('ViewPatientServiceService', () => {
  let service: ViewPatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewPatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
