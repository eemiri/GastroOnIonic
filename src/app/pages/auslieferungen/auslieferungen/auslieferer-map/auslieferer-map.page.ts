import { Component, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
 
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
 
declare var google;
 
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
 
  // Misc
  isTracking = false;
  watch: string;
  user = null;
 
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.anonLogin();
  }
 
  ionViewWillEnter() {
    this.loadMap();
  }
 
  // Perform an anonymous login and load data
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
 
  // Initialize a blank map
  loadMap() {
    let latLng = new google.maps.LatLng(51.9036442, 7.6673267);
 
    let mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  // Use Capacitor to track our geolocation
  startTracking() {
    this.isTracking = true;
    this.watch = Geolocation.watchPosition({}, (position, err) => {
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
    this.map.setZoom(5);
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






















// import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/auth';
// import {
//   AngularFirestore,
//   AngularFirestoreCollection
// } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// //import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

 
// import { Plugins } from '@capacitor/core';
// const { Geolocation } = Plugins;

// // const directionsService = new google.maps.DirectionsService();
// // const directionsRenderer = new google.maps.DirectionsRenderer();

 
// declare var google; //Problems with the google keyword


 
// @Component({
//   selector: 'app-auslieferer-map',
//   templateUrl: './auslieferer-map.page.html',
//   styleUrls: ['./auslieferer-map.page.scss'],
// })
// export class AusliefererMapPage {
//   // Firebase Data
//   locations: Observable<any>;
//   locationsCollection: AngularFirestoreCollection<any>;
 
//   // Map related
//   @ViewChild('map') mapElement: ElementRef;
//   map: any;
//   markers = [];
//   address:string;
//   lat: string;
//   long: string; 
 
//   // Misc
//   isTracking = false;
//   watch: string;
//   user = null;

//   //Autocomplete searchfield
//   GoogleAutocomplete: any;
//   autocomplete: { input: string; };
//   autocompleteItems: any[];
//   location: any;
//   placeid: any;
 
//   constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore,// private nativeGeocoder: NativeGeocoder,    
//     public zone: NgZone) {
//     //this.anonLogin();
//     this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
//     this.autocomplete = { input: '' };
//     this.autocompleteItems = [];
//   }

//   ionViewWillEnter() {
//     this.loadMap();
//   }
 
//   // Perform an anonymous login and load data
//   //Muss noch angepasst werden mit der ID vom Fahrer oder anonym lassen
//   // anonLogin() {
//   //   this.afAuth.signInAnonymously().then(res => {
//   //     this.user = res.user;
 
//   //     this.locationsCollection = this.afs.collection(
//   //       `locations/${this.user.uid}/track`,
//   //       ref => ref.orderBy('timestamp')
//   //     );
 
//   //     // Make sure we also get the Firebase item ID!
//   //     this.locations = this.locationsCollection.snapshotChanges().pipe(
//   //       map(actions =>
//   //         actions.map(a => {
//   //           const data = a.payload.doc.data();
//   //           const id = a.payload.doc.id;
//   //           return { id, ...data };
//   //         })
//   //       )
//   //     );
 
//   //     // Update Map marker on every change
//   //     this.locations.subscribe(locations => {
//   //       this.updateMap(locations);
//   //     });
//   //   });
//   // }
 
//   // Initialize a blank map
//   loadMap() {
//                     // //Get Location from device, das ist vom searchbar autocomplete example
//                     // Geolocation.getCurrentPosition().then((resp) =>{
//                     //   let LatLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);//Coordinates of the device
//                     //   let mapOptions = {
//                     //     center: LatLng,
//                     //     zoom: 15,
//                     //     mapTypeId: google.maps.MapTypeId.ROADMAP
//                     //   }

//                     //   //Load map with previous values as parameters
//                     //   this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
//                     //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
//                     //   this.map.addListener('tilesloaded', () => {
//                     //     console.log('accuracy',this.map, this.map.center.lat());
//                     //     this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
//                     //     this.lat = this.map.center.lat()
//                     //     this.long = this.map.center.lng()
//                     //   }); 
//                     // }).catch((error) =>{
//                     //   console.log('Error getting location', error);
//                     // });
    
    
//     // var defaultBounds = new google.maps.LatLngBounds(//Bias area for autocomplete, by default autocomplete looks at the users IP for bias
//     //   new google.maps.LatLng(49.226029, 6.901808),
//     //   new google.maps.LatLng(49.322340, 7.186278)
//     // );
    
//     // var options = {
//     //   bounds: defaultBounds
//     // };

//     //HTML Input for autocomplete searchbox
//     //var input = document.getElementById('pac-input');
//       //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); //Puts the inputfield into the map

//     //Create autocomplete object
//     //let autocomplete = new google.maps.places.Autocomplete(input);

//     //directionsRenderer.setMap(this.map);// not sure if this is needed here


//     let latLng = new google.maps.LatLng(51.9036442, 7.6673267);
 
//     let mapOptions = {
//       center: latLng,
//       zoom: 5,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
 
//     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
//   }

//   // getAddressFromCoords(lattitude, longitude){
//   //   let options: NativeGeocoderOptions = {
//   //     useLocale: true,
//   //     maxResults: 5
//   //   };
//   //   this.nativeGeocoder.reverseGeocode(lattitude, longitude, options).then((result: NativeGeocoderResult[]) => {
//   //     this.address = "";
//   //     let responseAddress = [];
//   //     for (let [key, value] of Object.entries(result[0])) {
//   //       if (value.length > 0){
//   //         responseAddress.push(value);
//   //       }
//   //     }
//   //     responseAddress.reverse();
//   //     for (let value of responseAddress){
//   //       this.address += value+", ";
//   //     }
//   //     this.address = this.address.slice(0, -2);
//   //   }).catch((error: any)=>{
//   //     this.address= "Address Not Available!";
//   //   });
//   // }

//   //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
//   // ShowCords(){
//   //   alert('lat' +this.lat+', long'+this.long )
//   // }

//   //Autocomplete
//   // UpdateSearchResults(){
//   //   if(this.autocomplete.input ==''){
//   //     this.autocompleteItems = [];
//   //     return;
//   //   }
//   //   this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
//   //     (predictions, status) => {
//   //       this,this.autocompleteItems = [];
//   //       this.zone.run(() =>{
//   //         predictions.forEach((prediction) => {
//   //           this.autocompleteItems.push(prediction);            
//   //         });
//   //       });
//   //     });
//   // }

//   // //WE CALL THIS FROM EACH ITEM.
//   // SelectSearchResult(item) {
//   //   ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
//   //   alert(JSON.stringify(item))      
//   //   this.placeid = item.place_id
//   // }
  
  
//   // //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
//   // ClearAutocomplete(){
//   //   this.autocompleteItems = []
//   //   this.autocomplete.input = ''
//   // }

  

//   //Use Capacitor to track our geolocation
//   startTracking() {
//     this.isTracking = true;
//     this.watch = Geolocation.watchPosition({}, (position, err) => {//see if i can change the timer to reduce batteryconsumption
//       if (position) {
//         this.addNewLocation(
//           position.coords.latitude,
//           position.coords.longitude,
//           position.timestamp
//         );
//       }
//     });
//   }
 
//   // Unsubscribe from the geolocation watch using the initial ID
//   stopTracking() {
//     Geolocation.clearWatch({ id: this.watch }).then(() => {
//       this.isTracking = false;
//     });
//   }
 
//   // Save a new location to Firebase and center the map
//   addNewLocation(lat, lng, timestamp) {
//     this.locationsCollection.add({
//       lat,
//       lng,
//       timestamp
//     });
  
//     let position = new google.maps.LatLng(lat, lng);
//     this.map.setCenter(position);
//     this.map.setZoom(15);
//   }
  
//   // Delete a location from Firebase
//   deleteLocation(pos) {
//     this.locationsCollection.doc(pos.id).delete();
//   }
  
//   // Redraw all markers on the map
//   updateMap(locations) {
//     // Remove all current marker
//     this.markers.map(marker => marker.setMap(null));
//     this.markers = [];
  
//     for (let loc of locations) {
//       let latLng = new google.maps.LatLng(loc.lat, loc.lng);
  
//       let marker = new google.maps.Marker({
//         map: this.map,
//         animation: google.maps.Animation.DROP,
//         position: latLng
//       });
//       this.markers.push(marker);
//     }
//   }

//   // submit(){  //submit button to calculate route
//   //   this.calculateAndDisplayRoute(directionsService, directionsRenderer);
//   // }

//   // calculateAndDisplayRoute(directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer){
//   //   let waypts: google.maps.DirectionsWaypoint[] = []; //Push the destinations into this array

//   //   // waypts.push({
//   //   //   location: userInput Address,
//   //   //   stopover: true,
//   //   // });


//   //   directionsService.route(
//   //     {
//   //     origin:"Vorstadtstraße 57, 66117 Saarbrücken" ,//Origin and destination are both the same place witht ehe waypoints being the factor that generates a route
//   //     destination: "Vorstadtstraße 57, 66117 Saarbrücken",
//   //     waypoints: waypts,
//   //     optimizeWaypoints: true,
//   //     travelMode: google.maps.TravelMode.DRIVING,
//   //     //drivingoptions: Display time when driver is starting with (departuretime) and the time in traffic with (trafficModel)
//   //     // drivingOptions: {
//   //     //   departureTime: new Date(Date.now() + N),  // for the time N milliseconds from now.
//   //     //   trafficModel: 'pessimistic'
//   //     // }
    
//   //     },
//   //     (response, status) => {
//   //       if (status === "OK"){
//   //         directionsRenderer.setDirections(response);
//   //         const route = response.routes[0];
//   //         const summaryPanel = document.getElementById(
//   //           "directions-panel"
//   //         ) as HTMLElement;
//   //         summaryPanel.innerHTML = "";
            
//   //         // For each route, display summary information.
//   //         for (let i = 0; i < route.legs.length; i++) {
//   //           const routeSegment = i + 1;
//   //           summaryPanel.innerHTML +=
//   //             "<b>Route Segment: " + routeSegment + "</b><br>";
//   //           summaryPanel.innerHTML += route.legs[i].start_address + " to ";
//   //           summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
//   //           summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
//   //         }
//   //       } else {
//   //         window.alert("Directions request failed due to " + status);  
//   //     }
    
//   //   }
//   // );
//   // }

// }