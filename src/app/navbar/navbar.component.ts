import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { ContaService } from '../services/conta.service';
import { MembersService } from '../services/members.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
model: any = {};

constructor(public contaService: ContaService,
            private router: Router,
            private toastr: ToastrService,
            ) { }

ngOnInit(): void {

}

login(){
  this.contaService.login(this.model).subscribe({
    next: () => this.router.navigateByUrl('/members'),
    error: error => this.toastr.error(error.error)
    });
}

 logout(){
   this.contaService.logout();
   this.router.navigateByUrl('/');
 }
}
