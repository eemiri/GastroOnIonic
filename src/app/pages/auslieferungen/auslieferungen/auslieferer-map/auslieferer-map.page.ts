import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { Plugins } from '@capacitor/core';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
const { Geolocation } = Plugins;
const loadGoogleMapsApi = require('load-google-maps-api');

 
declare var google; //Problems with the google keyword
 
@Component({
  selector: 'app-auslieferer-map',
  templateUrl: './auslieferer-map.page.html',
  styleUrls: ['./auslieferer-map.page.scss'],
})
export class AusliefererMapPage {
  // Firebase Data
  locations: Observable<any>;
  locationsCollection: AngularFirestoreCollection<any>;
 
  // Map related
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  address:string;
  lat: string;
  long: string;  
 
  // Misc
  isTracking = false;
  watch: string;
  user = null;
  placeid: any;
  loading = true;

  //Searchbar
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  
 
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private nativeGeocoder: NativeGeocoder, private zone: NgZone) {
    this.anonLogin();
  }
 
  ionViewWillEnter() {
    this.loadMap();
  }
 
 
 
  // Initialize a blank map
  loadMap() {
    this.loading = true;
    

    Geolocation.getCurrentPosition().then((resp) =>{
      // 
      

      //Load map with previous values as parameters
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      //this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      loadGoogleMapsApi({
        libraries: ['places'],
        key: 'AIzaSyB9hWSUuSgn5WdzqE12L2gsFAkwAUoQC4c'
      }).then((google)=>{
        this.GoogleAutocomplete = new google.places.AutocompleteService();
        this.autocomplete = { input: '' };
        this.autocompleteItems = [];
        let latlng = new google.LatLng(resp.coords.latitude, resp.coords.longitude);//center of the map is the current position
        let mapOptions = {
        center: latlng,
        zoom: 15,
        mapTypeId: google.MapTypeId.ROADMAP
      };
        this.map =  new google.Map(this.mapElement.nativeElement, mapOptions);
        this.loading = false;
      });
      this.map.addListener('tilesLoaded', () =>{
        console.log('accuracy',this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5    
    }; 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value); 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      }); 
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  //WE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING  ==================>>>> Noch anpassen für firebase
    alert(JSON.stringify(item))      
    this.placeid = item.place_id
  }

  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }


////////////////TRACKING//////////////////
   // Perform an anonymous login and load data
  //Muss noch angepasst werden mit der ID vom Fahrer etc
  anonLogin() {
    this.afAuth.signInAnonymously().then(res => {
      this.user = res.user;
 
      this.locationsCollection = this.afs.collection(
        `locations/${this.user.uid}/track`,
        ref => ref.orderBy('timestamp')
      );
 
      // Make sure we also get the Firebase item ID!
      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
 
      // Update Map marker on every change
      this.locations.subscribe(locations => {
        this.updateMap(locations);
      });
    });
  }

  // Use Capacitor to track our geolocation
  startTracking() {
    this.isTracking = true;
    this.watch = Geolocation.watchPosition({}, (position, err) => {//see if i can change the timer to reduce batteryconsumption
      if (position) {
        this.addNewLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        );
      }
    });
  }
  
  // Unsubscribe from the geolocation watch using the initial ID
  stopTracking() {
    Geolocation.clearWatch({ id: this.watch }).then(() => {
      this.isTracking = false;
    });
  }
  
  // Save a new location to Firebase and center the map
  addNewLocation(lat, lng, timestamp) {
    this.locationsCollection.add({
      lat,
      lng,
      timestamp
    });
  
    let position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(15);
  }
  
  // Delete a location from Firebase
  deleteLocation(pos) {
    this.locationsCollection.doc(pos.id).delete();
  }
  
  // Redraw all markers on the map
  updateMap(locations) {
    // Remove all current marker
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];
  
    for (let loc of locations) {
      let latLng = new google.maps.LatLng(loc.lat, loc.lng);
  
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
      this.markers.push(marker);
    }
  }  
}