import { IUser } from 'app/entities/user/user.model';
import { IRatingUser } from 'app/entities/rating-user/rating-user.model';
import { ICommentUser } from 'app/entities/comment-user/comment-user.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IDoctor {
  id?: number;
  specialty?: string | null;
  active?: boolean | null;
  internalUser?: IUser | null;
  ratingUsers?: IRatingUser[] | null;
  commentUsers?: ICommentUser[] | null;
  internalUsers?: IAppointment[] | null;
}

export class Doctor implements IDoctor {
  constructor(
    public id?: number,
    public specialty?: string | null,
    public active?: boolean | null,
    public internalUser?: IUser | null,
    public ratingUsers?: IRatingUser[] | null,
    public commentUsers?: ICommentUser[] | null,
    public internalUsers?: IAppointment[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getDoctorIdentifier(doctor: IDoctor): number | undefined {
  return doctor.id;
}
