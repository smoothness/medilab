import { IUser } from 'app/entities/user/user.model';
import { IEmergencyContact } from 'app/entities/emergency-contact/emergency-contact.model';
import { IRatingUser } from 'app/entities/rating-user/rating-user.model';
import { ICommentUser } from 'app/entities/comment-user/comment-user.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IPatient {
  id?: number;
  secondSurname?: string | null;
  phone?: string | null;
  token?: string | null;
  active?: boolean | null;
  internalUser?: IUser | null;
  emergencyContacts?: IEmergencyContact[] | null;
  ratingUsers?: IRatingUser[] | null;
  commentUsers?: ICommentUser[] | null;
  internalUsers?: IAppointment[] | null;
}

export class Patient implements IPatient {
  constructor(
    public id?: number,
    public secondSurname?: string | null,
    public phone?: string | null,
    public token?: string | null,
    public active?: boolean | null,
    public internalUser?: IUser | null,
    public emergencyContacts?: IEmergencyContact[] | null,
    public ratingUsers?: IRatingUser[] | null,
    public commentUsers?: ICommentUser[] | null,
    public internalUsers?: IAppointment[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getPatientIdentifier(patient: IPatient): number | undefined {
  return patient.id;
}
