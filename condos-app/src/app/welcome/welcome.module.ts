import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CarouselModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    CarouselModule.forRoot()
  ],
  declarations: [WelcomePageComponent]
})
export class WelcomeModule { }
