import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IMedicalExams {
  id?: number;
  name?: string | null;
  description?: string | null;
  removed?: boolean | null;
  appointment?: IAppointment | null;
}

export class MedicalExams implements IMedicalExams {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public removed?: boolean | null,
    public appointment?: IAppointment | null
  ) {
    this.removed = this.removed ?? false;
  }
}

export function getMedicalExamsIdentifier(medicalExams: IMedicalExams): number | undefined {
  return medicalExams.id;
}
