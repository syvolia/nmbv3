import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the SubscriptionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {
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
  customerNo:string="";
  dstvobjs:any=[];
  currency:string="TZS";

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider,
     public alertService: AlertServiceProvider) {
  	this.title = navParams.get('title');
  	this.accounts=this.globalVars.getAccounts();
  	this.objectblock.account=this.accounts[0];
    if(this.title=="Zuku"){
  		this.field100="ZUKU";
  	}
  	else if(this.title=="Startimes"){
  		this.field100="STARTIMESTV";
  	}
  	else if(this.title=="Kwese"){
  		this.field100="AZAMTV";
  	}
  	else if(this.title=="DSTV"){
  		this.field100="DSTV_INQ";
  	}
	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionPage');
  }
  submit(objectblock){
    if(this.title!="DSTV"){
      let currencyTemplate=this.globalVars.getCurrencyTemplate();
      for(var i=0;i<currencyTemplate.length;i++){
        if(objectblock.accountfrom==currencyTemplate[i].account){
          this.currency=currencyTemplate[i].currency;
        }
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
  	    let template="<div>Pay "+this.title+" "+this.currency+"."+objectblock.amount+"<br> From account: "+objectblock.account
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
    else{
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
              100: "DSTV_INQ",
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
        let template="<div>Make Payment to "+this.title+"<br> From account: "+objectblock.account
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
  }
   public openModal(){ 
   
   let template="<div>Payment was made successfuly</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
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
            this.field104=response.field48;
            this.toast.show("Enter amount", '8000', 'bottom').subscribe(
              toast => {
              console.log(toast);
            });
            this.amountForm=true;
            
            let myDSTVarray=this.field104.split('~');
            this.customerNo=this.field104[0].split('|')[1];
            for(var i=1;i<myDSTVarray.length;i++){
              let values=myDSTVarray[i].split('|');
              let dstvobj={id:values[0],name:values[1],amount:values[2],currency:values[3]};
              this.dstvobjs.push(dstvobj);
            }
            //this.objectblock.amount=result.Amount;
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
      if(objectblock.accountfrom==currencyTemplate[i].account){
        this.currency=currencyTemplate[i].currency;
      }
    }
    if(this.title=="DSTV"){
      this.field100="DSTV_PAY";
    }
    let myDSTVarray=this.field104.split('~');
    this.customerNo=myDSTVarray[0];
    /*for(var i=1;i<myDSTVarray.length;i++){
      let values=myDSTVarray[i].split('|');
      let dstvobj={id:values[0],name:values[1],amount:values[2],currency:values[3]};
      this.dstvobjs.push(dstvobj);
    }*/
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
            65: this.objectblock.accountto,
            100: this.field100,
            102: this.objectblock.account,
            104: this.customerNo+"~"+objectblock.dstvpackage.id+"|"+objectblock.dstvpackage.name+"|"+objectblock.dstvpackage.amount+"|"+objectblock.dstvpackage.currency
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
      });
    }
    else{
      this.toast.show("Please connect to the Internet", '8000', 'bottom').subscribe(
        toast => {
        console.log(toast);
      });
    }

  }

  selectPackage(dstvobj){
    this.objectblock.amount=dstvobj.amount;
  }
}
