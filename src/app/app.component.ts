import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';

import { GlobalVarsProvider } from '../providers/global-vars/global-vars';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

 
 public rootPage: any = 'WelcomePage';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  browser:any;

  pages: Array<{title: string, component: string, icon:any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
   private idle: Idle, private keepalive: Keepalive, private keyboard: Keyboard,
    private toast: Toast, public modalCtrl: ModalController, public globalVars: GlobalVarsProvider, private iab: InAppBrowser) {
    this.initializeApp();
    this.createMenu();
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(200);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
    
      if(this.nav.getActive().name!="Login"){
        /*if(!this.globalVars.getLock()){
          this.nav.setRoot('Login');
         /* let template="<div>Ooops! Took too long to respond.<br>Kindly log in again</div>";
          let obj={body:"", template:template, endUrl:"", completed:true, pageTo:''};
          let myModal = this.modalCtrl.create('ConfirmModal',obj);
          myModal.present();
          this.globalVars.setLock(true);
                  }*/
        this.reset();
      }else{
        this.reset();
      }
    
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => {
      /*if(this.nav.getActive().name!="Login"){
        toast.show('You will time out in ' + countdown + ' seconds!', '1000', 'bottom').subscribe(
          toast => {
          console.log(toast);
          }
        );
      }*/
    }
  );

  // sets the ping interval to 15 seconds
  keepalive.interval(15);

  keepalive.onPing.subscribe(() => this.lastPing = new Date());

  this.reset();
  

    
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.keyboard.hideKeyboardAccessoryBar(false);
      // set status bar to white
      //this.statusBar.backgroundColorByHexString('#00543C');
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);
    });
  }

  createMenu(){
    this.pages = [
      { title: 'Main Services', component: 'MainPage', icon:'grid' },
      { title: 'NMB News', component: 'MainPage', icon:'wifi' },
      { title: 'About NMB', component: 'MainPage', icon:'information-circle' },
      { title: 'Contact Us', component: 'ContactsPage', icon:'call' },
      { title: 'Locate Us', component: 'LocationPage', icon:'locate' },
      { title: 'Log Out', component: 'LoginPage', icon:'log-out' },
    
    ];
  }

  openPage(page) {
    if(page.title=="About NMB"){
      this.openBrowser("https://www.nmbtz.com/about-nmb");
    }
    else if(page.title=="NMB News"){
      this.openBrowser("https://www.nmbtz.com/media-news-centre");
    }
    else if(page.title=="Locate Us"||page.title=="Contact Us"){
      this.nav.setRoot(page.component,{fromMain:true});
    }
    else{
      this.nav.setRoot(page.component);
    }
  }
  
  openBrowser(url) {
    this.browser= this.iab.create(url);
    this.browser.show();
  }
}

