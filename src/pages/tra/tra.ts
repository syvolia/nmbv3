import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tra',
  templateUrl: 'tra.html',
})
export class TraPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TraPage');
  }

  openPage(title){
    if(title!="GEPG"){
      this.navCtrl.push('TradutyPage',{title:title});
    }
    else{
      this.navCtrl.push('GepgPage');
    }
  }
}
