import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Members } from '../models/members';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { ContaService } from './conta.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly APIPostLogin = environment.API
  private readonly APIPostRegister = environment.API2
  private readonly APIGet = environment.API3
  private readonly APILikes = environment.API4

  members: Members[] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient,
              private contaService: ContaService) {
                this.contaService.currentUser$.pipe(take(1)).subscribe({
                  next: user => {
                    if (user) {
                      this.userParams = new UserParams(user);
                      this.user = user;
                    }
                  }
                })
              }


  getUserParams() {
    return this.userParams;
  }


  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams:UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Members[]>(this.APIGet + 'users', params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }
    )
    );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Members) => member.userName === username);
      console.log(member);
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
    return this.http.delete(this.APILikes + 'users/delete-photo/' + photoId)
  }

  addLike(username: string) {
    return this.http.post(this.APILikes + 'likes/' + username, {});
  }

  getLikes(predicate: string) {
    return this.http.get<Members[]>(this.APILikes + 'likes?predicate=' + predicate);
  }


  private getAuthHeaders(): HttpHeaders {
    const token = 'SEU_TOKEN_DE_AUTENTICACAO'; // Recupere seu token de autenticação
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
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
}
