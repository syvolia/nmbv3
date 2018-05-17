import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherPaymentsPage } from './other-payments';

@NgModule({
  declarations: [
    OtherPaymentsPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherPaymentsPage),
  ],
  exports: [
    OtherPaymentsPage
  ]
})
export class OtherPaymentsPageModule {}
