import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Pipe({
  name: 'role',
  pure: false,
})
export class RolePipe implements PipeTransform {
  public role: any = {
    ROLE_USER: 'userManagement.rolePipe.roleDoctor',
    ROLE_ADMIN: 'userManagement.rolePipe.roleAdmin',
    ROLE_PATIENT: 'userManagement.rolePipe.rolePatient',
  };

  constructor( private translateService: TranslateService ) {}

  transform(value: any): unknown {
    return this.translateService.instant(this.role[value]);
  }
}
