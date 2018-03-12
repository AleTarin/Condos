import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-inquilino',
  templateUrl: './inquilino.component.html',
  styleUrls: ['./inquilino.component.scss']
})
export class InquilinoComponent implements OnInit {

  user: any;
  constructor(private storage: LocalstorageService) { }

  ngOnInit() {
    this.user = this.storage.getfromLocalStorage('currentUser')['inquilino'];
  }

}
