import { IRating } from 'app/entities/rating/rating.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IDoctor } from 'app/entities/doctor/doctor.model';

export interface IRatingUser {
  id?: number;
  rating?: IRating | null;
  patient?: IPatient | null;
  doctor?: IDoctor | null;
  average?: number;
}

export class RatingUser implements IRatingUser {
  constructor(
    public id?: number,
    public rating?: IRating | null,
    public patient?: IPatient | null,
    public doctor?: IDoctor | null,
    public average?: number
  )
  {}
}

export function getRatingUserIdentifier(ratingUser: IRatingUser): number | undefined {
  return ratingUser.id;
}
