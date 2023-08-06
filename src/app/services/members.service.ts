import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Members } from '../models/members';
import { Observable, catchError, map, of, take, tap } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';
import { ContaService } from './conta.service';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

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
  currentUser$: Observable<User | null> = this.contaService.currentUser$;


  constructor(private http: HttpClient,
              private contaService: ContaService) {
                this.currentUser$ = this.contaService.currentUser$.pipe(take(1));
                this.currentUser$.subscribe(user => {
                  if (user) {
                    this.userParams = new UserParams(user);
                    this.user = user;
                  }
                });
              }


  getUserParams() {
    return this.userParams;
  }


  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams(user?: User) {
    if (user) {
      this.userParams = new UserParams(user);
    } else if (this.user) {
      this.userParams = new UserParams(this.user);
    }
    return this.userParams;
  }

  getMembers(userParams:UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Members[]>(this.APIGet + 'users', params, this.http).pipe(
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

  addLike(username: string) {
    return this.http.post(this.APILikes + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize)

    params = params.append('predicate', predicate);

    return getPaginatedResult<Members[]>(this.APILikes + 'likes', params, this.http);
  }

  checkLike(username: string): Observable<boolean> {
    return this.getLikes("liked", 1, 100)
      .pipe(
        map((paginatedResult: PaginatedResult<Members[]>) => {
          if (paginatedResult.result) {
            return paginatedResult.result.some(member => member.userName === username);
          }
          return false;
        })
      );
  }
}
