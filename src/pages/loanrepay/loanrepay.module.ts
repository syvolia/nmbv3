import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanrepayPage } from './loanrepay';

@NgModule({
  declarations: [
    LoanrepayPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanrepayPage),
  ],
  exports: [
    LoanrepayPage
  ]
})
export class LoanrepayPageModule {}
