import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';

export interface IAilment {
  id?: number;
  name?: string | null;
  removed?: boolean | null;
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[] | null;
}

export class Ailment implements IAilment {
  constructor(
    public id?: number,
    public name?: string | null,
    public removed?: boolean | null,
    public appointmentTreatmentAilments?: IAppointmentTreatmentAilment[] | null
  ) {
    this.removed = this.removed ?? false;
  }
}

export function getAilmentIdentifier(ailment: IAilment): number | undefined {
  return ailment.id;
}
