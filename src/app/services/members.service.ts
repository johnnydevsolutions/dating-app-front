import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Members } from '../models/members';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly APIPostLogin = environment.API
  private readonly APIPostRegister = environment.API2
  private readonly APIGet = environment.API3

  members: Members[] = []

  constructor(private http: HttpClient) { }

  getMembers() {
    if(this.members.length > 0) return of(this.members)
    return this.http.get<Members[]>(this.APIGet + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(username: string) {
    const member = this.members.find(x => x.userName === username);
    if (member) return of(member);
    return this.http.get<Members>(this.APIGet + 'users/' + username);
  }

  updateMember(member: Members) {
    return this.http.put(this.APIGet + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member}
      })
    )
  }

}
