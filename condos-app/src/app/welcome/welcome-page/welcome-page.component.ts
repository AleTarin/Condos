import { Component, OnInit } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
