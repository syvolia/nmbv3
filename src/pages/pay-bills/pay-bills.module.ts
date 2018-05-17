import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PayBillsPage } from './pay-bills';

@NgModule({
  declarations: [
    PayBillsPage,
  ],
  imports: [
    IonicPageModule.forChild(PayBillsPage),
  ],
  exports: [
    PayBillsPage
  ]
})
export class PayBillsPageModule {}
