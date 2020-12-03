import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async loadFromStorage(TOKEN_KEY){
    const ret = await Storage.get({ key: TOKEN_KEY });
    return JSON.parse(ret.value);
  }

  setStorage(TOKEN_KEY, toBeStored){
    Storage.set({key: TOKEN_KEY, value: JSON.stringify(toBeStored)})
  }
}
