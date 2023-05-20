import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Members } from 'src/app/models/members';
import { MembersService } from 'src/app/services/members.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  @Input() member: Members | undefined;

  constructor(private memberService: MembersService,
              private toastr: ToastrService,
              public presenceService: PresenceService) { }

  ngOnInit(): void {

  }

  addLike(member: Members) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => {
        this.toastr.success('You have liked ' + member.knownAs);
      },
      error: error => {
        this.toastr.error(error.error);
      }
    })
  }
}
