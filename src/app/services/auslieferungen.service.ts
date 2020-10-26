import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuslieferungenService {

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
  
}
