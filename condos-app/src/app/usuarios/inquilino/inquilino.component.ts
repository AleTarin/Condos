import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-inquilino',
  templateUrl: './inquilino.component.html',
  styleUrls: ['./inquilino.component.scss']
})
export class InquilinoComponent implements OnInit {

  username: any;
  user: any;
  constructor(private storage: LocalstorageService, private userService: UserService) { }

  ngOnInit() {
    this.username = this.storage.getfromLocalStorage('username');
    this.user = this.storage.getfromLocalStorage('currentUser')['inquilino'];
    this.userService.getByUsername(this.username).subscribe(user => {
      this.user = user;
    });
  }

}
