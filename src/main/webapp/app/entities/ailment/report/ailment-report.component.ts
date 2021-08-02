import { Component, OnInit } from '@angular/core';
import { IAilment } from '../ailment.model';
import { AilmentService } from '../service/ailment.service';

@Component({
  selector: 'medi-ailment-report',
  templateUrl: './ailment-report.component.html',
  styleUrls: ['./ailment-report.component.scss'],
})
export class AilmentReportComponent implements OnInit {
  public ailments: any[] = [];

  constructor(protected ailmentService: AilmentService) {}

  ngOnInit(): void {
    this.getAilmentReport();
  }

  protected getAilmentReport(): void {
    this.ailmentService.getAilmentReport().subscribe((ailmentResponse: any) => {
      this.ailments = ailmentResponse.body;
    });
  }
}
