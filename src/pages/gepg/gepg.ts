import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the GepgPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-gepg',
  templateUrl: 'gepg.html',
})
export class GepgPage {
  title:string="";
  accounts:any=[];
  objectblock:any={};
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string="";
  field25:string="";
  amountForm:boolean=false;
  authorities:any=[];
  amountForm2:boolean=false;
  currency:string="TZS";

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider,
     public alertService: AlertServiceProvider) {
  	this.accounts=this.globalVars.getAccounts();
	this.objectblock.account=this.accounts[0];
    this.authorities=[{name:"Police",val:"SP108"},{name:"Immigration",val:"SP109"},{name:"Others",val:""}];
    this.objectblock.authority=this.authorities[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GepgPage');
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
   public openModal(){ 
   
   let template="<div>Payment Was Successful</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
}
  submit(objectblock){
    if(objectblock.accountto==""||objectblock.accountto==undefined){
      let template="<div>Kindly enter a valid account number</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
      this.field25=objectblock.accountto.substring(2,5);
      this.field25="SP"+this.field25;
      this.field100="GEPG_INQ";

      console.log(this.field25);
      
      if(objectblock.authority.val!=this.field25&&objectblock.authority.val!=""){
        let template="<div>Kindly enter a valid Reference number</div>";
        let obj={body:this.body, template:template, completed:true, pageTo:''};
        let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
        myModal.present();
      }
      else{
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
	            3: "320000",
	            4: "0",
	            7: this.globalVars.getDate("7"),
	            11: this.token.field11,
	            12: this.globalVars.getDate("12"),
	            25: this.field25,
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
	      let template="<div>Make payment to "+this.title+"<br> From account: "+objectblock.account
	      +" For account number: "+objectblock.accountto+"</div>";
	      let obj={body:this.body, template:template, completed:false, pageTo:'standard'};
	      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
	      myModal.present();
	        myModal.onDidDismiss(data=>{ 
	          console.log("Data =>"+ data);
	          if(data){
	            this.processInquiry();
	          }
	          else{

	          }
	      })
      }
    }
    else{
      this.toast.show("Please connect to the Internet", '8000', 'bottom').subscribe(
        toast => {
        console.log(toast);
      });
    }

  }
  processInquiry(){
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
            this.toast.show("Enter amount", '8000', 'bottom').subscribe(
              toast => {
              console.log(toast);
            });
            
            let result:any = {};
            response.field48.split('~').forEach(function(x){
                let arr = x.split('=');
                arr[1] && (result[arr[0]] = arr[1]);
            });
            this.objectblock.amount=result.BillAmt;
            if(result.BillPayOpt=="FULL"){
            	this.amountForm=true;
            }
            else{
            	this.amountForm2=true;
            }

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
  submitAmount(objectblock){
    let currencyTemplate=this.globalVars.getCurrencyTemplate();
    for(var i=0;i<currencyTemplate.length;i++){
      if(objectblock.account==currencyTemplate[i].account){
        this.currency=currencyTemplate[i].currency;
      }
    }
    this.field100="GEPG_PAY";
    if(objectblock.accountto==""||objectblock.accountto==undefined){
      let template="<div>Kindly enter a valid account number</div>";
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
    else if(objectblock.authority.val!=this.field25&&objectblock.authority.val!=""){
      let template="<div>Kindly enter a valid Reference number</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(this.connectivityService.isOnline()){
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
            3: "500000",
            4: objectblock.amount,
            7: this.globalVars.getDate("7"),
            11: this.token.field11,
            12: this.globalVars.getDate("12"),
            25: this.field25,
            32: "NMBAPP",
            37: this.token.field37,
            65: objectblock.accountto,
            100: this.field100,
            102: objectblock.account,
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
      let template="<div>Make payment to GEGP "+objectblock.authority.name+" "+this.currency+"."+objectblock.amount+"<br> From account: "+objectblock.account
      +" For account number: "+objectblock.accountto+"</div>";
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


}
