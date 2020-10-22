import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class BenutzerService {
  headers: HttpHeaders;

  constructor(public http: HttpClient,
    private helperService: HelperService) { 
      this.headers = this.helperService.getPostHeader(); 
    }

    changePassword(benutzer_id: number, passwort: string): Observable<any> {
      const params = new HttpParams()
        .set("benutzerID", benutzer_id.toString())
        .set("passwort", passwort.toString());
  
      return this.http.post(this.helperService.getUrl("ChangePassword"), params, {
        headers: this.headers
      });
    }
  
    deaktiviereBenutzer(benutzer_id: number): Observable<any> {
      const params = new HttpParams().set("benutzerID", benutzer_id.toString());
  
      return this.http.post(
        this.helperService.getUrl("DeaktiviereBenutzer"),
        params,
        { headers: this.headers }
      );
    }
  
    updateOnlineStatusEinstellung(online_status: boolean,benutzer_id: number): Observable<any> {
      const params = new HttpParams()
        .set("status", online_status.toString())
        .set("benutzerID", benutzer_id.toString());
  
      return this.http.post(
        this.helperService.getUrl("UpdateOnlineStatusEinstellung"),
        params,
        { headers: this.headers }
      );
    }
  
    requestPassword(email: string, benutzername: string, betriebsId: number): Observable<any> {
      const params = new HttpParams()
        .set("benutzername", benutzername)
        .set("Id", betriebsId.toString())
        .set("email", email);
  
      return this.http.post(
        this.helperService.getUrl("RequestPassword"),
        params,
        { headers: this.headers }
      );
    }
  
    deleteAvatar(benutzer_id: number): Observable<any> {
      const params = new HttpParams().set("benutzerID", benutzer_id.toString());
  
      return this.http.post(
        this.helperService.getUrl("DeleteProfilbild"),
        params,
        { headers: this.headers }
      );
    }

}
