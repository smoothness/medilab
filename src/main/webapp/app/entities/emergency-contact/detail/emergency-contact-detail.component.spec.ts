import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmergencyContactDetailComponent } from './emergency-contact-detail.component';

describe('Component Tests', () => {
  describe('EmergencyContact Management Detail Component', () => {
    let comp: EmergencyContactDetailComponent;
    let fixture: ComponentFixture<EmergencyContactDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EmergencyContactDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ emergencyContact: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EmergencyContactDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmergencyContactDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load emergencyContact on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.emergencyContact).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
