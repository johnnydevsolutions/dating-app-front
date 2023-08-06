import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  registerMode = false;
  users: any;

  constructor(private contaService: ContaService,
              private router: Router) { }

  ngOnInit(): void {

    this.contaService.currentUser$.subscribe(user => {
      if (user) {
        this.router.navigateByUrl('/members');
      }
    });
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
