import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GepgPage } from './gepg';

@NgModule({
  declarations: [
    GepgPage,
  ],
  imports: [
    IonicPageModule.forChild(GepgPage),
  ],
  exports: [
    GepgPage
  ]
})
export class GepgPageModule {}
