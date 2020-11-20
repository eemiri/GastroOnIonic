import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { Plugins } from "@capacitor/core";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { AuslieferungenService } from 'src/app/services/auslieferungen.service';
import { ModalController, NavParams } from '@ionic/angular';

const { Geolocation } = Plugins;
const { Storage } = Plugins; //hier später durch die Datenbank ersetzen

const TOKEN_ID = 'stopWatching';
const TOKEN_KEY = 'routes';

declare var google;

@Component({
  selector: "app-auslieferer-map",
  templateUrl: "./auslieferer-map.page.html",
  styleUrls: ["./auslieferer-map.page.scss"],
})
export class AusliefererMapPage implements OnInit {
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
  locationsCollection: AngularFirestoreCollection<any>;

  //#region MapVariables
  markers = [];
  waypointString: string;

  waypointArray: google.maps.DirectionsWaypoint[] = [];
  waypointCollection: AngularFirestoreCollection<any>;

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

  currentAddress = Geolocation.getCurrentPosition().then((resp) => {
    this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  });

  currentLatLng = Geolocation.getCurrentPosition()
  .then((resp) => {
    this.currentLatLng = new google.maps.LatLng(
      resp.coords.latitude,
      resp.coords.longitude
    );   });

    //@Input() preorderList:any;
    preorderList = this.navParams.get('liste');

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


        //For Routing
        this.directionsRenderer.setMap(this.map);

