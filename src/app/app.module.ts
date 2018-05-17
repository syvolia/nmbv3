import 'intl';
import 'intl/locale-data/jsonp/en';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MainPage } from '../pages/main/main';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { DatePipe } from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts } from '@ionic-native/contacts';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Keyboard } from '@ionic-native/keyboard';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { ApiConnectProvider } from '../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { ContactsProvider } from '../providers/contacts/contacts';
import { AlertServiceProvider } from '../providers/alert-service/alert-service';


@NgModule({
  declarations: [
    MyApp,
     MainPage,
     LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
      BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(
      MyApp,{
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'md'}),
    NgIdleKeepaliveModule.forRoot(),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
     MainPage,
      LoginPage,
   SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Toast,
    Network,
    DatePipe,
    InAppBrowser,
    Contacts,
    Device,
    Geolocation,
    Keyboard,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalVarsProvider,
    ApiConnectProvider,
    ConnectivityServiceProvider,
    ContactsProvider,
    AlertServiceProvider
  ]
})
export class AppModule {}
