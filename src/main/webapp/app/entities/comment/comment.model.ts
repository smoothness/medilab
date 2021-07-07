import * as dayjs from 'dayjs';
import { ICommentUser } from 'app/entities/comment-user/comment-user.model';

export interface IComment {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
  commentUsers?: ICommentUser[] | null;
}

export class Comment implements IComment {
  constructor(
    public id?: number,
    public value?: number | null,
    public date?: dayjs.Dayjs | null,
    public commentUsers?: ICommentUser[] | null
  ) {}
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
