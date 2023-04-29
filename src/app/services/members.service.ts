import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Members } from '../models/members';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly APIPostLogin = environment.API
  private readonly APIPostRegister = environment.API2
  private readonly APIGet = environment.API3

  members: Members[] = []

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = 'SEU_TOKEN_DE_AUTENTICACAO'; // Recupere seu token de autenticação
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getMembers(userParams:UserParams) {
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);

    return this.getPaginatedResult<Members[]>(this.APIGet + 'users', params);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(this.APIGet + 'users', { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());

    return params;
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

  setMainPhoto(photoId: number) {
    return this.http.put(this.APIGet + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.APIGet + 'users/delete-photo/' + photoId)
  }
}
