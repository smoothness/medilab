import { IEmergencyContact } from 'app/entities/emergency-contact/emergency-contact.model';
import { IRatingUser } from 'app/entities/rating-user/rating-user.model';
import { ICommentUser } from 'app/entities/comment-user/comment-user.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IPatient {
  id?: number;
  secondSurname?: string | null;
  phone?: string | null;
  token?: string | null;
  internalUser?: any | null;
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
    public internalUser?: any | null,
    public emergencyContacts?: IEmergencyContact[] | null,
    public ratingUsers?: IRatingUser[] | null,
    public commentUsers?: ICommentUser[] | null,
    public internalUsers?: IAppointment[] | null
  ) {}
}

export function getPatientIdentifier(patient: IPatient): number | undefined {
  return patient.id;
}
