import * as dayjs from 'dayjs';
import { IRatingUser } from 'app/entities/rating-user/rating-user.model';

export interface IRating {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
  ratingUsers?: IRatingUser[] | null;
}

export class Rating implements IRating {
  constructor(
    public id?: number,
    public value?: number | null,
    public date?: dayjs.Dayjs | null,
    public ratingUsers?: IRatingUser[] | null
  ) {}
}

export function getRatingIdentifier(rating: IRating): number | undefined {
  return rating.id;
}
