import {Component, Input, OnInit} from '@angular/core';

import { TreatmentService } from "../../treatment/service/treatment.service";

import { ITreatment } from "../../treatment/treatment.model";
import {SweetAlertService} from "../../../shared/services/sweet-alert.service";
import {AppointmentTreatmentAilmentRegisterComponent} from "../register/appointment-treatment-ailment-register.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TreatmentUpdateComponent} from "../../treatment/update/treatment-update.component";
import {TreatmentRegisterComponent} from "../../treatment/register/register-form/treatment-register.component";
import {TreatmentCreateFormComponent} from "../../treatment/register/treatment-create-form.component";
import {Doctor, Patient} from "../../../core/auth/account.model";
import {AccountService} from "../../../core/auth/account.service";

@Component({
  selector: 'medi-show-treatment-toggle',
  templateUrl: './show-treatment-toggle.component.html',
  styles: []
})
export class ShowTreatmentToggleComponent implements OnInit{
  @Input() ailment: any;
  @Input() appointment: any;

  public treatments: ITreatment[] = [];
  public currentUser: any = {};
  public isCollapsed = true;

  constructor(
    protected modalService: NgbModal,
    private accountService: AccountService,
    protected treatmentService: TreatmentService,
    protected sweetAlertService: SweetAlertService,
  ) {}

  public get isPatient(): boolean {
    return this.currentUser instanceof Patient;
  }

  public get isDoctor(): boolean {
    return this.currentUser instanceof Doctor;
  }

  ngOnInit(): void {
    this.authenticatedAccount();
  }

  /**
   * @description this method is responsible for bringing the authenticated user.
   */
  public authenticatedAccount(): void {
    this.accountService.formatUserIdentity().subscribe(user => {
      this.currentUser = user;
    });
  }

  public toggle(): void {
    this.isCollapsed = !this.isCollapsed;
    this.getTreatmentsByAilment();
  }

  public showRegisterModal(): void {
    const modalRef = this.modalService.open(TreatmentUpdateComponent, { centered: true });
    modalRef.componentInstance.isRegister = true;
    modalRef.componentInstance.ailment = this.ailment;
    modalRef.componentInstance.appointment = this.appointment;
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.getTreatmentsByAilment();
      }
    });
  }

  public showEditModal(treatment: ITreatment): void {
    const modalRef = this.modalService.open(TreatmentUpdateComponent, { centered: true });
    modalRef.componentInstance.treatment = treatment;
    modalRef.closed.subscribe(reason => {
      if (reason === 'updated') {
        this.getTreatmentsByAilment();
      }
    });
  }

  public getTreatmentsByAilment(): void{
    this.treatmentService.findByAilment(this.ailment.id, this.appointment.id).subscribe((res: any) => {
      this.treatments = res.body;
    });
  }

  public delete(treatment: ITreatment): void {
    this.sweetAlertService
      .showConfirmMsg({
        title: 'medilabApp.deleteConfirm.title',
        text: 'medilabApp.deleteConfirm.text',
        confirmButtonText: 'medilabApp.deleteConfirm.confirmButtonText',
        cancelButtonText: 'medilabApp.deleteConfirm.cancelButtonText',
      })
      .then(res => {
        if (res) {
          this.treatmentService.updateRemoved(<number>treatment.id).subscribe((removed) => {
            this.sweetAlertService.showMsjSuccess('reset.done', 'medilabApp.deleteConfirm.titleSuccess').then(() => {
              this.getTreatmentsByAilment();
            });
          });
        }
      });
  }
}
