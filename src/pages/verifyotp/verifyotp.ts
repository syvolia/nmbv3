import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, App } from 'ionic-angular';

/**
 * Generated class for the VerifyotpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-verifyotp',
  templateUrl: 'verifyotp.html',
})
export class VerifyotpPage {
  objectblock:any={};
  myTimer:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController) {
    this.myTimer=setTimeout(() => {
      this.viewCtrl.dismiss();
      let template="<div>Sorry try again took too long to key in value</div>";
      let obj={body:"", template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }, 100000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyotpPage');
  }

  submit(objectblock){
     this.viewCtrl.dismiss(objectblock.verificationcode);
     clearTimeout(this.myTimer);
  }
}
