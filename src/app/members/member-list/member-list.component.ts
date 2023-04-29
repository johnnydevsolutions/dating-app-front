import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Members } from 'src/app/models/members';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/userParams';
import { ContaService } from 'src/app/services/conta.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent {
  // members$: Observable<Members[]> | undefined;
  members: Members[] = [];
  pagination: Pagination | undefined;
  // pageNumber = 1;
  // pageSize = 5;
  userParams: UserParams | undefined;
  user: User | undefined;

  constructor(private memberService: MembersService,
              private contaService: ContaService) {
                this.contaService.currentUser$.pipe(take(1)).subscribe({
                  next: user => {
                    if (user) {
                      this.userParams = new UserParams(user);
                      this.user = user;
                    }
                  }
                })
               }

  ngOnInit(): void {
    this.loadMembers();

  }

  loadMembers() {
    if (!this.userParams) return;
  this.memberService.getMembers(this.userParams).subscribe({
    next: response => {
    if (response.result && response.pagination) {
      this.members = response.result;
      this.pagination = response.pagination;
      }
    },
    error: error => {
      console.log(error);
    }
  });
  }

  //Metodo para atualizar a paginação
  pageChanged(event: any) {
    if(this.userParams && this.userParams?.pageNumber  !== event.page)
    {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }

}
