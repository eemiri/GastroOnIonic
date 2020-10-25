import { Injectable } from '@angular/core';
import { DeviceInformation } from '../model/deviceInformation.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  deviceInformation: DeviceInformation;

  constructor() {}

  getDeviceInformation() {
    return this.deviceInformation;
  }

  setDeviceInformation(deviceInformation: DeviceInformation) {
    this.deviceInformation = deviceInformation;
  }
}
