
// Base
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { NavbarComponent } from './navbar/navbar.component';

// Modules
import { AppRoutingModule } from './app-routing/app-routing.module';
import { WelcomeModule } from './welcome/welcome.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    WelcomeModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
