jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IRatingUser, RatingUser } from '../rating-user.model';
import { RatingUserService } from '../service/rating-user.service';

import { RatingUserRoutingResolveService } from './rating-user-routing-resolve.service';

describe('Service Tests', () => {
  describe('RatingUser routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: RatingUserRoutingResolveService;
    let service: RatingUserService;
    let resultRatingUser: IRatingUser | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(RatingUserRoutingResolveService);
      service = TestBed.inject(RatingUserService);
      resultRatingUser = undefined;
    });

    describe('resolve', () => {
      it('should return IRatingUser returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRatingUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRatingUser).toEqual({ id: 123 });
      });

      it('should return new IRatingUser if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRatingUser = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultRatingUser).toEqual(new RatingUser());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RatingUser })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultRatingUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultRatingUser).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
