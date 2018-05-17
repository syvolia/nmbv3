import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { AlertServiceProvider } from '../../providers/alert-service/alert-service';
import { ContactsProvider } from '../../providers/contacts/contacts';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the WithdrawPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {
  title:string="";
  type:string;
  accounts:any;
  objectblock: any = {};
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string="";
  agentAmountForm:boolean=false;
  agentName:string="";
  terminalID:string="";
  withdrawAccount:string="";
  agentType:string="";
  floatAccount:string="";
  commisionAccount:string="";
  agentID="";
  agentPhone="";
  currency:string="TZS";

  constructor(public navCtrl: NavController,public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController, public contactsProvider: ContactsProvider,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider
    , public alertService: AlertServiceProvider) {
    this.type = navParams.get('type');
  	this.accounts=this.globalVars.getAccounts();
  	this.objectblock.account=this.accounts[0];
    if(this.type=="Atm"){
      this.field100='CARDLESS';
    }
    else{
      this.field100='';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WithdrawPage');
  }
  submit(objectblock){
    let currencyTemplate=this.globalVars.getCurrencyTemplate();
    for(var i=0;i<currencyTemplate.length;i++){
      if(objectblock.accountfrom==currencyTemplate[i].account){
        this.currency=currencyTemplate[i].currency;
      }
    }
    if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
      
      if(this.type=="Atm"){
        if(objectblock.amount==""||objectblock.amount==undefined){
          let template="<div>Kindly enter a valid amount</div>";
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
                3: "410000",
                4: objectblock.amount,
                7: this.globalVars.getDate("7"),
                11: this.token.field11,
                12: this.globalVars.getDate("12"),
                32: "NMBAPP",
                37: this.token.field37,
                65: this.globalVars.getUsername(),
                88:'Cardless Withdrawal from ATM',
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
    	    let template="<div>Withdraw"+" "+this.currency+"."+objectblock.amount+" "+this.title+" From account: "+objectblock.account
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
          });
        }
      }
      else{
        if(objectblock.terminalid==""||objectblock.terminalid==undefined){
          let template="<div>Kindly enter a Terminal ID</div>";
          let obj={body:this.body, template:template, completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
        }
        this.withdrawAccount=objectblock.account;
        this.body=JSON.stringify({
          esbRequest:{
            f0:"0200",
            f2: this.globalVars.getUsername(),
            f3:"150200",
            ESBUser: "chapchapplus",
            ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
            ESBPassword: "chapchapplus",
            data:{
              37: this.token.field37,
              65: objectblock.terminalid
            }   
            
          },
          mnoSession:{
            id: this.globalVars.getDate("9"),
            msisdn: this.globalVars.getUsername(),
            lang: "ki"
          } 
        });
        console.log(this.body);
        this.body=this.globalVars.getEncryptedVars(this.body);
        console.log(this.body);
        let template="<div>Withdraw "+this.title+" From account: "+objectblock.account
        +" For Terminal id: "+objectblock.terminalid+"</div>";
        let obj={body:this.body, template:template, completed:false, pageTo:'standard'};
        let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
        myModal.present();
          myModal.onDidDismiss(data=>{ 
            console.log("Data =>"+ data);
            if(data){
              this.makeInquiry();
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
  makeInquiry(){
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
            this.agentAmountForm=true;
            this.agentName=response.AGENTNAMES;
            this.terminalID=response.TERMINALID;
            this.agentType=response.AGENTTYPE;
            this.floatAccount=response.FLOATACCOUNT;
            this.commisionAccount=response.COMMISSIONACCOUNT;
            this.agentID=response.AGENTID;
            this.agentPhone=response.DEVICEMOBILENUMBER;
          }
          else{
            let template="<div>Transaction failed </div>";
            let obj={body:this.body, template:template, completed:true, pageTo:'MainPage'};
            let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
            myModal.present();
          }
        }
        else{
           let template="<div>Transaction failed "+this.data.error+"</div>";
            let obj={body:this.body, template:template, completed:true, pageTo:'MainPage'};
            let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
            myModal.present();
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
  withdraw(objectblock){
    if(objectblock.amount==""||objectblock.amount==undefined){
      let template="<div>Kindly enter a valid amount</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
      if(this.agentType!="14"){
        this.field100="AGENT-CHWL";
      }
      else{
        this.field100="SEL-AGENT-CHWL";
      }
      let field88='@' + this.commisionAccount + '@Withdraw Cash From Agent  ' + this.agentID + '-' + this.terminalID;
      this.body=JSON.stringify({
        esbRequest:{
          f0:"0200",
          f2: this.globalVars.getUsername(),
          f3:"130200",
          ESBUser: "chapchapplus",
          ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
          ESBPassword: "chapchapplus",
          data:{
            0: "0200",
            2: this.globalVars.getUsername(),
            3: "010000",
            4: objectblock.amount,
            7: this.globalVars.getDate("7"),
            11: this.token.field11,
            12: this.globalVars.getDate("12"),
            32: "NMBAPP",
            37: this.token.field37,
            65: this.terminalID,
            88: field88,
            100: this.field100,
            102: this.withdrawAccount,
            103: this.floatAccount,
            PRD: 'AGCW' 
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
          agentName: this.agentName,
          customerName: this.globalVars.getCustomerName(),
          agentPhone : this.agentPhone
        } 
      });
    
      console.log(this.body);
      this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
      let template="<div>Withdraw "+objectblock.amount+" "+this.title+" From account: "+this.withdrawAccount
      +"</div>";
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


}

