import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PowerPage } from './power';

@NgModule({
  declarations: [
    PowerPage,
  ],
  imports: [
    IonicPageModule.forChild(PowerPage),
  ],
  exports: [
    PowerPage
  ]
})
export class PowerPageModule {}
