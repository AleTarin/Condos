
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
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalstorageService } from './services/localstorage.service';
import { AuthGuard } from './services/guards/auth.guard';
import { UsuariosModule } from './usuarios/usuarios.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    UsuariosModule,
    BrowserModule,
    WelcomeModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
