import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../../services/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';

const URL = environment.endpointAPI + 'upload';


@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent implements OnInit {

  username: string;
  user: any;
  public uploader: FileUploader = new FileUploader({url: URL});

  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  constructor(private storage: LocalstorageService, private http: HttpClient) { }

  ngOnInit() {
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
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


}
