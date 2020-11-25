import { Plugins } from '@capacitor/core';
import { NavParams } from '@ionic/angular';
const { Storage } = Plugins;
const { Geolocation } = Plugins;
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import {
  NativeGeocoder,
} from "@ionic-native/native-geocoder/ngx";

import { Observable, Subscription } from "rxjs";

import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { AuslieferungenService } from 'src/app/services/auslieferungen.service';
import { ModalController } from '@ionic/angular';
const TOKEN_KEY = 'routes';

declare var google;

@Component({
  selector: 'app-overview-map',
  templateUrl: './overview-map.page.html',
  styleUrls: ['./overview-map.page.scss'],
})
export class OverviewMapPage implements OnInit {
 
  //import { Geolocation } from '@ionic-native/geolocation/ngx';
    @ViewChild("map", { static: false }) mapElement: ElementRef;
    map: any;
    address: string;
    lat: string;
    long: string;
    autocomplete: { input: string };
    autocompleteItems: any[];
    location: any;
    placeid: any;
    GoogleAutocomplete: any;
  
    // Firebase Data
    locations: Observable<any>;
  
    //#region MapVariables
    markers = [];
    waypointString: string;
  
    waypointArray: google.maps.DirectionsWaypoint[] = [];
  
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    infowindow = new google.maps.InfoWindow();
    //#endregion
  
    //#region MiscVariables
    isTracking = false;
    watch: string;
    user = true;
    //username = Storage.get({ key: 'username' });
    adresse: string;
  
    trackedRoute = [];
    previousTracks = [];
  
    currentMapTrack = null;
  
    positionSubscription: Subscription;

    totalSum: number;

  
    currentLatLng = Geolocation.getCurrentPosition()
    .then((resp) => {
      this.currentLatLng = new google.maps.LatLng(
        resp.coords.latitude,
        resp.coords.longitude
      );   });
  
      //@Input() preorderList:any;
      preorderList = this.navParams.get('drivenList');
  
