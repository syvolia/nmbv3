import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TraPage } from './tra';

@NgModule({
  declarations: [
    TraPage,
  ],
  imports: [
    IonicPageModule.forChild(TraPage),
  ],
  exports: [
    TraPage
  ]
})
export class TraPageModule {}
