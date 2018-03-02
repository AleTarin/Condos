import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss']
})
export class AdminMainComponent implements OnInit {

  user: any;
  constructor(private storage: LocalstorageService) { }

  ngOnInit() {
    this.user = this.storage.getfromLocalStorage('currentUser')['admin'];
  }

}
