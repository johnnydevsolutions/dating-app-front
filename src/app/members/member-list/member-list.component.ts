import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Members } from 'src/app/models/members';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent {
  members$: Observable<Members[]> | undefined;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    // this.loadMembers();
    this.members$ = this.memberService.getMembers();
  }

//   loadMembers() {
//   this.memberService.getMembers().subscribe({
//     next: members => this.members = members
//   })
// }
}
