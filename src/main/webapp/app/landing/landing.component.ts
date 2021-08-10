import { Component } from '@angular/core';

@Component({
  selector: 'medi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  public isMenuCollapsed = true;
  public sliderData = [
    {
      img: './content/images/landing/slider/first.jpg',
      title: 'landing.slider.firstTitle',
      desc: 'landing.slider.fistDesc',
    },
    {
      img: './content/images/landing/slider/second.jpg',
      title: 'landing.slider.secondTitle',
      desc: 'landing.slider.secondDesc',
    },
    {
      img: './content/images/landing/slider/third.jpg',
      title: 'landing.slider.thirdTitle',
      desc: 'landing.slider.thirdDesc',
    },
  ];
  public cardsServices = [
    {
      img: './content/images/landing/cards/first.jpg',
      title: 'landing.cards.firstTitle',
      desc: 'landing.cards.fistDesc',
    },
    {
      img: './content/images/landing/cards/second.jpg',
      title: 'landing.cards.secondTitle',
      desc: 'landing.cards.secondDesc',
    },
    {
      img: './content/images/landing/cards/third.jpg',
      title: 'landing.cards.thirdTitle',
      desc: 'landing.cards.thirdDesc',
    },
  ];

  /**
   * @description This method is in charge of changing the collapse state of the menu
   */
  public collapse(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
