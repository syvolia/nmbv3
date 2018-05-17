import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPage2Page } from './modal-page2';

@NgModule({
  declarations: [
    ModalPage2Page,
  ],
  imports: [
    IonicPageModule.forChild(ModalPage2Page),
  ],
  exports: [
    ModalPage2Page
  ]
})
export class ModalPage2PageModule {}
