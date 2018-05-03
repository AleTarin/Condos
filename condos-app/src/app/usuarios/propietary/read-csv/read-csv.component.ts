import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Condo } from '../../../shared/interfaces/condo';
import { LocalstorageService } from '../../../services/localstorage.service';

@Component({
  selector: 'app-read-csv',
  templateUrl: './read-csv.component.html',
  styleUrls: ['./read-csv.component.scss']
})
export class ReadCsvComponent implements OnInit {

  csvDownloadUrl: string;
  tableheader: any;
  templateUrl  = environment.endpointAPI + 'csv/template.csv';  // URL to web API
  cvsUrl: string;
  csvData: any[] = [];
  csv: any;

  constructor (private storage: LocalstorageService, private http: HttpClient) {}

  ngOnInit() {
    const username = this.storage.getfromLocalStorage('username');
    this.cvsUrl =  environment.endpointAPI + 'csv/' + username;
    this.csvDownloadUrl = environment.endpointAPI + 'download/' + username;
    this.readCsvData(this.cvsUrl);
  }

  readCsvData (endpoint: string) {
    this.http.get(endpoint)
      .subscribe(
        data => {this.csv = data; this.tableheader = data[0]; } ,
        err => this.handleError(err)
      );
  }

  private handleError (error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return errMsg;
  }

}
