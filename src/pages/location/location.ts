import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, ModalController, App} from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { Geolocation } from '@ionic-native/geolocation';
import { ApiConnectProvider } from '../../providers/api-connect/api-connect';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the LocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers:any=[];
  data:any;
  fromMain:boolean=false;
  maptype:string="Branch";
  fromLogin:boolean=false;
  constructor(public appCtrl:  App, public navCtrl: NavController, private geolocation: Geolocation, public navParams: NavParams,
  	private toast: Toast, public apiConnect: ApiConnectProvider, public globalVars: GlobalVarsProvider
  	, public loadingController: LoadingController, public connectivityService: ConnectivityServiceProvider, public modalCtrl: ModalController) {
    this.fromMain=navParams.get('fromMain');
    this.fromLogin=this.globalVars.getFromLogin();
    this.maptype=this.globalVars.getMapType()||'Branch';
  }


  ionViewDidLoad(){
    this.loadMap();
  }
  close(){

    if(this.fromLogin){
      this.globalVars.setFromLogin(false);
      this.appCtrl.getRootNav().setRoot('LoginPage');
    }
    else{
      this.appCtrl.getRootNav().setRoot('MainPage');
    }
  }
  loadMap(){
    let geo_options = {
      enableHighAccuracy: true, 
      maximumAge        : 30000, 
      timeout           : 15000
    };
    this.geolocation.getCurrentPosition(geo_options).then((position) => {
	    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 
	    let mapOptions = {
	      center: latLng,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    }
	 
	    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	    this.addMarker("My Spot",position.coords.latitude, position.coords.longitude,"http://maps.google.com/mapfiles/ms/icons/green-dot.png");
	    let trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.map);
      this.getNMBlocations(position.coords.latitude,position.coords.longitude);
    }, (err) => {
      console.log(err);
      let template="<div>Sorry could not get location.<br>Check Location Settings<br>Resolving to default</div>";
      let obj={body:"", template:template, completed:true, pageTo:''};
      let myModal = this.modalCtrl.create('ConfirmModalPage',obj);
      myModal.present();
      let latLng = new google.maps.LatLng(-3.6706684, 33.3575056);
   
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
   
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker("My Spot",-3.6706684, 33.3575056,"http://maps.google.com/mapfiles/ms/icons/green-dot.png");
      let trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(this.map);
      this.getNMBlocations(-3.6706684,33.3575056);
    });
  }
  
  addMarker(title,lat: number, lng: number, iconUrl: string): void {
    let latLng = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
	  icon: iconUrl,
      map: this.map,
      position: latLng,
      animation: google.maps.Animation.DROP,
    });	
    let content = "<h4>"+title+"</h4>";          
    this.addInfoWindow(marker, content);
    this.markers.push(marker);  

  }
  removeMarkers(){
      for(var i=0;i<this.markers.length;i++){
	     this.markers[i].setMap(null);
	  }
	  
  }
  removeMarkersComp(){
      this.markers=[];
  }
  addInfoWindow(marker, content){
	  let infoWindow = new google.maps.InfoWindow({
		content: content
	  });
	  google.maps.event.addListener(marker, 'click', () => {
		infoWindow.open(this.map, marker);
	  });
	 
  }
  getNMBlocations(lat,lng){
  	if(this.connectivityService.isOnline()){
      let loader = this.loadingController.create({content:'Fetching Co-ordinates'});
      loader.present();
      this.apiConnect.nmbMap(lat,lng,this.maptype).then(data => {
        loader.dismiss();
        this.data=data;
        console.log(this.data.data);
        if(this.data.error==""){
          for(var i=0;i<this.data.data.results.length;i++){
          	this.addMarker(this.data.data.results[i].name+" ("+this.data.data.results[i].formatted_address
+")",this.data.data.results[i].geometry.location.lat, this.data.data.results[i].geometry.location.lng,"http://maps.google.com/mapfiles/ms/icons/red-dot.png");
          }
        
        }
        else{
            this.toast.show("Request failed"+this.data.error, '8000', 'bottom').subscribe(
		      toast => {
		        console.log(toast);
		    });
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
