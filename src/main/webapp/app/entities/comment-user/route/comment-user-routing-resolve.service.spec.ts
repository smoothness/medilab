jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICommentUser, CommentUser } from '../comment-user.model';
import { CommentUserService } from '../service/comment-user.service';

import { CommentUserRoutingResolveService } from './comment-user-routing-resolve.service';

describe('Service Tests', () => {
  describe('CommentUser routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CommentUserRoutingResolveService;
    let service: CommentUserService;
    let resultCommentUser: ICommentUser | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CommentUserRoutingResolveService);
      service = TestBed.inject(CommentUserService);
      resultCommentUser = undefined;
    });

    describe('resolve', () => {
      it('should return ICommentUser returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommentUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCommentUser).toEqual({ id: 123 });
      });

      it('should return new ICommentUser if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommentUser = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCommentUser).toEqual(new CommentUser());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CommentUser })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCommentUser = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCommentUser).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
