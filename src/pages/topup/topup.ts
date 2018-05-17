import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the TopupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-topup',
  templateUrl: 'topup.html',
})
export class TopupPage {
  title:string="";
  accounts:any=[];
  objectblock:any={};
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string="";
  contact:any;
  cname:string="";
  currency:string="TZS";

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider,
     public alertService: AlertServiceProvider){
    this.title = navParams.get('title');
	this.accounts=this.globalVars.getAccounts();
	this.objectblock.account=this.accounts[0];
	this.objectblock.recepient="my";
	if(this.title=="Halotel"){
		this.field100="HALOTELTOPUP";
	}
	else if(this.title=="Telkom"){
		this.field100="ZANTELTOPUP";
	}
	else if(this.title=="Telkom"){
		this.field100="TIGOTOPUP";
	}
	else if(this.title=="Airtel"){
		this.field100="AIRTELTOPUP";
	}
	else if(this.title=="Safaricom"){
		this.field100="SAFARICOMTOPUP";
	}
  else if(this.title=="TTCL"){
    this.field100="TTCLTOPUP";
  }
	this.checkRecepeint(this.objectblock.recepient);
	

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopupPage');
  }

  checkRecepeint(recepient){
  	if(recepient=='my'){
       this.objectblock.accountto=this.globalVars.getUsername();
	}
	else{
       this.objectblock.accountto="";
	}
  }
 public openModal(){ 
   
   let template="<div>Airtime Purchase Was Successful</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
}
  pickContact(){
    this.contactsProvider.pickContact().then(contact => {
       console.log(contact);
       if(contact.phoneNo.length>1){
           this.alertService.showRadioAlert(contact.phoneNo).then(data => {
              this.objectblock.accountto=data;
              if(this.objectblock.accountto!=""||this.objectblock.accountto!=undefined){
                this.cname=contact.name;
              }
           });
       }
       else{
         this.objectblock.accountto=contact.phoneNo[0];
         if(this.objectblock.accountto!=""||this.objectblock.accountto!=undefined){
           this.cname=contact.name;
       }
     }
       
    });
  }

  submit(objectblock){
    let currencyTemplate=this.globalVars.getCurrencyTemplate();
    for(var i=0;i<currencyTemplate.length;i++){
      if(objectblock.account==currencyTemplate[i].account){
        this.currency=currencyTemplate[i].currency;
      }
    }
    if(objectblock.accountto==""||objectblock.accountto==undefined){
      let template="<div>Kindly enter a valid account number</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if((!(/^\d{10}|\d{12}$/.test(objectblock.accountto)))){
      let template="<div>Kindly enter a valid Mobile number</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(objectblock.amount==""||objectblock.amount==undefined){
      let template="<div>Kindly enter a valid amount</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }

    else if(this.connectivityService.isOnline()){
      this.objectblock.accountto="255"+objectblock.accountto.substr(objectblock.accountto.length-9);
      this.token=this.globalVars.createToken();
      this.body=JSON.stringify({
      	esbRequest:{
      		f0:"0200",
      		f3:"130200",
    	    ESBUser: "chapchapplus",
    	    ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
          ESBPassword: "chapchapplus",
          data:{
            0: "0200",
            2: this.globalVars.getUsername(),
            3: "420000",
            4: objectblock.amount,
            7: this.globalVars.getDate("7"),
            11: this.token.field11,
            12: this.globalVars.getDate("12"),
            32: "NMBAPP",
            37: this.token.field37,
            65: objectblock.accountto,
            100: this.field100,
            102: objectblock.account
          }            
        },
        mnoSession:{
          id: this.globalVars.getDate("9"),
          ussdBody: '1',
          imsi: "",
          msisdn: this.globalVars.getUsername(),
          rectype: "1",
          customertype: 2, 
          lang: "ki"
        } 
      });
        
      this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
	    let template="<div>Buy"+" "+this.currency+"."+objectblock.amount+" "+this.title+" airtime<br> From account: "+objectblock.account
	    +" For mobile number: "+objectblock.accountto+"</div>";
	    let obj={body:this.body, template:template, completed:false, pageTo:'standard'};
	    let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
	    myModal.present();
        myModal.onDidDismiss(data=>{ 
          console.log("Data =>"+ data);
          if(data){
            this.makeRequest();
          }
          else{

          }
      })
    }
    else{
      this.toast.show("Please connect to the Internet", '8000', 'bottom').subscribe(
        toast => {
        console.log(toast);
      });
    }

  }
  makeRequest(){
    if(this.connectivityService.isOnline()){
    let loader = this.loadingController.create({content:'Submitting Request'});
      loader.present();
      let body=this.body;
      let header= this.token;
      
      this.apiConnect.load(body,header).then(data => {
        loader.dismiss();
        this.data=data;
        if(this.data.error==""){
          
          let response=this.globalVars.getDecryptedVars(this.data.data);
          console.log(response);
           
          if(response.field39=="00"){
            let template="<div>Transaction successful</div>";
            let obj={body:this.body, template:template, completed:true, pageTo:'MainPage'};
            let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
            myModal.present();
          }
          else{
            let template="<div>Transaction failed </div>";
            let obj={body:this.body, template:template, completed:true, pageTo:'MainPage'};
            let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
            myModal.present();
          }
        }
        else{
           
        }
        
      });   
    }
    else{
      this.toast.show("Please connect to the Internet", '8000', 'bottom').subscribe(
        toast => {
        console.log(toast);
      });
    }
  }
}
