import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { isDevMode } from '@angular/core';
import { LanguageService } from './language.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private language: LanguageService

    ) { }

    // Url vom Server
  getUrl(action: string) {
    if (isDevMode()) {
      return (
        "http://localhost:55275/umbraco/HbigApp/HbigAppSurface/" + action
      );
    }
    return (
      "https://www.hierbinichgast.de/umbraco/HbigApp/HbigAppSurface/" + action
    );
  }

  getWebinhalteURL(action: string) {
    if (isDevMode()) {
      return (
        "http://localhost:55275/umbraco/SitePoint/APP_Public/" + action
      );
    }
    return "https://www.hierbinichgast.de/umbraco/SitePoint/APP_Public/" + action;
  }

  getAlternativURL(action: string) {
    if (isDevMode()) {
      return (
        "http://localhost:55275" +
        "/" +
        action
      );
    }
    return "https://www.hierbinichgast.de" + "/" + action;
  }

  // Header für die Post Methode
  getPostHeader() {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    return headers;
  }


  async showBottomToast(key: string) {
    const toast = await this.toastCtrl.create({
      message: await this.language.getLangForString(key),//Not sure about this
      duration: 3000,
      position: "bottom",
      buttons:[
        {
          text: 'Ok',
          role: 'cancel'
        }    
      ]
    });
    toast.present();
  }

  getShop4meUrl(action: string) {
    if (isDevMode()) {
      return (
        "http://localhost:55275/umbraco/Shop4me/Shop4me_Surface/" +
        action
      );
    }
    return (
      "https://www.hierbinichgast.de/umbraco/Shop4me/Shop4me_Surface/" + action
    );
  }

  // getModalOpts() {
  //   let theme: string = "";

  //   this.themeChanger.getActive().subscribe(val => (theme = <string>val));

  //   return  theme;
  // }
}
