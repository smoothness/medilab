import { IAilment } from 'app/entities/ailment/ailment.model';
import { ITreatment } from 'app/entities/treatment/treatment.model';
import { IAppointment } from 'app/entities/appointment/appointment.model';

export interface IAppointmentTreatmentAilment {
  id?: number;
  description?: string | null;
  removed?: boolean | null;
  ailment?: IAilment | null;
  treatment?: ITreatment | null;
  appointment?: IAppointment | null;
}

export class AppointmentTreatmentAilment implements IAppointmentTreatmentAilment {
  constructor(
    public id?: number,
    public description?: string | null,
    public removed?: boolean | null,
    public ailment?: IAilment | null,
    public treatment?: ITreatment | null,
    public appointment?: IAppointment | null
  ) {
    this.removed = this.removed ?? false;
  }
}

export function getAppointmentTreatmentAilmentIdentifier(appointmentTreatmentAilment: IAppointmentTreatmentAilment): number | undefined {
  return appointmentTreatmentAilment.id;
}
