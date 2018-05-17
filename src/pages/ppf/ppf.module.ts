import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PpfPage } from './ppf';

@NgModule({
  declarations: [
    PpfPage,
  ],
  imports: [
    IonicPageModule.forChild(PpfPage),
  ],
  exports: [
    PpfPage
  ]
})
export class PpfPageModule {}
