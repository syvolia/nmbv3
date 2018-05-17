import { Component } from '@angular/core';
import { IonicPage, App, NavController, NavParams, ModalController,ViewController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';

/**
 * Generated class for the MainPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  CustomerName:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider, public modalCtrl: ModalController) {
     this.CustomerName=globalVars.getCustomerName();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }
  openPage(page){
  	this.navCtrl.push(page);
  }

  openComingSoon(){
    let template="<div>Coming Soon...</div>";
    let obj={body:"", template:template, completed:true, pageTo:''};
    let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
    myModal.present();
  }
  
}


