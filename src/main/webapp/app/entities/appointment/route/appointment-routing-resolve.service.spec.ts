jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAppointment, Appointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';

import { AppointmentRoutingResolveService } from './appointment-routing-resolve.service';

describe('Service Tests', () => {
  describe('Appointment routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AppointmentRoutingResolveService;
    let service: AppointmentService;
    let resultAppointment: IAppointment | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AppointmentRoutingResolveService);
      service = TestBed.inject(AppointmentService);
      resultAppointment = undefined;
    });

    describe('resolve', () => {
      it('should return IAppointment returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAppointment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAppointment).toEqual({ id: 123 });
      });

      it('should return new IAppointment if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAppointment = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAppointment).toEqual(new Appointment());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Appointment })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAppointment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAppointment).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
