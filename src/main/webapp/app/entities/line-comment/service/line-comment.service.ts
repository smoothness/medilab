import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILineComment, getLineCommentIdentifier } from '../line-comment.model';

export type EntityResponseType = HttpResponse<ILineComment>;
export type EntityArrayResponseType = HttpResponse<ILineComment[]>;

@Injectable({ providedIn: 'root' })
export class LineCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/line-comments');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lineComment: ILineComment): Observable<EntityResponseType> {
    return this.http.post<ILineComment>(this.resourceUrl, lineComment, { observe: 'response' });
  }

  update(lineComment: ILineComment): Observable<EntityResponseType> {
    return this.http.put<ILineComment>(`${this.resourceUrl}/${getLineCommentIdentifier(lineComment) as number}`, lineComment, {
      observe: 'response',
    });
  }

  partialUpdate(lineComment: ILineComment): Observable<EntityResponseType> {
    return this.http.patch<ILineComment>(`${this.resourceUrl}/${getLineCommentIdentifier(lineComment) as number}`, lineComment, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILineComment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILineComment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLineCommentToCollectionIfMissing(
    lineCommentCollection: ILineComment[],
    ...lineCommentsToCheck: (ILineComment | null | undefined)[]
  ): ILineComment[] {
    const lineComments: ILineComment[] = lineCommentsToCheck.filter(isPresent);
    if (lineComments.length > 0) {
      const lineCommentCollectionIdentifiers = lineCommentCollection.map(lineCommentItem => getLineCommentIdentifier(lineCommentItem)!);
      const lineCommentsToAdd = lineComments.filter(lineCommentItem => {
        const lineCommentIdentifier = getLineCommentIdentifier(lineCommentItem);
        if (lineCommentIdentifier == null || lineCommentCollectionIdentifiers.includes(lineCommentIdentifier)) {
          return false;
        }
        lineCommentCollectionIdentifiers.push(lineCommentIdentifier);
        return true;
      });
      return [...lineCommentsToAdd, ...lineCommentCollection];
    }
    return lineCommentCollection;
  }
}
