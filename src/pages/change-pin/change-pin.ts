import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , LoadingController, ModalController, Platform } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';

import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

/**
 * Generated class for the ChangePinPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-change-pin',
  templateUrl: 'change-pin.html',
})
export class ChangePinPage {
  objectblock:any={};
  body:any="";
  data:any;
  header:any;
  token:any;
  mobileNo:string="";
  userNumber:string="";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalVars: GlobalVarsProvider
    , public loadingController: LoadingController, public modalCtrl: ModalController,
    private toast: Toast, public connectivityService: ConnectivityServiceProvider, public apiConnect: ApiConnectProvider,
    private storage: Storage, private device: Device,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePinPage');
  }
	   public openModal(){ 
   
   let template="<div>Pin change Successful</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
          myModal.present();
}
  submit(objectblock) {
  	if(!(/^\d{4}$/.test(objectblock.old))){
      let template="<div>Kindly enter a valid PIN</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    } 
    else if(!(/^\d{4}$/.test(objectblock.new))){
      let template="<div>Kindly enter a valid new PIN</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
    } 
  	else if(objectblock.old==objectblock.new){
      let template="<div>Old PIN and New PIN should not match</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
  	}
  	else if(objectblock.new!=objectblock.confirm){
      let template="<div>New PIN and Confirm PIN do not match</div>";
      let obj={body:this.body, template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
  	}
    else if(this.connectivityService.isOnline()){
	      this.token=this.globalVars.createToken();
	      let user=this.globalVars.getUsername();
          let pass=objectblock.old;
          let pass2=objectblock.new;
          let creds={user:user,pass:pass};
          let creds2={user:user,pass:pass2};
	      let hashPass=this.globalVars.getHashPass(creds);
	      let hashPass2=this.globalVars.getHashPass(creds2);

	      this.body=JSON.stringify({
	       esbRequest: {
	          f0: "0200",
	          f2: this.globalVars.getUsername(),
	          f3: "120200",
	          ESBUser: "chapchapplus",
	          ESBWS: "http://192.168.60.233:7010/ESBWSConnector",
	          ESBPassword: "chapchapplus",
	          data:{
	            37: this.token.field37,
	            PASSWORD:hashPass2
	          }  
	        },
	        mnoSession: {
	          id: this.globalVars.getDate("9"),
	          msisdn: this.globalVars.getUsername(),
	          password:hashPass,
	          deviceid: this.device.uuid
	        }  
	      });
	        
	      this.body=this.globalVars.getEncryptedVars(this.body);
	     // console.log(this.body);
	      
	      let loader = this.loadingController.create({content:'Updating details'});
	      loader.present();
	      let body=this.body;
	      let header= this.token;
	     // console.log(header.hmac+"________"+header.token);
	      this.apiConnect.load(body,header).then(data => {
	        loader.dismiss();
	        this.data=data;
	        if(this.data.error==""){
	          
	          let response=this.globalVars.getDecryptedVars(this.data.data);
	          // console.log(response);
	          if(response.field39=="00"){
	            
	            this.navCtrl.setRoot('LoginPage'); 
	          }
	          else{
	            let template="<div>Failed to update details<br> Kindly try again</div>";
	            let obj={body:this.body, template:template, completed:true, pageTo:''};
	            let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
	            myModal.present();
	          }
	        }
	        else{
	          let template="<div>"+this.data.error+"</div>";
	          let obj={body:this.body, template:template, completed:true, pageTo:''};
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
    
  

}
