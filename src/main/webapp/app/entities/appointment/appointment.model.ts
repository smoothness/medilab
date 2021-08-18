import * as dayjs from 'dayjs';
import { IAppointmentTreatmentAilment } from 'app/entities/appointment-treatment-ailment/appointment-treatment-ailment.model';
import { IMedicalExams } from 'app/entities/medical-exams/medical-exams.model';
import { IPatient } from 'app/entities/patient/patient.model';
import { IDoctor } from 'app/entities/doctor/doctor.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IAppointment {
  id?: number;
  date?: dayjs.Dayjs | null;
  status?: Status | null;
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[] | null;
  medicalExams?: IMedicalExams[] | null;
  patient?: IPatient | null;
  doctor?: IDoctor | null;
  updated?: boolean | null;
  canceled?: boolean | null;
}

export class Appointment implements IAppointment {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs | null,
    public status?: Status | null,
    public appointmentTreatmentAilments?: IAppointmentTreatmentAilment[] | null,
    public medicalExams?: IMedicalExams[] | null,
    public patient?: IPatient | null,
    public doctor?: IDoctor | null,
    public updated?: boolean | null,
    public canceled?: boolean | null
  ) {}
}

export function getAppointmentIdentifier(appointment: IAppointment): number | undefined {
  return appointment.id;
}
