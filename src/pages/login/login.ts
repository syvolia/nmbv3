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
import { SignupPage } from '../signup/signup';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var cordova: any;
declare var window: any;

@IonicPage(
  {name: 'Login'}
)
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

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
  verifyPin() {
    this.navCtrl.push(MainPage);
  }
   verifyPins() {
    this.navCtrl.push(SignupPage);
  }
  openPage(page){
  	this.navCtrl.push(page);
  }
}
