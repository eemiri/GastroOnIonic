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
  preorderList:any =[
    {PreorderID:1, Status: 4, TotalPrice: 10.99, DeliveryAddressData: 'Riegelsbergerstraße 45, 66113 Saarbrücken', CustomerData: 'Günther Jauch', CustomerMessage: '1riegelsberger millionär'},
    {PreorderID:2, Status: 4, TotalPrice: 8.55, DeliveryAddressData: 'Saargemünderstraße 45, 66271 Kleinblittersdorf', CustomerData: 'Alexander Marcus', CustomerMessage: '2saargemünder yeah boiii'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Jenneweg 12, 66113 Saarbrücken', CustomerData: 'babaji', CustomerMessage: '3jenne besser oben als unten'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Malstatterstraße 1, 66117 Saarbrücken', CustomerData: 'maalstatt', CustomerMessage: 'peace'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Mainzerstraße 171, 66121 Saarbrücken', CustomerData: 'mainzer', CustomerMessage: 'hotel, trivago'},
    {PreorderID:3, Status: 4, TotalPrice: 23.34, DeliveryAddressData: 'Europaallee 14, 66113 Saarbrücken', CustomerData: 'Europa', CustomerMessage: 'apo'}
  ];

  preOrderIds: Array<number>
  userdata: UserData

  headers: HttpHeaders;

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
  async preOrderList(){//kriegt alle bestellungen, periodisch refreshen
    const ret = await Storage.get({ key: 'BetriebsID' });    
    const id = JSON.parse(ret.value);
    setTimeout(() =>{//noch einen Fall einbauen wo der call nicht funktioniert
      this.getPreOrders(id).subscribe( (res) =>{
        this.preorderList = [];
        this.preorderList = JSON.parse(res.Data)
    });
    }, 10000);
  }

  setPreorderToDriver(status: number){
    this.preOrderIds = [];
    for(const preorder of this.preorderList){
      this.preOrderIds.push(preorder.PreorderID)
    }
    this.setPreOrderToUser(this.preOrderIds, this.userdata.benutzer_id, status).subscribe(responseData => {
      this.preorderList.splice(
        this.preorderList.findIndex(
          order => order.PreorderID == responseData.Data.PreorderID
        ),
        1,
        responseData.Data
      );
    });
  }

  getPreorderAddress(preorderID){
    this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
      return responseData.DeliveryAddressData;
    });
  }

  getPreorderPrice(preorderID){
    this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
      return responseData.TotalPrice;
    });
  }

  getPreorderMessage(preorderID){
    this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
      return responseData.CustomerMessage;
    });
  }

  getPreorderCustomer(preorderID){
    this.preorderList.find(order => order.PreorderID == preorderID).subscribe(responseData =>{
      return responseData.CustomerData;
    });
  }
}
