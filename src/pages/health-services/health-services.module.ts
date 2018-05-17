import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HealthServicesPage } from './health-services';

@NgModule({
  declarations: [
    HealthServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(HealthServicesPage),
  ],
  exports: [
    HealthServicesPage
  ]
})
export class HealthServicesPageModule {}
