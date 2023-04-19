import { Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Members } from 'src/app/models/members';
import { User } from 'src/app/models/user';
import { ContaService } from 'src/app/services/conta.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss']
})
export class PhotoEditorComponent {
@Input() member: Members | undefined;
uploader: FileUploader | undefined;
hasBaseDropZoneOver = false;
baseUrl = environment.API3;
user: User | undefined;

  constructor(private contaService: ContaService) {
    this.contaService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
          if (user) this.user = user
      }
    })
  }


  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
}
initializeUploader() {
  this.uploader = new FileUploader({
    url: this.baseUrl + 'users/add-photo',
    authToken: 'Bearer ' + this.user?.token,
    isHTML5: true,
    allowedFileType: ['image'],
    removeAfterUpload: true,
    autoUpload: false,
    maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
}
this.uploader.onSuccessItem = (item, response, status, headers) => {
  if (response) {
    const photo = JSON.parse(response);
    this.member?.photos.push(photo);
  }
}

}

}
