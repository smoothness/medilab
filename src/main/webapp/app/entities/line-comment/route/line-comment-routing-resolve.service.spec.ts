jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILineComment, LineComment } from '../line-comment.model';
import { LineCommentService } from '../service/line-comment.service';

import { LineCommentRoutingResolveService } from './line-comment-routing-resolve.service';

describe('Service Tests', () => {
  describe('LineComment routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LineCommentRoutingResolveService;
    let service: LineCommentService;
    let resultLineComment: ILineComment | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LineCommentRoutingResolveService);
      service = TestBed.inject(LineCommentService);
      resultLineComment = undefined;
    });

    describe('resolve', () => {
      it('should return ILineComment returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLineComment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLineComment).toEqual({ id: 123 });
      });

      it('should return new ILineComment if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLineComment = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLineComment).toEqual(new LineComment());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LineComment })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLineComment = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLineComment).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
