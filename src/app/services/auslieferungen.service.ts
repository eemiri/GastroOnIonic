import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Observable } from 'rxjs';
import { UserData } from '../model/user-data';
import { HelperService } from './helper.service';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AuslieferungenService {

  preOrderIds: Array<number>
  userdata: UserData

  headers: HttpHeaders;
  drivenRoutes = new Array<Array<any>>();
  numOfRoutes = [];

  constructor(public http: HttpClient, private helperService: HelperService) {
    this.headers = this.helperService.getPostHeader();
   }

  getPreOrders(betriebsId: number): Observable<any> {
    const params = new HttpParams().set("betriebsId", betriebsId.toString());

    return this.http.post(
      this.helperService.getShop4meUrl("GetAllPreorders"),
      params,
      { headers: this.headers }      
    );
  }

  setPreOrderToUser(preOrderIds: Array<number>, userId: number, status: number): Observable<any> {
    const params = new HttpParams()
      .set("preOrderIds", preOrderIds.toString())
      .set("userId", userId.toString())
      .set("status", status.toString());

    return this.http.post(
      this.helperService.getShop4meUrl("setPreOrderToUser"),
      params,
      { headers: this.headers }
    );
  }

  savePreOrderStatus(preOrderToUserId: number, status: number): Observable<any> {
    const params = new HttpParams()
      .set("PreorderID", preOrderToUserId.toString())
      .set("Status", status.toString());

    return this.http.post(
      this.helperService.getShop4meUrl("savePreOrderStatus"),
      params,
      { headers: this.headers }
    );
  }
  

  // getPreorderAddress(preorderID){
  //   this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
  //     return responseData.DeliveryAddressData;
  //   });
  // }

  // getPreorderPrice(preorderID){
  //   this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
  //     return responseData.TotalPrice;
  //   });
  // }

  // getPreorderMessage(preorderID){
  //   this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
  //     return responseData.CustomerMessage;
  //   });
  // }

  // getPreorderCustomer(preorderID){
  //   this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
  //     return responseData.CustomerData;
  //   });
  //}
}
