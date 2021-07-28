import { TestBed } from '@angular/core/testing';

import { SweetAlertService } from './sweet-alert.service';

describe('SweetAlertServiceService', () => {
  let service: SweetAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
