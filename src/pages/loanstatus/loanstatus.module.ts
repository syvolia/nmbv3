import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanstatusPage } from './loanstatus';

@NgModule({
  declarations: [
    LoanstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanstatusPage),
  ],
  exports: [
    LoanstatusPage
  ]
})
export class LoanstatusPageModule {}
