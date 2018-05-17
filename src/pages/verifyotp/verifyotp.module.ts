import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyotpPage } from './verifyotp';

@NgModule({
  declarations: [
    VerifyotpPage,
  ],
  imports: [
    IonicPageModule.forChild(VerifyotpPage),
  ],
  exports: [
    VerifyotpPage
  ]
})
export class VerifyotpPageModule {}
