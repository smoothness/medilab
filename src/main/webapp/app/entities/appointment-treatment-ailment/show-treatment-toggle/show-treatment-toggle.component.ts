import { Component, Input } from '@angular/core';

@Component({
  selector: 'medi-show-treatment-toggle',
  templateUrl: './show-treatment-toggle.component.html',
  styles: [
  ]
})
export class ShowTreatmentToggleComponent {
  @Input() treatment: any;
  public isCollapsed = true;

  public toggle(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
