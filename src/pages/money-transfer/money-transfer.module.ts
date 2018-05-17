import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoneyTransferPage } from './money-transfer';

@NgModule({
  declarations: [
    MoneyTransferPage,
  ],
  imports: [
    IonicPageModule.forChild(MoneyTransferPage),
  ],
  exports: [
    MoneyTransferPage
  ]
})
export class MoneyTransferPageModule {}
