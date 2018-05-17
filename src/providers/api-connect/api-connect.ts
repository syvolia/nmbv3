import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';

/*
  Generated class for the ApiConnect provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ApiConnectProvider {
  data: any;
  constructor(public http: Http) {
    
  }
  load(body,header) {
      //let url = 'http://192.168.114.221:7010/CCPLUSBackEnd1.1/CCPMainRequest';
      
	  //let url = 'https://192.168.114.221:8000/NMBMobileBackEnd/NMBMobileBackEnd';
	  //let url = 'http://192.168.114.221:7010/NMBMobileBackEnd/NMBMobileBackEnd';
	  let url='https://banking.nmbtz.com/NMBMobileBackEnd/NMBMobileBackEnd';
	  let headers = new Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
		'token':header.token,
		'client_ID':header.hmac
	  });
			  
	  let options = new RequestOptions({ headers: headers });
	  
	  // don't have the data yet
	  console.log(body);
	  return new Promise(resolve => {
	  
		// We're using Angular HTTP provider to request the data,
		// then on the response, it'll map the JSON data to a parsed JS object.
		// Next, we process the data and resolve the promise with the new data.
		
		this.http.post(url, body, options)
		  .timeout(20000)
		  .map(res => res.text())
		  .subscribe((data) => {
		  
			// we've got back the raw data, now generate the core schedule data
			// and save the data for later reference
			
			this.data = data;
			console.log(this.data);
			resolve({data:this.data,error:""});
			
		  },(err) => { 
		        console.log(err);
		        if(err!='Request timed out kindly try again later'){
				    err="Connection error";
				}
		        resolve({data:"",error:err}); 
			
			});
	  });
	  
	}
	nmbMap(lat,lng, maptype){
		let url="";
		if(maptype=="Branch"){
		   url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=%22NMB%20branch%22&radius=10&key=AIzaSyDLyTYlK-F737Twp3L9xP7gAlnHkd4vlz4&&location='+lat+','+lng+'&type=point_of_interest';
		}
		else{
		   url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=%22NMB%20atm%22&radius=10&key=AIzaSyDLyTYlK-F737Twp3L9xP7gAlnHkd4vlz4&&location='+lat+','+lng+'&type=point_of_interest';
		}
		return new Promise(resolve => {
 
            this.http.get(url).map(res => res.json()).subscribe(data => {
 
                this.data = data;
				console.log(data);
                resolve({data:this.data,error:""});
 
            },err => {
        	    console.log(err);
		        if(err!='Request timed out kindly try again later'){
				    err="Connection error";
				}
		        resolve({data:"",error:err}); 
		    });

        });

	}
}