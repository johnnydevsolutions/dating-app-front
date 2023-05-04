import { Component } from '@angular/core';
import { Members } from 'src/app/models/members';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent {
  members: Members[] | undefined;
  predicate = 'liked'

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate).subscribe({
      next: response => {
        this.members = response;
      }
    })
  }

}
