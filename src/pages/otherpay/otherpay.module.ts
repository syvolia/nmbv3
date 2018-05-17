import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtherpayPage } from './otherpay';

@NgModule({
  declarations: [
    OtherpayPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherpayPage),
  ],
  exports: [
    OtherpayPage
  ]
})
export class OtherpayPageModule {}
