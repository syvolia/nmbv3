import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the CardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {
  accounts:any;
  cards:any;
  objectblock: any = {};
  responded:boolean=false;
  body:any;
  data:any;
  header:any;
  token:any;
  field100:string="";
  title:string="";
  type1:string="";
  type2:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider) {
    this.title = navParams.get('title');
    this.accounts=globalVars.getAccounts();
	this.cards=this.globalVars.getLinkedCards();
	this.objectblock.card=this.cards[0];
  	if(this.title=="Block"){
  		this.field100="BLOCKATMCARD";
      this.type1="BLOCK";
      this.type2="Block";
  	}
  	else if(this.title=="Unblock"){
  		this.field100="UNBLOCKATMCARD";
      this.type1="UNBLOCK";
      this.type2="unBlock";
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
  }
  submit(objectblock){
    if(this.connectivityService.isOnline()){
      this.token=this.globalVars.createToken();
      if(this.title!='Link'){
        this.body=JSON.stringify({
        	esbRequest:{
    		f0:"0200",
    		f3:"170200",
  	    ESBUser: "chapchapplus",
  	    ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
            ESBPassword: "chapchapplus",
            data:{
              0: "0200",
              2: this.globalVars.getUsername(),
              3: "800000",
              4: "0",
              7: this.globalVars.getDate("7"),
              11: this.token.field11,
              12: this.globalVars.getDate("12"),
              32: "NMBAPP",
              37: this.token.field37,
              65: objectblock.card.CARDNUMBER,
              100: this.field100,
              102: this.accounts[0],
              cardnumber: objectblock.card.CARDNUMBER,
              cif: this.globalVars.getCIF(),
              flexaccount: this.accounts[0],
              requestType: this.type1
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
            requestType: this.type2,
            cardnumber: objectblock.card.CARDNUMBER,
            cif: this.globalVars.getCIF()
          } 
        });
      }
      else{
        let name=this.globalVars.getCustomerName();
        let nameArray=name.split(" ");
        let firstname="";
        let lastname="";
        if(nameArray.length==3){
          firstname=nameArray[0];
          lastname=nameArray[2];
        }
        else if(nameArray.length==2){
          firstname=nameArray[0];
          lastname=nameArray[1];
        }
        this.body=JSON.stringify({
          esbRequest:{
        f0:"0200",
        f3:"170200",
        ESBUser: "chapchapplus",
        ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
            ESBPassword: "chapchapplus",
            data:{
              MSISDN: this.globalVars.getUsername(),
              firstname: firstname,
              lastname: lastname,
              gender: '',
              cif: this.globalVars.getCIF(),
              cardnumber: objectblock.cardno,
              flexaccount: this.accounts[0]
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
            requestType: this.type2,
            cardnumber: objectblock.cardno,
            cif: this.globalVars.getCIF()
          } 
        });
      }
      
        
      this.body=this.globalVars.getEncryptedVars(this.body);
      console.log(this.body);
	    let template="<div>"+this.title+"<br> Card number: "+objectblock.card.CARDNUMBERMASKED+"</div>";
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
