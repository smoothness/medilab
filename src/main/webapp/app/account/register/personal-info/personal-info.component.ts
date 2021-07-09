import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'medi-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {

  ngOnInit(): string{
    return "sexo en la playa";
  }

}
