import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Members } from 'src/app/models/members';
import { MembersService } from 'src/app/services/members.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  @Input() member: Members | undefined;
  isLiked: boolean = false;
  hasMessage: boolean = false;
  hasUnreadMessage: boolean = false; // Adicione esta propriedade


  constructor(private memberService: MembersService,
              private messagesService: MessagesService,
              private toastr: ToastrService,
              public presenceService: PresenceService) { }

  ngOnInit(): void {
    if (this.member) {
      this.memberService.checkLike(this.member.userName).subscribe(
        isLiked => this.isLiked = isLiked,
        error => this.toastr.error(error)
      );
    }

    this.messagesService.checkUnreadMessages().subscribe(
      hasMessage => this.hasMessage = hasMessage,
      error => this.toastr.error(error)
    );

  }


  addLike(member: Members) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => {
        this.toastr.success('You have liked ' + member.knownAs);
        this.isLiked = true;
      },
      error: error => {
        this.toastr.error(error.error);
      }
    })
  }

}
