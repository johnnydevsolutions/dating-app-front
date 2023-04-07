import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Members } from 'src/app/models/members';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent {
  member: Members | undefined;
  galleryOptions: NgxGalleryOptions [] = [];
  galleryImages: NgxGalleryImage [] = [];

  constructor(private memberService: MembersService,
              private route: ActivatedRoute) { }

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
}
