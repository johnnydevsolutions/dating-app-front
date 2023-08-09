import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService {

  private readonly APILogin = environment.API
  private readonly APIRegister = environment.API2

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,
              private presenceService: PresenceService) { }

  login(model: any) {
    return this.http.post<User>(this.APILogin, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post<User>(this.APIRegister, model).pipe(
      map((user: any) => {
        if (user){
          this.setCurrentUser(user);
        }
        console.log(user)
      })
    );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
    console.log('Logout feito com sucesso');
  }

  logout() {
    console.log('Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }
}
