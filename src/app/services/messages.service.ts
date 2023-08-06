import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Messages } from '../models/messages';
import { environment } from '../environments/environment';
import { PaginatedResult } from '../models/pagination';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private readonly APIMessages = environment.API5
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private messageThreadSource = new BehaviorSubject<Messages[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build()

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.userName === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages => {
            messages.forEach(message => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            })
            this.messageThreadSource.next([...messages]);
          }
        })
      }
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: messages => {
          this.messageThreadSource.next([...messages, message]);
        }
      })
    })
  }

  stopHubConnection() {
    if (this.hubConnection) {
    this.hubConnection?.stop();
    }
}

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);

    return getPaginatedResult<Messages[]>(this.APIMessages + 'messages', params, this.http);
  }

  getMessageThread(username: string) {
    return this.http.get<Messages[]>(this.APIMessages + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string) {
    // return this.http.post<Messages>(this.APIMessages + 'messages', {recipientUsername: username, content});
    return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
    .catch(error => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.APIMessages + 'messages/' + id);
  }

  checkUnreadMessages(): Observable<boolean> {
    return this.http.get<Messages[]>(this.APIMessages + 'messages')
      .pipe(
        map((messages: Messages[]) => messages.length > 0)
      );
  }

}
