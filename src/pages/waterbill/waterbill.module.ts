import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaterbillPage } from './waterbill';

@NgModule({
  declarations: [
    WaterbillPage,
  ],
  imports: [
    IonicPageModule.forChild(WaterbillPage),
  ],
  exports: [
    WaterbillPage
  ]
})
export class WaterbillPageModule {}
