import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
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
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { map } from "rxjs/operators";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;

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

  // Map related
  markers = [];

  waypointArray: google.maps.DirectionsWaypoint[] = [];
  waypointCollection: AngularFirestoreCollection<any>;

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  // Misc
  isTracking = false;
  watch: string;
  user = null;
  loading = true;
  adresse: string;

  currentAddress = Geolocation.getCurrentPosition().then((resp) => {
    this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  });

  currentLatLng = Geolocation.getCurrentPosition()
  .then((resp) => {
    this.currentLatLng = new google.maps.LatLng(
      resp.coords.latitude,
      resp.coords.longitude
    );   });

  constructor(
    //private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: "" };
    this.autocompleteItems = [];
    this.anonLogin();
  }

  ngOnInit() {
    this.loadMap();
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

        this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );

        //For Routing
        this.directionsRenderer.setMap(this.map);

        this.map.addListener("tilesloaded", () => {
          //listens to map-movements
          console.log("accuracy", this.map, this.map.center.lat());
          this.getAddressFromCoords(
            this.map.center.lat(),
            this.map.center.lng()
          );
          this.lat = this.map.center.lat();
          this.long = this.map.center.lng();
        });
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

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
        debugger;
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
    //alert(JSON.stringify(item));
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
  } //#region calcRoute

  //#endregion

  calculateAndDisplayRoute() {
    this.directionsService.route(
      {
        origin: this.currentLatLng,// Geolocation.getCurrentPosition(),// this.getCurrentAddress(), //Betriebsadresse, placeholders
        destination: this.currentLatLng ,//Geolocation.getCurrentPosition(),//this.getCurrentAddress(), //Betriebsadresse
        waypoints: this.waypointArray, //Möglichkeit finden die Eingegebenen Adressen hier rein zu pushen
        optimizeWaypoints: true,
        travelMode: google.maps.Travelmode.DRIVING,//hat mit dem rechten teil ein problem
        drivingOptions: {
          trafficModel: "pessimistic",
        },
      },
      (response, status) => {
        if (status === "OK") {
          this.directionsRenderer.setDirections(response);
        }
      }
    );
  } //Muss noch angepasst werden mit der ID vom Fahrer etc
  //#endregion
  //#region tracking
  // Perform an anonymous login and load data
  anonLogin() {
    this.afAuth.signInAnonymously().then((res) => {
      this.user = res.user;
      this.locationsCollection = this.afs.collection(
        `locations/${this.user.uid}/track`,
        (ref) => ref.orderBy("timestamp")
      ); // Make sure we also get the Firebase item ID!
      this.locations = this.locationsCollection.snapshotChanges().pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      ); // Update Map marker on every change
      this.locations.subscribe((locations) => {
        this.updateMap(locations);
      });
    });
  } // Use Capacitor to track our geolocation
  startTracking() {
    this.isTracking = true;
    this.watch = Geolocation.watchPosition({}, (position, err) => {
      //see if i can change the timer to reduce batteryconsumption
      if (position) {
        this.addNewLocation(
          position.coords.latitude,
          position.coords.longitude,
          position.timestamp
        );
      }
    });
  } // Unsubscribe from the geolocation watch using the initial ID
  stopTracking() {
    Geolocation.clearWatch({ id: this.watch }).then(() => {
      this.isTracking = false;
    });
  } // Save a new location to Firebase and center the map
  addNewLocation(lat, lng, timestamp) {
    this.locationsCollection.add({
      lat,
      lng,
      timestamp,
    });
    let position = new google.maps.LatLng(lat, lng);
    this.map.setCenter(position);
    this.map.setZoom(15);
  } // Delete a location from Firebase
  deleteLocation(pos) {
    this.locationsCollection.doc(pos.id).delete();
  } // Redraw all markers on the map
  updateMap(locations) {
    // Remove all current marker
    this.markers.map((marker) => marker.setMap(null));
    this.markers = [];
    for (let loc of locations) {
      let latLng = new google.maps.LatLng(loc.lat, loc.lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
      });
      this.markers.push(marker);
    }
  }

  //#endregion
}
