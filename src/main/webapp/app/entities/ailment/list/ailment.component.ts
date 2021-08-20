import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { IAilment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';
import Swal from 'sweetalert2';
import { AilmentUpdateComponent } from '../update/ailment-update.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'medi-ailment',
  templateUrl: './ailment.component.html',
})
export class AilmentComponent implements OnInit {
  ailments?: IAilment[];
  isLoading = false;

  constructor(protected ailmentService: AilmentService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ailmentService.query().subscribe(
      (res: HttpResponse<IAilment[]>) => {
        this.isLoading = false;
        this.ailments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAilment): number {
    return item.id!;
  }

  ShowRegisterAilmentModal(): void {
    const modalRef = this.modalService.open(AilmentUpdateComponent, { size: 'lg', centered: true });
    modalRef.closed.subscribe(reason => {
      if (reason === 'register') {
        this.loadAll();
      }
    });
  }

  removed(ailment: IAilment): void {
    if (ailment.removed === false) {
      ailment.removed = true;
      this.ailmentService.update(ailment).subscribe(() => {
        Swal.fire({
          title: 'Se ha activado el padecimiento',
          text: 'El padecimiento ha sido activado exitosamente',
          icon: 'success',
        });
      });
    } else {
      ailment.removed = false;
      this.ailmentService.update(ailment).subscribe(() => {
        Swal.fire({
          title: 'Se ha desactivado el padecimiento',
          text: 'El padecimiento ha sido desactivado con éxito',
          icon: 'success',
        });
      });
    }
  }
}