      @Output() preListEvent = new EventEmitter();
  //#endregion
    constructor(
      private nativeGeocoder: NativeGeocoder,
      public zone: NgZone,
      private ln: LaunchNavigator,
      private ausliefererService: AuslieferungenService,
      private modalCtrl: ModalController,
  
      private navParams: NavParams
    ) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: "" };
      this.autocompleteItems = [];
    }
    ngOnInit() {
      this.loadMap();
      const modalState = {
        modal : true,
        desc : 'fake state for our modal'//damit der user nicht eine seite zurück geht wenn er auf dem Modal den Hardware-Back-Button drückt
      };
      history.pushState(modalState, null);
    }
  
    ngOnDestroy() {
      if (window.history.state.modal) {
        history.back();
      }
    }
  
  
    
    async getBusinessAddress(){
      var address =  await Storage.get({ key: 'BetriebsLocation' }); 
      return address.value;
    }
  
    loadMap() {
      Geolocation.getCurrentPosition()
        .then((resp) => {
          let latLng = new google.maps.LatLng(
            resp.coords.latitude,
            resp.coords.longitude
          );
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          };
  
          this.map = new google.maps.Map(
            this.mapElement.nativeElement,
            mapOptions
          );
          this.directionsRenderer.setMap(this.map);

          this.calculateAndDisplayRoute();
        })
        .catch((error) => {
          console.log("Error getting location", error);
        });
    }
    //#region Infowindow
    async placeMarker(response, context, text){
        const startAddress = await this.getBusinessAddress();
        if(response.start_address.substring(0,3) === startAddress.substring(0,3)){
          var startmarker = new google.maps.Marker({
            position: response.start_location,
            icon:{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            },
            map: this.map
          });
        }
        var marker = new google.maps.Marker({
          position: response.end_location,
          map: this.map
        });
        marker.addListener('click', function() {      
          context.infowindow.close();//close previously opened infowindow
          context.infowindow.setContent(text);      
          context.infowindow.open(context.map, marker);      
       });
       
    }
  
    //#endregion

  

    
  
    deleteWaypoint(waypoint){
      var wayptIndex = this.waypointArray.indexOf(waypoint);
      this.waypointArray.splice(wayptIndex, 1);
    }


    //#region routeCalc
    async calculateAndDisplayRoute() {
      this.waypointArray=[];
      // var routeLegsArray;
      // var contentArray;    
      var context = this;
      const address = await this.getBusinessAddress();
      this.totalSum = 0;
  
      ///////////test mit hardcodewaypoints später nochmal ändern
      for(var i = 1; i<this.preorderList.length; i++){
        this.waypointArray.push({
          location: this.preorderList[i].DeliveryAddressData,
          stopover: true,      
        });
        this.totalSum = this.totalSum + this.preorderList[i].TotalPrice;
      }
         
      this.directionsService.route(
        {
          origin: address,//Betriebsadresse
          destination: address, //Betriebsadresse
          waypoints: this.waypointArray, 
          optimizeWaypoints: true,
          travelMode: 'DRIVING',
          drivingOptions: {
            trafficModel: "pessimistic",
            departureTime: new Date()
          },
        },
        (response, status) => {
          if (status === "OK") {
            this.directionsRenderer.setDirections(response);  
              var my_route = response.routes[0];
              
              for (var i = 0; i < my_route.legs.length; i++){
  
                    for(var j = 1; j<context.preorderList.length; j++){////Hier j auf 1 und <= gemacht, nur zur erinnerung
                      
                      if(my_route.legs[i].end_address.substring(0,3) === context.preorderList[j].DeliveryAddressData.substring(0,3)){//weil die adressendarstellung von google anders ist als normale usereingaben, kann probleme werfen wenn der user die straßennamen nicht richtig eingibt, google findet die straßen trotzdem aber es werden keine marker gesetzt
                        var content = `<div id="infowindow">
                          Das ist Stop ${[i+1]} <br>
                          Geschätzte Dauer ab dem letzten Stop: ${my_route.legs[i].duration.text} <br>
                          Name: ${context.preorderList[j].CustomerData}<br>
                          Preis: ${context.preorderList[j].TotalPrice}€<br>
                          Kommentar: ${context.preorderList[j].CustomerMessage}
                          </div>`;
                          ///////In das div muss noch der anruf/SMS-Button für den kunden
                        context.placeMarker(my_route.legs[i], context, content);
                        // contentArray.push(content);
                        // routeLegsArray.push(my_route.legs[i])
                      }
                    }
                
              }
              
          }
          //google.maps.event.trigger(this.map, 'resize');
        }
      );
      
      // this.reloadMarkers(routeLegsArray, context, contentArray);
      // debugger;
    }
  
    
  
    clearWaypoints(){  
      let i = 0;
      while(i<this.waypointArray.length){
        this.deleteWaypoint(i);
      }
    } 
    //#endregion
    //#region tracking
    // Muss noch angepasst werden mit der ID vom Fahrer etc
  
    async loadHistoricRoutes() {
      // this.storage.get('routes').then(data => { //Aus der Datenbank machen
      //   if (data) {
      //     this.previousTracks = data;
      //   }
      // });
      const ret = await Storage.get({ key: TOKEN_KEY });    
      const prevRoutes = JSON.parse(ret.value);
      if(prevRoutes){
        this.previousTracks = prevRoutes;
      }
    }
  
   
       
      showHistoryRoute(route) {
        this.redrawPath(route);
      }
   
    redrawPath(path) {
      if (this.currentMapTrack) {
        this.currentMapTrack.setMap(null);
      }
   
      if (path.length > 1) {
        this.currentMapTrack = new google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: '#ff00ff',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });
        this.currentMapTrack.setMap(this.map);
      }
    }

  
    //#endregion

    @HostListener('window:popstate', ['$event'])
    abbruch(){
      this.preListEvent.emit(this.preorderList);
      this.modalCtrl.dismiss(this.preorderList);
    }
  
    fahrtBeendet(){
      for(var i = 0; i<this.preorderList.length; i++){
        this.preorderList[i].Status = 5;
      }
      this.preListEvent.emit(this.preorderList);
      this.modalCtrl.dismiss(this.preorderList);
  
      ////////////////Hier noch implementieren dass nichts in die claimedlist kommt sondern direkt in die datenbank geladen wird
    }
  }
  
  




