import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationtabsPage } from './locationtabs';

@NgModule({
  declarations: [
    LocationtabsPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationtabsPage),
  ],
  exports: [
    LocationtabsPage
  ]
})
export class LocationtabsPageModule {}
