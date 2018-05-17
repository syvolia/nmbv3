import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TvSubscriptionPage } from './tv-subscription';

@NgModule({
  declarations: [
    TvSubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(TvSubscriptionPage),
  ],
  exports: [
    TvSubscriptionPage
  ]
})
export class TvSubscriptionPageModule {}
