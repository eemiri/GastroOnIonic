import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(private translate: TranslateService) { }

  async setInitialAppLanguage(){
    let language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    var lang = await Storage.get({key: LNG_KEY});
    this.setLanguage(lang.value);
    this.selected = lang.value;
  }

  async getCurrentLanguage(){
    var lng = await Storage.get({key: LNG_KEY});
    return lng.value;
  }

  getLanguages(){
    return[
      {text: 'English', value: 'en', img: 'assets/imgs/en.png'},
      {text: 'German', value: 'de', img: 'assets/imgs/de.png'},
    ];
  }

  async setLanguage(lng){
    this.translate.use(lng);//When wanting to switch languages, call this
    this.selected = lng;
    await Storage.set({
      key: LNG_KEY,
      value: lng
    });
  }

  getLangForString(word: string, params?: any): Promise<string> {
    return new Promise(resolve => {
      this.translate.get(word, params).subscribe((data: string) => {
        resolve(data);
      });
    });
  }
}

  