import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanapplyPage } from './loanapply';

@NgModule({
  declarations: [
    LoanapplyPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanapplyPage),
  ],
  exports: [
    LoanapplyPage
  ]
})
export class LoanapplyPageModule {}
