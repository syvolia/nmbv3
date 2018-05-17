import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EnquiriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-enquiries',
  templateUrl: 'enquiries.html',
})
export class EnquiriesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnquiriesPage');
  }
  openPage(page){
    if(page=='Ministatement'){
      this.navCtrl.push('MinistatementPage',{title:'Ministatement'});
    }
    else if(page=='Estatement'){
      this.navCtrl.push('MinistatementPage',{title:'E-Statement'});
    }
    else{
      this.navCtrl.push(page);
    }
  }

}
