import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, App } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the ConfirmModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-confirm-modal',
  templateUrl: 'confirm-modal.html',
})
export class ConfirmModalPage {
  template:string="<div></div>";
  body:any;
  data:any;
  completed:boolean=false;
  pageTo:string="Login";
  header:any;
  ttype:string;

  constructor(public appCtrl: App, public navParams: NavParams, public viewCtrl: ViewController,
   public globalVars: GlobalVarsProvider, public apiConnect: ApiConnectProvider, public loadingController: LoadingController,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider) {
    this.body = navParams.get('body');
    this.template = navParams.get('template');
    this.completed = navParams.get('completed');
    this.pageTo = navParams.get('pageTo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmModalPage');
  }
  closeModal(proceed) {
    console.log(proceed);
    this.viewCtrl.dismiss(proceed);
  }
  closeModal2() {
    
    if(this.template=="<div>Ooops! Took too long to respond.<br>Kindly log in again</div>"){
      this.globalVars.setLock(false);
      this.viewCtrl.dismiss();
    }
    else if(this.pageTo=="MainPage"){
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().setRoot('MainPage');
    }
    else if(this.pageTo==""){
      this.viewCtrl.dismiss();
    }
    else{
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().setRoot('MainPage');
      
    }
  }
  


}
