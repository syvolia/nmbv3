import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPage1Page } from './modal-page1';

@NgModule({
  declarations: [
    ModalPage1Page,
  ],
  imports: [
    IonicPageModule.forChild(ModalPage1Page),
  ],
  exports: [
    ModalPage1Page
  ]
})
export class ModalPage1PageModule {}
