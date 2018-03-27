import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CarouselModule } from 'ngx-bootstrap';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user/user.service';
import { CondosService } from '../services/condos/condos.service';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule.forRoot(),
    HttpClientModule
  ],
  declarations: [WelcomePageComponent],
  providers: [
    AuthService,
    UserService,
    CondosService,
    HttpClient,
  ]
})
export class WelcomeModule { }
