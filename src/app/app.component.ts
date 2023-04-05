import { Component } from '@angular/core';
import { User } from './models/user';
import { ContaService } from './services/conta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'front-dating';
  users: any;

constructor(private contaService: ContaService ) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

setCurrentUser() {
    const userString = (localStorage.getItem('user'));
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.contaService.setCurrentUser(user);
}
}
