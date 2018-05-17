import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the OtherpayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-otherpay',
  templateUrl: 'otherpay.html',
})
export class OtherpayPage {
  title:string="";
  accounts:any=[];
  objectblock:any={};
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string="";
  field104:string="";
  institutions:any=[];
  amountForm:boolean=false;
  studdetails:any="";
  selectBillType:boolean=false;
  billTypes:any=[];
  currency:string="TZS";

  constructor(public navCtrl: NavController,public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider
    , public alertService: AlertServiceProvider) {
  	this.accounts=this.globalVars.getAccounts();
	  this.objectblock.account=this.accounts[0];
    this.title = navParams.get('title');
    console.log(this.title);
    if(this.title=="Rent NHC"){
    	this.field100="NHC";
    }
    this.institutions=["CBE","University of DSM"];
    this.objectblock.institution=this.institutions[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtherpayPage');
  }
  submit(objectblock){
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
            3: "500000",
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
	    let template="<div>Pay "+this.title+" TZS."+objectblock.amount+"<br> From account: "+objectblock.account
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
  submitFee(objectblock){
    console.log(objectblock.institution);
    if(objectblock.institution=="CBE"){
      this.field100="CBE_INQ";
    }
    else if(objectblock.institution=="University of DSM"){
      this.field100="UDSMINQ";
    }
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
      console.log(this.body);
      this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
      let template="<div>Make payment to "+objectblock.institution+"<br> From account: "+objectblock.account
      +" For account number: "+objectblock.accountto+"</div>";
      let obj={body:this.body, template:template, completed:false, pageTo:'standard'};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
        myModal.onDidDismiss(data=>{ 
          console.log("Data =>"+ data);
          if(data){
            this.processInquiry(objectblock);
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
  processInquiry(objectblock){
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
            if(objectblock.institution=="CBE"){
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
              this.objectblock.amount=result.amount;
              this.studdetails="<div>Student name: "+result.studentname+"<br>Registration no: "+result.regno+"<br>Programme: "+result.programname+"</div>";
            }
            else{
              this.field104=response.field48;
              this.toast.show("Enter amount", '8000', 'bottom').subscribe(
                toast => {
                console.log(toast);
              });
              this.amountForm=true;
              let processedfield48=JSON.parse(response.field48);
              this.selectBillType=true;
              this.billTypes=processedfield48.results.trans_codes;
              this.objectblock.billType=this.billTypes[0];
              this.studdetails="<div>Student name: "+processedfield48.results.student_info.FullName+"<br>Registration no: "+processedfield48.results.student_info.RegNo+
              "<br>Programme: "+processedfield48.results.student_info.Program+"</div>";
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
    this.field104.split('~').forEach(function(x){
        let arr = x.split('|');
        arr[1] && (result[arr[0]] = arr[1]);
    });
    if(this.title=="CBE"){
      this.field100="'CBE_PAY";
    }
    else{
      this.field100="UDSMPAY";
    }
    if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
      if(this.title=="CBE"){
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
      else{
        console.log(objectblock.billType.TnxCode);
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
              25: objectblock.billType.TnxCode,
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
      } 
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
