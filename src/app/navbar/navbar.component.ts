import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
model: any = {};

constructor(public accountService: AccountService,
            private router: Router,
            private toastr: ToastrService) { }

ngOnInit(): void {

}

login(){
  this.accountService.login(this.model).subscribe({
    next: () => this.router.navigateByUrl('/members'),
    error: error => this.toastr.error(error.error)
    });
}

 logout(){
   this.accountService.logout();
 }
}
