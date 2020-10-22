import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';
import { map } from 'rxjs/operators';
import { Betrieb } from '../model/betrieb.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private helperService: HelperService,
    public http: HttpClient,
    ) { }

  getBetriebe(): Observable<any> {
    const headers = this.helperService.getPostHeader();
    const params = new HttpParams();

    return this.http.post<any>(this.helperService.getUrl("GetBetriebeStartsWith"),
    params,
    {headers}
    );
  }

    // return this.http.post(
    //   this.helperService.getUrl("GetBetriebeStartsWith"),
    //   params,
    //   { headers: this.headers }
    // );
  
    
    // return this.http.get(this.helperService.getUrl("GetBetriebeStartsWith")).pipe(map((betriebe: Array<Betrieb>) =>{
    //   return betriebe.map((betrieb) => new Betrieb(betrieb.Id, betrieb.Betriebsname, betrieb.Strasse, betrieb.Ort, betrieb.ShowDivider));
    // }));
  

  // getDataSecurityText(): Observable<any> {
  //   return this.http.get(
  //     this.helperService.getAlternativURL("?alttemplate=appdatenschutz"),
  //     { responseType: "text" }
  //   );
  // }
  getDataSecurityText(): Observable<any> {
    return this.http.get(this.helperService.getAlternativURL("?alttemplate=appdatenschutz"), { responseType: "text"}  
    );
  }

}
