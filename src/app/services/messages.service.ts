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

  sendMessage(username: string, content: string) {
    return this.http.post<Messages>(this.APIMessages + 'messages', {recipientUsername: username, content});
  }

  deleteMessage(id: number) {
    return this.http.delete(this.APIMessages + 'messages/' + id);
  }

}
