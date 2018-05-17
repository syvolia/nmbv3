import { Injectable } from '@angular/core';
import { Contacts, Contact } from '@ionic-native/contacts';

/*
  Generated class for the Contacts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactsProvider {
  contact:Contact;
  name:string;
  mycontact:any;

  constructor(private contacts: Contacts) {
    console.log('Hello Contacts Provider');
  }
  pickContact(): Promise<any>{
  	return new Promise((resolve) => {
	  this.contacts.pickContact().then(data => {
        this.contact=data;
        let phoneNumbers=[];
        for(var i=0;i<this.contact.phoneNumbers.length;i++){
        	let rawContact=this.contact.phoneNumbers[i].value.replace(/[^\d]/g, '').replace(/\D/g,'');
        	let formattedContact=this.validateResponse(rawContact);
        	if(formattedContact!=""){
	            phoneNumbers.push(formattedContact);
	        }
        }
        if(this.contact.displayName!=undefined||this.contact.displayName!=null){
	        this.name=this.contact.displayName;
	    }
	    else{
	    	this.name=" ";
	    }
	   
	    this.mycontact={phoneNo:phoneNumbers,name:this.name};
	    resolve(this.mycontact);
        
	  },(error: any) => console.error('Error saving contact.', error));

    });
  }
  validateResponse(res){
  	let validateResponse="";
    if (res.indexOf("7") == 0) {
		res = "0" + res;
		if (!(/^\d{10}$/.test(res))) {
			validateResponse = "";
			return validateResponse;
		} else {
			validateResponse = res;
			return validateResponse;

		}
	} else if (res.substring(0, 4) == "+255") {
        
		if (!(/^\d{10}$/.test(res))) {
			validateResponse = "";
			return validateResponse;
		} else {
			validateResponse = res;
			return validateResponse;

		}

	} else if (res.substring(0, 3) == "255") {
		res = res.replace("255", "0");
		if (!(/^\d{10}$/.test(res))) {
			validateResponse = "";
			return validateResponse;
		} else {
			validateResponse = res;
			return validateResponse;

		}
	} else if (res.substring(0, 2) != "07") {
		validateResponse = "";
		return validateResponse;
	} else if (!(/^\d{10}$/.test(res))) {
		validateResponse = "";
		return validateResponse;
	} else {

		validateResponse = res;
		return validateResponse;
	}
    
  }

}
