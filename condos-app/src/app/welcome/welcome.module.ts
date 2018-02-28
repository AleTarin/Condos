import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CarouselModule } from 'ngx-bootstrap';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule.forRoot(),
    HttpClientModule
  ],
  declarations: [WelcomePageComponent],
  providers: [
    AuthService,
    HttpClient
  ]
})
export class WelcomeModule { }
