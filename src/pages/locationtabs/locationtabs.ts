import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
/**
 * Generated class for the LocationtabsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-locationtabs',
  templateUrl: 'locationtabs.html',
})
export class LocationtabsPage {
  tab1Root: string = 'LocationPage';
  tab2Root: string = 'LocationPage';
  mySelectedIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider) {
    this.mySelectedIndex =0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationtabsPage');
  }
  setMapType(type){
    this.globalVars.setMapType(type);
  }

}
