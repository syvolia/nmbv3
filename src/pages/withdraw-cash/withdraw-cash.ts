import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WithdrawCashPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-withdraw-cash',
  templateUrl: 'withdraw-cash.html',
})
export class WithdrawCashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawCashPage');
  }
  openPage(page){
	this.navCtrl.push('WithdrawPage',{type:page});
	
  }

}
