import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../services/localstorage.service';
import { InquilinoComponent } from './inquilino/inquilino.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { PropietaryMainComponent } from './propietary/propietary-main/propietary-main.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AccordionModule, AccordionComponent, ModalModule } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    InquilinoComponent,
    AdminMainComponent,
    PropietaryMainComponent,
    UsuariosComponent,
  ],
  providers: [LocalstorageService, AccordionComponent]
})
export class UsuariosModule { }
