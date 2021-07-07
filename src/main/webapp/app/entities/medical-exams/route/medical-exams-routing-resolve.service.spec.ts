jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMedicalExams, MedicalExams } from '../medical-exams.model';
import { MedicalExamsService } from '../service/medical-exams.service';

import { MedicalExamsRoutingResolveService } from './medical-exams-routing-resolve.service';

describe('Service Tests', () => {
  describe('MedicalExams routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MedicalExamsRoutingResolveService;
    let service: MedicalExamsService;
    let resultMedicalExams: IMedicalExams | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MedicalExamsRoutingResolveService);
      service = TestBed.inject(MedicalExamsService);
      resultMedicalExams = undefined;
    });

    describe('resolve', () => {
      it('should return IMedicalExams returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMedicalExams = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMedicalExams).toEqual({ id: 123 });
      });

      it('should return new IMedicalExams if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMedicalExams = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMedicalExams).toEqual(new MedicalExams());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as MedicalExams })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMedicalExams = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMedicalExams).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
