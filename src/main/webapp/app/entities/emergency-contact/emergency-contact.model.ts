import { IPatient } from 'app/entities/patient/patient.model';

export interface IEmergencyContact {
  id?: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  relationShip?: string | null;
  patient?: IPatient | null;
}

export class EmergencyContact implements IEmergencyContact {
  constructor(
    public id?: number,
    public name?: string | null,
    public phone?: string | null,
    public email?: string | null,
    public relationShip?: string | null,
    public patient?: IPatient | null
  ) {}
}

export function getEmergencyContactIdentifier(emergencyContact: IEmergencyContact): number | undefined {
  return emergencyContact.id;
}
