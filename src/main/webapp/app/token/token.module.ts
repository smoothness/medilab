import { NgModule } from '@angular/core';
import { TokenComponent } from "./token.component";
import { SharedModule } from "../shared/shared.module";



@NgModule({
  declarations: [ TokenComponent ],
  imports: [ SharedModule ],
  exports: [ TokenComponent ]
})
export class TokenModule { }