        // this.map.addListener("tilesloaded", () => {
        //   //listens to map-movements
        //   console.log("accuracy", this.map, this.map.center.lat());
        //   this.getAddressFromCoords(
        //     this.map.center.lat(),
        //     this.map.center.lng()
        //   );
        //   this.lat = this.map.center.lat();
        //   this.long = this.map.center.lng();
        // });
        this.calculateAndDisplayRoute();
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }
  //#region Infowindow
  placeMarker(response, context, text){
    var marker = new google.maps.Marker({
      position: response.end_location,
      map: this.map
    });
    
    // debugger;
    marker.addListener('click', function() {      
      context.infowindow.close();//close previously opened infowindow
      context.infowindow.setContent(text);      
      context.infowindow.open(context.map, marker);      
   });
   this.markers.push(marker);
  }
  
  reloadMarkers(routeLegsArray, context, contentArray){
    for(var i = 0; i< this.markers.length; i++){
      this.markers[i].setMap(null);
    }
    for(var j = 0; i< this.markers.length; j++){
      this.placeMarker(routeLegsArray[j], context, contentArray[i])
    }
  }

  //#endregion
  //#region autocomplete

  getCurrentAddress() {
    Geolocation.getCurrentPosition().then((resp) => {
      this.nativeGeocoder
        .reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result) => {
          return result.toString();
        });
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5,
    };
    this.nativeGeocoder
      .reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0) responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords() {
    alert("lat" + this.lat + ", long" + this.long);
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    if (this.autocomplete.input == "") {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions(
      { input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      }
    );
  }
  SelectSearchResult(item) {
    this.placeid = item.place_id;
    this.waypointArray.push({
      location: item.description,
      stopover: true,      
    });
  }

  deleteWaypoint(waypoint){
    var wayptIndex = this.waypointArray.indexOf(waypoint);
    this.waypointArray.splice(wayptIndex, 1);
  }

  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete() {
    this.autocompleteItems = [];
    this.autocomplete.input = "";
  }

  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo() {
    return (window.location.href =
      "https://www.google.com/maps/search/?api=1&query=Google&query_place_id=" +
      this.placeid);
  } 
  //#endregion
  //#region routeCalc
  async calculateAndDisplayRoute() {
    this.markers = [];
    this.waypointArray=[];
    // var routeLegsArray;
    // var contentArray;    
    var context = this;
    const address = await this.getBusinessAddress();

    ///////////test mit hardcodewaypoints später nochmal ändern
    for(var i = 0; i<this.preorderList.length; i++){
      this.waypointArray.push({
        location: this.preorderList[i].DeliveryAddressData,
        stopover: true,      
      });
    }
    
  
    this.directionsService.route(
      {
        origin: address,//Betriebsadresse, placeholders
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

                  for(var j = 0; j<context.preorderList.length; j++){
                    
                    if(my_route.legs[i].end_address.substring(0,3) === context.preorderList[j].DeliveryAddressData.substring(0,3)){//weil die adressendarstellung von google anders ist als normale usereingaben, kann probleme werfen wenn der user die straßennamen nicht richtig eingibt, google findet die straßen trotzdem aber es werden keine marker gesetzt
                      var content = `<div id="infowindow">
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

  startTracking() {
    this.isTracking = true;
    this.trackedRoute = [];
      
      this.watch = Geolocation.watchPosition({}, (position, err) =>{
        if(position){
          this.trackedRoute.push({ lat: position.coords.latitude, lng: position.coords.longitude });
          this.redrawPath(this.trackedRoute);
        }
      });
  }

    stopTracking() {
      let newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
      this.previousTracks.push(newRoute);
      Storage.set({key: TOKEN_KEY, value: JSON.stringify(this.previousTracks)});//Datenbank
     
      this.isTracking = false;
      Geolocation.clearWatch({id: TOKEN_ID});
      this.currentMapTrack.setMap(null);
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





  //  Perform an anonymous login and load data
  // anonLogin() {
  //   this.afAuth.signInAnonymously().then((res) => {
  //     this.user = res.user;
  //     this.locationsCollection = this.afs.collection(
  //       `locations/${this.user.uid}/track`,
  //       (ref) => ref.orderBy("timestamp")
  //     ); // Make sure we also get the Firebase item ID!
  //     this.locations = this.locationsCollection.snapshotChanges().pipe(
  //       map((actions) =>
  //         actions.map((a) => {
  //           const data = a.payload.doc.data();
  //           const id = a.payload.doc.id;
  //           return { id, ...data };
  //         })
  //       )
  //     ); // Update Map marker on every change
  //     this.locations.subscribe((locations) => {
  //       this.updateMap(locations);
  //     });
  //   });
  // } 
  // Use Capacitor to track our geolocation
  // startTracking() {
  //   this.isTracking = true;
  //   this.watch = Geolocation.watchPosition({}, (position, err) => {
  //     //see if i can change the timer to reduce batteryconsumption
  //     if (position) {
  //       this.addNewLocation(
  //         position.coords.latitude,
  //         position.coords.longitude,
  //         position.timestamp
  //       );
  //     }
  //   });
  // } // Unsubscribe from the geolocation watch using the initial ID
  // stopTracking() {
  //   Geolocation.clearWatch({ id: this.watch }).then(() => {
  //     this.isTracking = false;
  //   });
  // } // Save a new location to Firebase and center the map
  // addNewLocation(lat, lng, timestamp) {
  //   this.locationsCollection.add({
  //     lat,
  //     lng,
  //     timestamp,
  //   });
  //   let position = new google.maps.LatLng(lat, lng);
  //   this.map.setCenter(position);
  //   this.map.setZoom(15);
  // } // Delete a location from Firebase
  // deleteLocation(pos) {
  //   this.locationsCollection.doc(pos.id).delete();
  // } // Redraw all markers on the map
  // updateMap(locations) {
  //   // Remove all current marker
  //   this.markers.map((marker) => marker.setMap(null));
  //   this.markers = [];
  //   for (let loc of locations) {
  //     let latLng = new google.maps.LatLng(loc.lat, loc.lng);
  //     let marker = new google.maps.Marker({
  //       map: this.map,
  //       animation: google.maps.Animation.DROP,
  //       position: latLng,
  //     });
  //     this.markers.push(marker);
  //   }
  // }

  //#endregion
  //#region MapsLaunch
  createWaypointString(){
    for(let i = 0; i < this.waypointArray.length; i++){
      if(i<this.waypointArray.length){
        this.waypointString = this.waypointArray[i].toString() + "+to:";
      }
      else{
        this.waypointString = this.waypointArray[i].toString();
      }
    }
  }

  async launchnavigator(){
    const address = await this.getBusinessAddress();
    this.ln.navigate(this.waypointString,{
      start: address//adresse vom betrieb
    });    
  }
  //#endregion

  abbruch(){
    this.preListEvent.emit(this.preorderList);
    this.modalCtrl.dismiss(this.preorderList);
  }
}
