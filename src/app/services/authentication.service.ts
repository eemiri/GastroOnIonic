import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
 
import { Plugins } from '@capacitor/core';
import { UserData } from '../model/user-data';
import { HelperService } from './helper.service';
const { Storage } = Plugins;
 
const TOKEN_KEY = 'login';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  headers: HttpHeaders;
  
 
  constructor(private http: HttpClient, private helperService: HelperService, ) {
    this.loadToken();
    this.headers = this.helperService.getPostHeader();
  }
 
  async loadToken() {
    const ret = await Storage.get({ key: TOKEN_KEY });    
    const token = JSON.parse(ret.value);
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
 
  login(loginObj: UserData): Observable<any> {
    const params = new HttpParams()
      .append("Benutzername", loginObj.benutzername)
      .append("Passwort", loginObj.passwort)
      .append("BetriebsId", loginObj.betriebsId.toString())
      .append("Uuid", loginObj.uuid)
      .append("DeviceToken", loginObj.deviceToken)
      .append("Platform", loginObj.platform);
    return this.http.post(this.helperService.getUrl("Login"), params, {headers: this.headers}).pipe( //hier die api route zum richtigen server machen
      map((data: any) => data.token),
      switchMap(token => {//switch from original observable to a new observable
        return from(Storage.set({key: TOKEN_KEY, value: JSON.stringify({loginObj})}));//from transforms promise to observable
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }
}