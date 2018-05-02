import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../../services/localstorage.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';




@Component({
  selector: 'app-propietary-main',
  templateUrl: './propietary-main.component.html',
  styleUrls: ['./propietary-main.component.scss']
})
export class PropietaryMainComponent implements OnInit {

  username: string;
  user: any;


  constructor(private storage: LocalstorageService, private http: HttpClient) { }

  ngOnInit() {
      this.user = this.storage.getfromLocalStorage('currentUser')['propietario'];
      this.username = this.storage.getfromLocalStorage('username');
  }
}
