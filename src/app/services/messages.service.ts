import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Messages } from '../models/messages';
import { environment } from '../environments/environment';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private readonly APIMessages = environment.API5

  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Messages[]>(this.APIMessages + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Messages[]>(this.APIMessages + 'messages/thread/' + username);
  }


/* Não Mais Usado, pq eu estou pegando do paginationHelper.ts, caso queira como antes apenas remova o this.http e coloque this.getPaginatedResult e this antes do  getPaginationHeaders
Com isso vai dar pra usar do jeito anterior */

  // private getPaginatedResult<T>(url: string, params: HttpParams) {
  //   const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  //   return this.http.get<T>(this.APIMessages + 'messages', { observe: 'response', params }).pipe(
  //     map(response => {
  //       if (response.body) {
  //         paginatedResult.result = response.body;
  //       }
  //       const pagination = response.headers.get('Pagination');
  //       if (pagination) {
  //         paginatedResult.pagination = JSON.parse(pagination);
  //       }
  //       return paginatedResult;
  //     })
  //   );
  // }

  // private getPaginationHeaders(pageNumber: number, pageSize: number) {
  //   let params = new HttpParams();

  //     params = params.append('pageNumber', pageNumber.toString());
  //     params = params.append('pageSize', pageSize.toString());

  //   return params;
  // }

}
