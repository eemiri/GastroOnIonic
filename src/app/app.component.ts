import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from './services/language.service';
import { Device, Plugins } from '@capacitor/core';
import { DeviceInformation } from './model/deviceInformation.model';
import { GlobalService } from './services/global.service';

const {device} = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  deviceInformation: DeviceInformation;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageService: LanguageService,
    private global: GlobalService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.languageService.setInitialAppLanguage();

      // Geräteinformationen sammeln
      if (
        (this.platform.is("ios") || this.platform.is("android")) &&
        !this.platform.is("mobileweb")
      ) {
        //this.createTempDir(); Not sure what this does atm

        this.deviceInformation = new DeviceInformation();
        this.deviceInformation.Uuid =  device.uuid;//nicht sicher ob das so geht oder ob es async muss aber InitializeApp async??
        this.deviceInformation.Platform = device.platform;
        this.global.setDeviceInformation(this.deviceInformation);
      } else {
        this.deviceInformation = new DeviceInformation();
        this.deviceInformation.Uuid = "browser_uuid";
        this.deviceInformation.Platform = "browser";
        this.global.setDeviceInformation(this.deviceInformation);
      }
    });
  }
}
