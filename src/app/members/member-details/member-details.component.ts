import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Members } from 'src/app/models/members';
import { Messages } from 'src/app/models/messages';
import { MembersService } from 'src/app/services/members.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent {
  @ViewChild ('memberTabs') memberTabs?: TabsetComponent
  activeTab?: TabDirective;
  messages: Messages [] = [];

  member: Members | undefined;
  galleryOptions: NgxGalleryOptions [] = [];
  galleryImages: NgxGalleryImage [] = [];

  constructor(private memberService: MembersService,
              private route: ActivatedRoute,
              private messageService: MessagesService) { }

  ngOnInit(): void {
    this.carregarMembro();

    this.galleryOptions = [
      { width: '500px', height: '500px', imagePercent: 100, thumbnailsColumns: 4, imageAnimation: NgxGalleryAnimation.Slide, preview: false },
    ]
  }

  getImages() {
    if (!this.member) return [];
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url
      })
    }
    return imageUrls;
  }

  carregarMembro(){
     const username = this.route.snapshot.paramMap.get('username');
     if (!username) return;
      this.memberService.getMember(username).subscribe({
        next: member => {
          this.member = member
          this.galleryImages = this.getImages();
        },
  });
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages') {
      this.loadMessages();
    }
  }
}
