import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const URL = environment.endpointAPI + 'upload-file';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  urlDocuments: string;
  files: Object;
  username: string;
  user: any;
  public uploader: FileUploader = new FileUploader({url: URL});

  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor(private storage: LocalstorageService, private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
      this.urlDocuments = 'localhost:5000/files/';
      this.user = this.storage.getfromLocalStorage('currentUser')['propietario'];
      this.username = this.storage.getfromLocalStorage('username');
      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('username' , this.username);
      };
      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        if (response) {
         console.log('response' + response);
        }
      };

      this.getFilesList(environment.endpointAPI + 'files/all');
  }

  getFilesList(endpoint: string) {
    this.http.get(endpoint)
    .subscribe(
      data => { this.files = data; }
    );
  }

  cleanURL(oldURL ): SafeUrl {
    return   this.sanitizer.bypassSecurityTrustResourceUrl(oldURL);
    }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

}
