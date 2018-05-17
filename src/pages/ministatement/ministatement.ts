import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ModalController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the MinistatementPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-ministatement',
  templateUrl: 'ministatement.html',
})
export class MinistatementPage {
  accounts:any;
  objectblock: any = {};
  datetime:string;
  body:any;
  data:any;
  header:any;
  token:any;
  responded:boolean=false;
  statements:any;
  rawstatements:any;
  title:string="";

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public modalCtrl: ModalController,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider){
  	this.accounts=globalVars.getAccounts();
    this.objectblock.account=this.accounts[0];
    this.title=navParams.get('title');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MinistatementPage');
  }
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
  submit(objectblock){
    console.log(objectblock.fromDate);
    if(this.title!="Ministatement"&&(objectblock.fromDate==""||objectblock.toDate==undefined)){
      let template="<div>Kindly enter a valid date</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(this.title!="Ministatement"&&(objectblock.toDate==""||objectblock.toDate==undefined)){
      let template="<div>Kindly enter a valid date</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(new Date(objectblock.fromDate)>new Date(objectblock.toDate)){
      let template="<div>From date should not be later than To date</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(this.monthDiff(new Date(objectblock.fromDate),new Date(objectblock.toDate))>6){
      let template="<div>Duration should not exceed 6 months</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    }
    else if(this.connectivityService.isOnline()){
    	this.token=this.globalVars.createToken();
      if(this.title=="Ministatement"){
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
              3: "380000",
              4: "0",
              7: this.globalVars.getDate("7"),
              11: this.token.field11,
              12: this.globalVars.getDate("12"),
              32: "NMBAPP",
              37: this.token.field37,
              100: "MINI",
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
      else{
        var m_names = new Array("Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec");

        var d = new Date(objectblock.fromDate);
        var curr_date = ('0' + d.getDate()).slice(-2);
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        let fromDate=curr_date + "-" + m_names[curr_month]+ "-" + curr_year;

        d = new Date(objectblock.toDate);
        curr_date = ('0' + d.getDate()).slice(-2);
        curr_month = d.getMonth();
        curr_year = d.getFullYear();
        let toDate=curr_date + "-" + m_names[curr_month]+ "-" + curr_year;

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
              3: "370000",
              4: "0",
              7: this.globalVars.getDate("7"),
              11: this.token.field11,
              12: this.globalVars.getDate("12"),
             // 24: "20",
              25: fromDate,
              26: toDate,
              32: "NMBAPP",
              37: this.token.field37,
              65: this.globalVars.getEmail(),
              100: "EMAILFULLSTMT",
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
      let template="";
      if(this.title=="Ministatement"){
  	    template="<div>Get Ministatement for account : "+objectblock.account+"</div>";
      }
      else{
        template="<div>Get E-Statement for account : "+objectblock.account+"</div>";
      }
	    let obj={body:this.body, template:template, completed:false, pageTo:'standard'};
	    let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
	    myModal.present();
      myModal.onDidDismiss(data=>{ 
          console.log("Data =>"+ data);
          if(data){
            if(this.title=="Ministatement"){
              this.makeRequest();
            }
            else{
              this.makeEstatementRequest();
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
            
            this.statements=response.field48.split("~");
            
            this.datetime=new Date().toLocaleString();
            this.responded=true;
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
  makeEstatementRequest(){
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
            let template="<div>"+response.field48+"</div>";
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
 public openModal(){ 
   
   let template="<div>Your Ministatement has been sent to your email</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
}
}
