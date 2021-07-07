import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EmergencyContactService } from '../service/emergency-contact.service';

import { EmergencyContactComponent } from './emergency-contact.component';

describe('Component Tests', () => {
  describe('EmergencyContact Management Component', () => {
    let comp: EmergencyContactComponent;
    let fixture: ComponentFixture<EmergencyContactComponent>;
    let service: EmergencyContactService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmergencyContactComponent],
      })
        .overrideTemplate(EmergencyContactComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmergencyContactComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EmergencyContactService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.emergencyContacts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
