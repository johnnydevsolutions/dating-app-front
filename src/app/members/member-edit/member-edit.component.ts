import { Component, HostListener, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Members } from 'src/app/models/members';
import { User } from 'src/app/models/user';
import { ContaService } from 'src/app/services/conta.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent {
@ViewChild('editForm') editForm: NgForm | undefined;
@HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
  if (this.editForm?.dirty) {
    $event.returnValue = true;
  }
}
member: Members | undefined;
user: User | null = null;

  constructor(private contaService: ContaService,
              private memberService: MembersService,
              private toastr: ToastrService) {
                this.contaService.currentUser$.pipe(take(1)).subscribe({
                  next: user => this.user = user
                })
              }

  ngOnInit(): void {
    this.carregarMembro();
  }

  carregarMembro() {
    if (!this.user) return;
    this.memberService.getMember(this.user.userName).subscribe({
      next: member => this.member = member
    })
  }

  updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Perfil atualizado com sucesso!');
        this.editForm?.reset(this.member);
      }
    }
    )
  }
}
