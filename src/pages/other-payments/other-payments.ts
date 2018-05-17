import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OtherPaymentsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-other-payments',
  templateUrl: 'other-payments.html',
})
export class OtherPaymentsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtherPaymentsPage');
  }
  openPage(page){
	if(page=="Travel"){
		this.navCtrl.push('TravelPage');
	}
	else if(page=="School Fee"){
		this.navCtrl.push('OtherpayPage',{title:page});
	}
	else if(page=="Health Services"){
		this.navCtrl.push('HealthServicesPage',{title:page});
	}
	else if(page=="UDART"){
		this.navCtrl.push('AirlinePage',{title:page});
	}
	else if(page=="Rent NHC"){
		this.navCtrl.push('OtherpayPage',{title:page});
	}
	else if(page=="PPF Pension Fund"){
		this.navCtrl.push('PpfPage',{title:page});
	}

  }

}
