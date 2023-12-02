import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl="https://localhost:7003/api";

  constructor(private http: HttpClient) { }

  getAlertList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Alert');
  }

  addAlert(val: any) {
    return this.http.post(this.APIUrl+'/Alert', val);
  }

  updateAlert(val: any) {
    return this.http.put(this.APIUrl+'/Alert', val);
  }

  deleteAlert(val: any) {
    return this.http.delete(this.APIUrl+'/Alert/', val);
  }

  getCommentsList():Observable<any[]>{
    return this.http.get<any>(this.APIUrl+'/Comment');
  }

  postComment(val: any) {
    return this.http.post(this.APIUrl+'/Comment', val);
  }

  updateComment(val: any) {
    return this.http.put(this.APIUrl+'/Comment', val);
  }

  deleteComment(val: any) {
    return this.http.delete(this.APIUrl+'/Comment', val);
  }

  reportComment(val: any) {
    return this.http.post(this.APIUrl+'/Email', val);
  }

  subscribeEmail(val: any) {
    return this.http.post(this.APIUrl+'/Subscribe', val);
  }

  samlLogin() {
    return this.http.get(this.APIUrl+'/Saml');
  }
}
