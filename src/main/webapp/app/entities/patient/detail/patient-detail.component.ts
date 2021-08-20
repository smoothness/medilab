import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Patient } from './../../../core/auth/account.model';
import { AilmentService } from '../../ailment/service/ailment.service';
import { IMedicalExams } from '../../medical-exams/medical-exams.model';
import { MedicalExamsService } from '../../medical-exams/service/medical-exams.service';
import { IAppointmentTreatmentAilment } from '../../appointment-treatment-ailment/appointment-treatment-ailment.model';
import { AppointmentTreatmentAilmentService } from '../../appointment-treatment-ailment/service/appointment-treatment-ailment.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import { EmergencyContactService } from '../../emergency-contact/service/emergency-contact.service';
import { IEmergencyContact } from '../../emergency-contact/emergency-contact.model';

@Component({
  selector: 'medi-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
  @Input() patient?: Patient;
  isLoaded = false;
  ailments: any = [];
  patientMedicalExams: IMedicalExams[] = [];
  patientDiagnosis: IAppointmentTreatmentAilment[] = [];
  emergencyContacs: any = [];

  constructor(
    protected activatedRoute: ActivatedRoute,
    private ailmentService: AilmentService,
    private medicalExamsService: MedicalExamsService,
    private appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    private emergencyContactService: EmergencyContactService
  ) {}

  ngOnInit(): void {
    if (!this.patient) {
      this.getByUrl();
    } else {
      this.getMedicalExams();
      this.getPatientDiagnoses();
      this.getEmergencyContacts();
    }
  }

  public getByUrl(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = new Patient(patient);
      this.getMedicalExams();
      this.getPatientDiagnoses();
      this.getEmergencyContacts();
    });
  }

  public getAilments(): void {
    this.ailmentService.findAllAilmentsPacient(<number>this.patient?.patientId).subscribe(pacientAilments => {
      this.ailments = pacientAilments.body;
      this.isLoaded = true;
    });
  }

  public getMedicalExams(): void {
    this.medicalExamsService.findByPatient(<number>this.patient?.patientId).subscribe((patientMedicalExams: any) => {
      this.patientMedicalExams = patientMedicalExams.body;
    });
  }

  public getPatientDiagnoses(): void {
    this.appointmentTreatmentAilmentService.findByPatient(<number>this.patient?.patientId).subscribe((res: any) => {
      this.patientDiagnosis = res.body;
    });
  }

  public getEmergencyContacts(): void {
    this.emergencyContactService.findByPatientId(<number>this.patient?.patientId).subscribe((res: any) => {
      this.emergencyContacs = res.body;
    });
  }

  previousState(): void {
    window.history.back();
  }

  downloadProfileAsPDF(): void {
    console.log('this.patient', this.patient);
    console.log('this.getMedicalExams()', this.patientMedicalExams);
    console.log('this.getPatientDiagnoses()', this.patientDiagnosis);
    const documentDefinition = this.getPatientInfo();
    pdfMake.createPdf(documentDefinition).open();
  }

  getPatientInfo(): any {
    return {
      content: [
        {
          text: 'Perfil',
          bold: true,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            [
              {
                text: this.patient?.fullName,
                style: 'name',
              },
              {
                text: `Identificación: ${this.patient?.id}`,
              },
              {
                text: `Email :   ${this.patient?.email}`,
              },
              {
                text: `Teléfono No : ${this.patient?.phone}`,
              },
            ],
          ],
        },
        {
          text: 'Padecimientos',
          style: 'header',
        },
        this.getAilmentsForPDF(this.patientDiagnosis),

        {
          text: 'Tratamientos',
          style: 'header',
        },
        this.getTreatmentsForPdf(this.patientDiagnosis),
        {
          text: 'Examenes Médicos',
          style: 'header',
        },

        this.getMedicalExamsForPdf(this.patientMedicalExams),

        {
          text: 'Contactos de emergencia',
          style: 'header',
        },

        this.getEmergencyContacsForPdf(this.emergencyContacs),

        {
          text: 'Signature',
          style: 'sign',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline',
        },
        name: {
          fontSize: 16,
          bold: true,
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true,
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true,
        },
        tableHeader: {
          bold: true,
        },
      },
    };
  }

  getAilmentsForPDF(patientDiagnosis: IAppointmentTreatmentAilment[]): any {
    const exs: any[] = [];

    patientDiagnosis.forEach(patientDiagnosi => {
      exs.push([
        {
          columns: [
            [
              {
                text: patientDiagnosi.ailment?.name,
                style: 'name',
              },
            ],
          ],
        },
      ]);
    });

    return {
      table: {
        widths: ['*'],
        body: [...exs],
      },
    };
  }

  getTreatmentsForPdf(patientDiagnosis: IAppointmentTreatmentAilment[]): any {
    const exs: any[] = [];

    patientDiagnosis.forEach(patientDiagnose => {
      exs.push([
        {
          columns: [
            [
              {
                text: patientDiagnose.treatment?.medicines,
                style: 'name',
              },
              {
                text: patientDiagnose.treatment?.specifications,
              },
              {
                text: patientDiagnose.treatment?.duration,
              },
            ],
          ],
        },
      ]);
    });

    return {
      table: {
        widths: ['*'],
        body: [...exs],
      },
    };
  }

  getMedicalExamsForPdf(patientMedicalExams: IMedicalExams[]): any {
    const exs: any[] = [];

    patientMedicalExams.forEach(patientMedicalExam => {
      exs.push([
        {
          columns: [
            [
              {
                text: patientMedicalExam.description,
                style: 'name',
              },
              {
                text: patientMedicalExam.name,
              },
            ],
          ],
        },
      ]);
    });

    return {
      table: {
        widths: ['*'],
        body: [...exs],
      },
    };
  }

  getEmergencyContacsForPdf(emergencyContacs: IEmergencyContact[]): any {
    const exs: any[] = [];

    emergencyContacs.forEach(emergencyContac => {
      exs.push([
        {
          columns: [
            [
              {
                text: emergencyContac.name,
                style: 'name',
              },
              {
                text: emergencyContac.email,
              },
              {
                text: emergencyContac.phone,
              },
            ],
            {
              text: emergencyContac.relationShip,
              alignment: 'right',
            },
          ],
        },
      ]);
    });

    return {
      table: {
        widths: ['*'],
        body: [...exs],
      },
    };
  }
}
