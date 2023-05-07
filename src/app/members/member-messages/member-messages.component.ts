import { Component, Input, OnInit } from '@angular/core';
import { Messages } from 'src/app/models/messages';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username?: string
  @Input() messages: Messages[] = []

  constructor(private messageService: MessagesService) { }

  ngOnInit(): void {
    // this.loadMessages()
  }

  //Coloquei o metodo loadMessages() no member-details.component.ts
  // loadMessages() {
  //   if (this.username) {
  //     this.messageService.getMessageThread(this.username).subscribe({
  //       next: messages => this.messages = messages
  //     })
  //   }
  // }
}
