  import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , MenuController, LoadingController, ModalController, Platform } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import {Keyboard} from '@ionic-native/keyboard';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MainPage } from '../main/main';
import { LoginPage } from '../login/login';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;
declare var window: any;

@IonicPage(
  {name: 'Signup'}
)
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  objectblock: any = {};
  valueforngif: boolean = true;
  isPasswordForm: boolean = false;
  isPasswordForm2: boolean = false;
  error: number = 0;
  data: any;
  smses: any;
  mobileNo: string = "";
  loader:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
    , public loadingController: LoadingController, public modalCtrl: ModalController,public keyboard: Keyboard,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider,
    private storage: Storage, private device: Device, private socialSharing: SocialSharing,
    public platform: Platform, public menu: MenuController)  {
    this.menu.swipeEnable(false);
 
 }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  public openModal(){ 
   
   let template="<div>Your have been registered successfuly,will get back to you with a login pin</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
}
 verifyPins() {
    this.navCtrl.push(LoginPage);
  }
  openPage(page){
  	this.navCtrl.push(page);
  }
}

