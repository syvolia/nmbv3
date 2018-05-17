import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TvSubscriptionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tv-subscription',
  templateUrl: 'tv-subscription.html',
})
export class TvSubscriptionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TvSubscriptionPage');
  }
  openPage(title){
    
    this.navCtrl.push('SubscriptionPage', {
		title: title
	});
	
  }

}
