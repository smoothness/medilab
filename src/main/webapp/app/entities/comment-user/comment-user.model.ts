import { IComment } from 'app/entities/comment/comment.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IDoctor } from 'app/entities/doctor/doctor.model';

export interface ICommentUser {
  id?: number;
  comment?: IComment | null;
  patient?: IPatient | null;
  doctor?: IDoctor | null;
}

export class CommentUser implements ICommentUser {
  constructor(public id?: number, public comment?: IComment | null, public patient?: IPatient | null, public doctor?: IDoctor | null) {}
}

export function getCommentUserIdentifier(commentUser: ICommentUser): number | undefined {
  return commentUser.id;
}
