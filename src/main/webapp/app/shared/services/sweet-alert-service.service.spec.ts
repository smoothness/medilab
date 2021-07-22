import { TestBed } from '@angular/core/testing';

import { SweetAlertServiceService } from './sweet-alert-service.service';

describe('SweetAlertServiceService', () => {
  let service: SweetAlertServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetAlertServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
