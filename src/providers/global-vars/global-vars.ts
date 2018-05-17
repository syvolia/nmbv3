import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';

/*
  Generated class for the GlobalVarsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GlobalVarsProvider {

  locationsLoaded: any;
  currentLocation: any={};
  lock:boolean;
  accounts:any=[];
  mobileNo:string;
  token:string;
  customername:string;
  chapAccount:string;
  currencyTemplate:any=[];
  linkedCards=[];
  CIF:string="";
  email:string="";
  maptype:string="";
  fromLogin:boolean=false;
  
  constructor(public http: Http, private datePipe: DatePipe) {
    console.log('Hello GlobalVarsProvider Provider');
  }
  doAESencrypt(data, uuid){
    let encrypted= '' +CryptoJS.AES.encrypt(data, uuid);
    return encrypted;
  }
  doAESdecrypt(encrypted, uuid){
    let decrypted=CryptoJS.AES.decrypt(encrypted, uuid).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
  doHmac(message){
    let myhmac=CryptoJS.HmacSHA256(message, "secret").toString(CryptoJS.enc.Hex);
    return myhmac;
  }
  //sets
  setEmail(email){
    this.email=email;
  }
  setChapAccount(chapAccount){
    this.chapAccount=chapAccount;
  }
  setLocationLoaded(data){
    this.locationsLoaded=new Array();
    this.locationsLoaded=data;
  }

  setUsername(value){
    this.mobileNo=value;
  }
  setCustomerName(value){
    this.customername=value;
  }
  setMapType(type){
    this.maptype=type;
  }
  setCurrentLocation(data){
    this.currentLocation=data;
  }

  setLock(value){
    this.lock=value;
  }
  setAccounts(value){
    this.accounts=value;
  }
  setCurrencyTemplate(template){
    this.currencyTemplate=template;
  }
  setCIF(CIF){
    this.CIF=CIF;
  }
  setFromLogin(value){
    this.fromLogin=value;
  }
  createToken(){
    let field37=this.pad(this.getRandom(),9);
    let field11=this.pad(this.getRandom(),6);
    let tro=this.doHmac("scitcelce@wap");
    let words=CryptoJS.enc.Utf8.parse(field37+this.doHmac("scitcelce@wap"));
    let base64=CryptoJS.enc.Base64.stringify(words);
    let token = this.doHmac(base64);
    return {field37:field37,field11:field11,token:token,hmac:tro};
  }
  pad(num, size) {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
  //gets
  getDate(field){
    if(field=="7"){
      let newDate = this.datePipe.transform(new Date(), 'MMddHHmmss');
      return newDate;
      
    }
    else if(field=="12"){
      let newDate = this.datePipe.transform(new Date(), 'HHmmss');
      return newDate;
    }
    else if(field=="9"){
      let newDate = this.datePipe.transform(new Date(), 'ddHHmmss');
      return newDate;
    }
  }
  getEmail(){
    return this.email;
  }
  getCurrencyTemplate(){
    return this.currencyTemplate;
  }
  getLinkedCards(){
    return this.linkedCards;
  }
  getFromLogin(){
    return this.fromLogin;
  }
  getRandom() {
    let min =100000;
    let max =999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getCustomerName(){
    return this.customername;
  }
  getChapAccount(){
    return this.chapAccount; 
  }
  getLock(){
    return this.lock;
  }
  getAccounts(){
    return this.accounts;
  }
  getUsername(){
    return this.mobileNo;
  }
  getCIF(){
    return this.CIF;
  }
  getMapType(){
    return this.maptype;
  }
  getEncryptedVars(userdata){
  
    let key =CryptoJS.enc.Utf8.parse('da0k188qL5OiY3eX');
    let iv  = CryptoJS.enc.Utf8.parse('_VSUrIqGV2pHSye1');
    
    let encrypted = CryptoJS.AES.encrypt(userdata, key, {
      mode: CryptoJS.mode.CBC, 
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    });
    encrypted=encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    
    return encrypted;
  }
  getDecryptedVars(response){
     
    let key =CryptoJS.enc.Utf8.parse('da0k188qL5OiY3eX');
    let iv  = CryptoJS.enc.Utf8.parse('_VSUrIqGV2pHSye1');
    
    response=response.trim();
    let decryptedData = CryptoJS.AES.decrypt( response, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    }); 
        
    let decrypted=decryptedData.toString( CryptoJS.enc.Utf8 ); 
    
    let decryptedResponse;
    
    if (decrypted!=""){
      //console.log(decryptedData.toString( CryptoJS.enc.Utf8 ));
      decryptedResponse=JSON.parse(decryptedData.toString( CryptoJS.enc.Utf8 ));
    }
    else{
        decryptedResponse={success:false,message:"Service Currently Unavailable"};
    }
    //console.log(decryptedResponse);
    return decryptedResponse;
  
  }

 
  getLocationLoaded(){
      return this.locationsLoaded;
  }
  
  getCurrentLocation(){
      return this.currentLocation;
  }
  getHashPass(creds){
     let user="255"+creds.user.substr(creds.user.length-9);
     let words=CryptoJS.enc.Utf8.parse(user+creds.pass);
     let base64=CryptoJS.enc.Base64.stringify(words);
     let hashPass=CryptoJS.HmacSHA256(base64, "secret").toString(CryptoJS.enc.Hex);
     return hashPass;
  }

}
