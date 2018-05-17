import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the TradutyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-traduty',
  templateUrl: 'traduty.html',
})
export class TradutyPage {
  title:string="";
  accounts:any=[];
  objectblock:any={};
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string="";
  field104:string="";
  amountForm:boolean=false;
  businessPresent:boolean=false;
  clientDesc:string="";
  processedfield48:any;
  businesses:any=[];
  currency:string="TZS";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider,
     public alertService: AlertServiceProvider) {
  	this.title = navParams.get('title');
	  this.accounts=this.globalVars.getAccounts();
	  this.objectblock.account=this.accounts[0];
    if(this.title=="Motor Vehicle License"){
      this.field100="TRA_MV_INQ";
    }
    else if(this.title=="Landrates"){
      this.field100="TRA_INQ";
    }
    else if(this.title=="NSSF"){
      this.field100="TRA_INQ";
    }
    else if(this.title=="Carparking"){
      this.field100="CENTRALLGRCISINQ";
    }
    else if(this.title=="TPA"){
      this.field100="TPA_INQ";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TradutyPage');
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
            if(this.title=="TAMISEMI"){
              this.field104=response.field48;
              this.amountForm=true;
              this.processedfield48=JSON.parse(response.field48);
              this.objectblock.amount=this.processedfield48.balance;
              if(this.processedfield48.sources.length>0){
                
                this.businesses=this.processedfield48.sources;
                this.businessPresent=true;
                this.clientDesc="<div>Name: "+this.processedfield48.name+"<br>"+this.processedfield48.sources[0].name;
                this.objectblock.business=this.processedfield48.sources[0];
                this.objectblock.amount=this.processedfield48.sources[0].balance;
                
              }
              else if(this.processedfield48.balance=="0"){
                let template="<div>You have no balance</div>";
                let obj={body:this.body, template:template, completed:true, pageTo:'MainPage'};
                let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
                myModal.present();
              }
              else{
                let template="<div>You have no registered business</div>";
                let obj={body:this.body, template:template, completed:true, pageTo:'MainPage'};
                let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
                myModal.present();
              }
              
            }
            else if(this.title=="TPA"){
              this.field104=response.field48;
              this.toast.show("Enter amount", '8000', 'bottom').subscribe(
                toast => {
                console.log(toast);
              });
              this.amountForm=true;
              let result:any = {};
              this.field104.split('~').forEach(function(x){
                  let arr = x.split('=');
                  arr[1] && (result[arr[0]] = arr[1]);
              });
              this.clientDesc="<div>Name: "+result.AGN+"</div>";
            }
            else {
              this.field104=response.field48;
              this.toast.show("Enter amount", '8000', 'bottom').subscribe(
                toast => {
                console.log(toast);
              });
              this.amountForm=true;
              let result:any = {};
              this.field104.split('~').forEach(function(x){
                  let arr = x.split('|');
                  arr[1] && (result[arr[0]] = arr[1]);
              });
              this.objectblock.amount=result.Amount;
              this.clientDesc="<div>Name: "+result.TaxPayerName+"</div>";
            }
            
          }
          else{
            let template="<div>Transaction failed "+response.field48+"</div>";
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
    let result:any = {};
    
    if(this.title!="TPA"){
      this.field104.split('~').forEach(function(x){
          let arr = x.split('|');
          arr[1] && (result[arr[0]] = arr[1]);
      });
    }
    if(this.title=="Motor Vehicle License"){
      this.field100="TRA_MV_PAY";
    }
    else if(this.title=="Domestic Revenue"){
      this.field100="TRA_PAY_DOM";
    }
    else if(this.title=="NSSF"){
      this.field100="TRA_PAY_CUS";
    }
    else if(this.title=="TPA"){
      this.field100="TPA_PAY";
    }
    else if(this.title=="TAMISEMI"){
      this.field100="CENTRALLGRCISPAY";
    }
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
    else if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
       if(this.title=="TPA"){
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
              32: "NMBAPP",
              37: this.token.field37,
              65: objectblock.accountto,
              100: this.field100,
              102: objectblock.account,
              104: this.field104
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
      } 
      else if(this.title=="TAMISEMI"){
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
              32: "NMBAPP",
              37: this.token.field37,
              38: this.token.field37,
              65: objectblock.accountto,
              72: objectblock.business.gfs_code,
              73: objectblock.business.name,
              74: this.processedfield48.name,
              88: 'NetworkID=LGRCISPAY PayerID: '+objectblock.accountto+'@'+objectblock.business.gfs_code+':'+objectblock.business.name+'@'+this.processedfield48.name,
              100: this.field100,
              102: objectblock.account,
              104: this.field104
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
              3: "500000",
              4: objectblock.amount,
              7: this.globalVars.getDate("7"),
              11: this.token.field11,
              12: this.globalVars.getDate("12"),
              32: "NMBAPP",
              37: this.token.field37,
              tin: result.tin,
              65: objectblock.accountto,
              88: 'NetworkID-TAXBANK '+objectblock.accountto+'/'+result.tin+'/'+result.TaxPayerName+'/'+this.globalVars.getUsername(),
              100: this.field100,
              102: objectblock.account,
              104: this.field104
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
      } 
      console.log(this.body);
      this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
      let template="<div>Pay "+this.title+" "+this.currency+"."+objectblock.amount+"<br> From account: "+objectblock.account
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
