import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AirlinePage } from './airline';

@NgModule({
  declarations: [
    AirlinePage,
  ],
  imports: [
    IonicPageModule.forChild(AirlinePage),
  ],
  exports: [
    AirlinePage
  ]
})
export class AirlinePageModule {}
