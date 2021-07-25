import { Component } from '@angular/core';

@Component({
  selector: 'medi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  public isMenuCollapsed = true;

  public collapse(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
