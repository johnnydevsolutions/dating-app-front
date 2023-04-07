import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Members } from '../models/members';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly APIPostLogin = environment.API
  private readonly APIPostRegister = environment.API2
  private readonly APIGet = environment.API3

  constructor(private http: HttpClient) { }

  getMembers() {
    return this.http.get<Members[]>(this.APIGet + 'users');
  }

  getMember(username: string) {
    return this.http.get<Members>(this.APIGet + 'users/' + username);
  }

 /*  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    return {
    headers: new HttpHeaders({
        Authorization: `Bearer ${user.token}`
      })
    }
  } */

}
