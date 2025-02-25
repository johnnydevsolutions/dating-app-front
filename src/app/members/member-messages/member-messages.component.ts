import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Messages } from 'src/app/models/messages';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username?: string
  @ViewChild('messageForm') messageForm?: NgForm;
  messageContent = '';
  loading = false;

  constructor(public messageService: MessagesService) { }

  ngOnInit(): void {
  }

  sendMessage() {
    if (!this.username) return;
    this.loading = true;
    this.messageService.sendMessage(this.username, this.messageContent).then(() => {
      this.messageForm?.reset();
    }).finally(() => this.loading = false);
  }
}
