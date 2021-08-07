import { TestBed } from '@angular/core/testing';

import { GetPatientByTokenService } from './get-patient-by-token.service';

describe('GetPatientByTokenService', () => {
  let service: GetPatientByTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPatientByTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
