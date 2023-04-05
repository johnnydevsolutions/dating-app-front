import { Component, Input } from '@angular/core';
import { Members } from 'src/app/models/members';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  @Input() member: Members | undefined;

  constructor() { }

  ngOnInit(): void {

  }
}
