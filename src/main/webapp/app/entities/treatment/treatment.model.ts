import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';

export interface ITreatment {
  id?: number;
  specifications?: string | null;
  medicines?: string | null;
  duration?: string | null;
  removed?: boolean | null;
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[] | null;
}

export class Treatment implements ITreatment {
  constructor(
    public id?: number,
    public specifications?: string | null,
    public medicines?: string | null,
    public duration?: string | null,
    public removed?: boolean | null,
    public appointmentTreatmentAilments?: IAppointmentTreatmentAilment[] | null
  ) {
    this.removed = this.removed ?? false;
  }
}

export function getTreatmentIdentifier(treatment: ITreatment): number | undefined {
  return treatment.id;
}
