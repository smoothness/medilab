import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppointmentTreatmentAilment } from '../appointment-treatment-ailment.model';
import { AppointmentTreatmentAilmentService } from '../service/appointment-treatment-ailment.service';
import { AppointmentTreatmentAilmentDeleteDialogComponent } from '../delete/appointment-treatment-ailment-delete-dialog.component';

@Component({
  selector: 'medi-appointment-treatment-ailment',
  templateUrl: './appointment-treatment-ailment.component.html',
})
export class AppointmentTreatmentAilmentComponent implements OnInit {
  appointmentTreatmentAilments?: IAppointmentTreatmentAilment[];
  isLoading = false;
  public isCollapsed = true;

  constructor(
    protected appointmentTreatmentAilmentService: AppointmentTreatmentAilmentService,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.appointmentTreatmentAilmentService.query().subscribe(
      (res: HttpResponse<IAppointmentTreatmentAilment[]>) => {
        this.isLoading = false;
        this.appointmentTreatmentAilments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();

    this.appointmentTreatmentAilmentService.findByPatient(5).subscribe((res) => {
      console.log('AQUII',res);
    })
  }

  trackId(index: number, item: IAppointmentTreatmentAilment): number {
    return item.id!;
  }

  delete(appointmentTreatmentAilment: IAppointmentTreatmentAilment): void {
    const modalRef = this.modalService.open(AppointmentTreatmentAilmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appointmentTreatmentAilment = appointmentTreatmentAilment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
