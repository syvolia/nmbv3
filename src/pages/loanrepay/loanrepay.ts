import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, ModalController, ToastController} from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import {AlertServiceProvider} from '../../providers/alert-service/alert-service';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { ContactsProvider } from '../../providers/contacts/contacts';
import {Toast} from '@ionic-native/toast';
import * as $ from 'jquery'
import {InAppBrowser} from '@ionic-native/in-app-browser'
import {count} from "rxjs/operator/count";

/**
 * Generated class for the LoanrepayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-loanrepay',
  templateUrl: 'loanrepay.html',
})
export class LoanrepayPage {
objectblock: any = {};
  objectblockpay: any = {};
  objectblockbal: any = {};
  objectblockstatement: any = {};
  accounts: any = [];
  loanAccounts: any[];
  data: any;
  error: number = 0;
  ismobile: boolean = false;
  title: string;
  contact: any;
  cname: string = "";
  appraisalaccount: boolean = false;
  salaryaccount: boolean = true;
  applyloan: boolean = false;
  payloan: boolean = false;
  checkbalance: boolean = false;
  checkloanstatemnt: boolean = false;
  appraisalAccountParam: string;
  loanLimit: number;
  validLoanLimit: boolean = false;
  period: number;
  validPeriod: boolean = false;
  browser: any;
  terms: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars:  GlobalVarsProvider,
              public apiConnect:  ApiConnectProvider, public loadingController: LoadingController,
              private toast: Toast, public connectivityService: ConnectivityServiceProvider, public modalCtrl: ModalController,
              public contactsProvider: ContactsProvider, public alertService: AlertServiceProvider, public iab: InAppBrowser,
              public toastCtrl: ToastController){
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoanrepayPage');
  }
public openModal(){ 
   
 let template="<div>You Loan of 5,000 has been repaid successfully !</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
   
  }
}
