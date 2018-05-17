import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradutyPage } from './traduty';

@NgModule({
  declarations: [
    TradutyPage,
  ],
  imports: [
    IonicPageModule.forChild(TradutyPage),
  ],
  exports: [
    TradutyPage
  ]
})
export class TradutyPageModule {}
