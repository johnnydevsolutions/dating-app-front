import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Members } from 'src/app/models/members';
import { Messages } from 'src/app/models/messages';
import { User } from 'src/app/models/user';
import { ContaService } from 'src/app/services/conta.service';
import { MembersService } from 'src/app/services/members.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  @ViewChild ('memberTabs', {static: true}) memberTabs?: TabsetComponent
  activeTab?: TabDirective;
  messages: Messages [] = [];

  member: Members  = {} as Members;
  galleryOptions: NgxGalleryOptions [] = [];
  galleryImages: NgxGalleryImage [] = [];
  user?: User;

  constructor(private contaService: ContaService,
              private route: ActivatedRoute,
              private messageService: MessagesService,
              public presenceService: PresenceService,
              private router: Router) {
               this.contaService.currentUser$.pipe(take(1)).subscribe({
                  next: user => {
                    if (user) this.user = user;
                  }
                });
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    // this.carregarMembro();
    this.route.data.subscribe({
      next: data => this.member = data['member']
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    })

    this.galleryOptions = [
      { width: '500px', height: '500px', imagePercent: 100, thumbnailsColumns: 4, imageAnimation: NgxGalleryAnimation.Slide, preview: false },
    ]

    this.galleryImages = this.getImages();
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

  selectTab(heading: string) {
    if(this.memberTabs) {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
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
    if (this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }
}
