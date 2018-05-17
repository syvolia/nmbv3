import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the TransferPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})
export class TransferPage {
  title:string="";
  text:string="";
  accounts:any=[];
  objectblock:any={};
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string;
  contact:any;
  cname:string="";
  currency:string="TZS";
  customerName:string="";

  constructor(public navCtrl: NavController,public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider
    , public alertService: AlertServiceProvider, private device: Device){

	this.accounts=this.globalVars.getAccounts();
	this.objectblock.accountfrom=this.accounts[0];
    this.title = navParams.get('title');
    this.objectblock.recepient="my";
	this.checkRecepeint(this.objectblock.recepient);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferPage');
  }

  checkRecepeint(recepient){
  	if(recepient=='my'&&this.title!="Bank Account"){
       this.objectblock.accountto=this.globalVars.getUsername();
	}
	else{
       this.objectblock.accountto="";
	}
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
    else if(this.title!="Bank Account"&&(!(/^\d{10}|\d{12}$/.test(objectblock.accountto)))){
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
      if(this.title!="Bank Account"){
        this.objectblock.accountto="255"+objectblock.accountto.substr(objectblock.accountto.length-9);
      }

      this.token=this.globalVars.createToken();
      let template="";
      if(this.title=='Chap chap plus'){
        this.getChapAccount(objectblock);
      }
      else{
	      if(this.title=='Bank Account'){
		      this.getNMBAccount(objectblock);
		  }
		  else if(this.title=='Telkom'||this.title=='M-Pesa'||this.title=='HaloPesa'||this.title=='Airtel Money'||this.title=="TTCL Pesa"){
		  	if(this.title=="HaloPesa"){
				this.field100="HALOTELB2C";
			}
			else if(this.title=="Telkom"){
				this.field100="TIGO-PESAB2C";
			}
			else if(this.title=="Airtel Money"){
				this.field100="AIRTELB2C";
			}
			else if(this.title=="M-Pesa"){
				this.field100="M-PESAB2C";
			}
			else if(this.title=="TTCL Pesa"){
				this.field100="TTCL_B2C";
			}
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
		            3: "440000",
		            4: objectblock.amount,
		            7: this.globalVars.getDate("7"),
		            11: this.token.field11,
		            12: this.globalVars.getDate("12"),
		            32: "NMBAPP",
		            37: this.token.field37,
		            65: objectblock.accountto,
		            100: this.field100,
		            102: objectblock.accountfrom
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
	        template="<div>Transfer"+" "+this.currency+"."+objectblock.amount+"<br> From account : "+objectblock.accountfrom+"<br> To "+this.title+" Number: "
		    +objectblock.accountto+"</div>";
		    this.body=this.globalVars.getEncryptedVars(this.body);
	        console.log(this.body);
		    
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
	      
      }
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
            let template="<div>Transaction failed</div>";
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
  getChapAccount(objectblock){
    if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
     
      
      this.body=JSON.stringify({
        esbRequest: {
          f0: "0200",
          f2: objectblock.accountto,
          f3: "200200",
          ESBUser: "chapchapplus",
          ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
          ESBPassword: "chapchapplus",
          data:{
            37: this.token.field37,
            65: objectblock.accountto
          }        
        },
        mnoSession: {
          id: this.globalVars.getDate("9"),
          msisdn: objectblock.accountto,
          deviceid: this.device.uuid
        }
        
      });
        
      this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
      
      this.makeChapRequest(objectblock);
      
    }
    else{
      this.toast.show("Please connect to the Internet", '8000', 'bottom').subscribe(
        toast => {
        console.log(toast);
      });
    }

  }
  public openModal(){ 
   
   let template="<div>Funds Transfer Was Successful</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
}
  getNMBAccount(objectblock){
    if(this.connectivityService.isOnline()){
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
            3: "360000",
            4: "0",
            7: this.globalVars.getDate("7"),
            11: this.token.field11,
            12: this.globalVars.getDate("12"),
            32: "NMBAPP",
            37: this.token.field37,
            100: "IBCBSACCOUNTLOOKUP",
            102: objectblock.accountto
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
      
      this.makeNMBaccountRequest(objectblock);
      
    }
    else{
      this.toast.show("Please connect to the Internet", '8000', 'bottom').subscribe(
        toast => {
        console.log(toast);
      });
    }

  }
  makeChapRequest(objectblock){
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
            console.log(response);
            this.customerName=response.CUSTOMERNAME;
            let template="<div>Confirm transfer to "+response.CUSTOMERNAME+"</div>"
            let obj={body:"", template:template, completed:false, pageTo:'standard'};
		    let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
		    myModal.present();
	        myModal.onDidDismiss(data=>{ 
	          console.log("Data =>"+ data);
	          if(data){
	            this.submitChapRequest(objectblock, response.ACCOUNTNUMBER);
	          }
	          else{

	          }
	        })
          }
          else{
            
            let template="<div>Fetch Accounts failed </div>";
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
  makeNMBaccountRequest(objectblock){
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
            console.log(response);
            this.customerName=response.fieldCUSTNAME;
            let template="<div>Confirm transfer to "+response.fieldCUSTNAME+"</div>"
            let obj={body:"", template:template, completed:false, pageTo:'standard'};
        let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
        myModal.present();
          myModal.onDidDismiss(data=>{ 
            console.log("Data =>"+ data);
            if(data){
              this.submitNMBaccountRequest(objectblock);
            }
            else{

            }
          })
          }
          else{
            
            let template="<div>Fetch Accounts failed </div>";
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
  submitNMBaccountRequest(objectblock){
     let template="";
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
            3: "400000",
            4: objectblock.amount,
            7: this.globalVars.getDate("7"),
            11: this.token.field11,
            12: this.globalVars.getDate("12"),
            32: "NMBAPP",
            37: this.token.field37,
            100: "FT",
            102: objectblock.accountfrom,
            103: objectblock.accountto
          }            
        },
        mnoSession:{
          id: this.globalVars.getDate("9"),
          ussdBody: '1',
          imsi: "",
          msisdn: this.globalVars.getUsername(),
          rectype: "1",
          customertype: 2, 
          lang: "ki",
          accountType: "NMB mobile",
          receiverName: this.customerName,
          receiverPhone:"",
          senderName:this.globalVars.getCustomerName()
        } 
      });
    template="<div>Transfer"+" "+this.currency+"."+objectblock.amount+"<br> From account : "+objectblock.accountfrom+"<br> To account "
    +objectblock.accountto+"</div>";
    this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
    
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
  submitChapRequest(objectblock,accountno){
    let currencyTemplate=this.globalVars.getCurrencyTemplate();
    for(var i=0;i<currencyTemplate.length;i++){
      if(objectblock.accountfrom==currencyTemplate[i].account){
        this.currency=currencyTemplate[i].currency;
      }
    }
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
	        3: "400000",
	        4: objectblock.amount,
	        7: this.globalVars.getDate("7"),
	        11: this.token.field11,
	        12: this.globalVars.getDate("12"),
	        32: "NMBAPP",
	        37: this.token.field37,
	        100: "CHAPCHAPPLUSFT",
	        102: objectblock.accountfrom,
	        103: accountno
	      }            
	    },
	    mnoSession:{
	      id: this.globalVars.getDate("9"),
	      ussdBody: '1',
	      imsi: "",
	      msisdn: this.globalVars.getUsername(),
	      rectype: "1",
	      customertype: 2, 
	      lang: "ki",
        accountType: "chapchapplus",
        receiverName: this.customerName,
        receiverPhone: accountno,
        senderName:this.globalVars.getCustomerName()
	    } 
	  });
  	let template="<div>Transfer"+" "+this.currency+"."+objectblock.amount+"<br> From account : "+objectblock.accountfrom+"<br> To account "
  	+objectblock.accountto+"</div>";
  	this.body=this.globalVars.getEncryptedVars(this.body);
    console.log(this.body);
    
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
}
