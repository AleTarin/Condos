import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-propietary-main',
  templateUrl: './propietary-main.component.html',
  styleUrls: ['./propietary-main.component.scss']
})
export class PropietaryMainComponent implements OnInit {

  user: any;
  constructor(private storage: LocalstorageService) { }

  ngOnInit() {
    this.user = this.storage.getfromLocalStorage('currentUser')['propietario'];
  }


}
