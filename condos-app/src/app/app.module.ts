
// Base
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { NavbarComponent } from './navbar/navbar.component';

// Modules
import { AppRoutingModule } from './app-routing/app-routing.module';
import { WelcomeModule } from './welcome/welcome.module';

// Imports
import { ModalModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './admin/admin.module';
import { PropietaryModule } from './propietary/propietary.module';
import { InquilinoComponent } from './inquilino/inquilino.component';
import { LocalstorageService } from './services/localstorage.service';
import { AuthGuard } from './services/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InquilinoComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    ReactiveFormsModule,
    BrowserModule,
    WelcomeModule,
    AdminModule,
    PropietaryModule,
    AppRoutingModule,
  ],
  providers: [LocalstorageService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
