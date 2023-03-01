import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  registerMode = false;
  users: any;

  constructor(private http: HttpClient, private accountService: AccountService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  getUsers() {
    this.http.get('https://localhost:7213/api/users').subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('complete')
    })
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
