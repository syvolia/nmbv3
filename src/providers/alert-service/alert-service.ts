import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the AlertServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertServiceProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello AlertServiceProvider Provider');
  }
  showRadioAlert(phoneNo): Promise<any>{
  	return new Promise((resolve) => {
	    let alert = this.alertCtrl.create({cssClass:'alertTitle'});
	    alert.setTitle('Select mobile number');
	    for(var i=0;i<phoneNo.length;i++){
		    alert.addInput({type: 'radio', label: phoneNo[i], value: phoneNo[i]});
		}
	     
	    alert.addButton('Cancel');
	    alert.addButton({
	      text: 'OK',
	      handler: data => {
	        let chosenPhone = data;
	        resolve(chosenPhone);
	      }
	    });
	    alert.present();
	});
  }

}
